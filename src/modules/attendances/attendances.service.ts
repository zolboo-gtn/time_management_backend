import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Attendance,
  AttendanceType,
  CardAttendance,
  User,
} from "@prisma/client";
import * as dayjs from "dayjs";

import { PrismaService } from "modules/prisma";
import {
  AddTimestampByCardIdDto,
  EvaluateRequestDto,
  MonthlyAttendanceDto,
  SendRequestDto,
  UpdateCardAttendanceDto,
  UpdateRequestDto,
  UserAttendanceDto,
  UsersAttendanceDto,
} from "./dtos";
import { PaginationDto } from "common/dtos";

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException();
    }

    return attendance;
  }

  async startWork({ type, userId }: { type: AttendanceType; userId: number }) {
    const today = dayjs().startOf("hour");

    // Өнөөдөр ажил аль хэдийн эхэлчихсэн дуусгаагүй байгаа бол дахиж үүсгэх боломжгүй байна. Буюу өмнөх ажлын цагаа дуусгасны дараа дахиж үүсгэх боломжтой байна.
    const isStarted = await this.prisma.attendance.findFirst({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today.toISOString(),
            },
          },
          {
            start: {
              lt: today.add(1, "day").toISOString(),
            },
          },
          {
            end: null,
          },
        ],
      },
    });
    if (isStarted)
      throw new HttpException(
        `Today's work has already started.`,
        HttpStatus.BAD_REQUEST,
      );

    return await this.prisma.attendance.create({
      data: { type, userId, status: "APPROVED" },
    });
  }

  async endWork(userId: number) {
    const today = dayjs().startOf("hour");

    // Ажлын цаг эхлээгүй бол дуусгах боломжгүй байна.
    const attendance = await this.prisma.attendance.findFirstOrThrow({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today.toISOString(),
            },
          },
          {
            start: {
              lte: today.add(1, "day").toISOString(),
            },
          },
          {
            end: null,
          },
        ],
      },
    });

    return await this.prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: { end: dayjs().toISOString() },
    });
  }

  async sendRequest(data: SendRequestDto, userId: number) {
    return await this.prisma.attendance.create({
      data: {
        ...data,
        userId,
        status: "PENDING",
      },
    });
  }

  async updateRequest(data: UpdateRequestDto, id: number) {
    return await this.prisma.attendance.update({
      where: {
        id: +id,
      },
      data,
    });
  }

  async showRequest(id: number): Promise<Attendance> {
    return await this.prisma.attendance.findFirstOrThrow({
      where: { id: +id },
    });
  }

  async evaluateRequest(
    data: EvaluateRequestDto,
    id: number,
    evaluatedById: number,
  ) {
    return await this.prisma.attendance.update({
      where: {
        id: +id,
      },
      data: {
        ...data,
        evaluatedById,
        evaluatedAt: dayjs().toISOString(),
      },
    });
  }

  async updateCardAttendance(id: number, data: UpdateCardAttendanceDto) {
    await this.prisma.cardAttendance.update({ data, where: { id } });
  }

  async addTimestampByCardId({
    timestamp,
    cardId,
  }: AddTimestampByCardIdDto): Promise<CardAttendance | null> {
    const today = dayjs().startOf("day").toDate();
    const user = await this.prisma.user.findFirst({
      where: {
        cardId,
        deletedAt: null,
      },
    });
    // card is not registered
    if (!user) {
      return null;
    }
    const attendance = await this.prisma.cardAttendance.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    return await this.prisma.cardAttendance.upsert({
      update: {
        timestamps: {
          push: timestamp,
        },
      },
      create: {
        timestamps: [timestamp],
        userId: user.id,
      },
      where: { id: attendance?.id ?? -1 },
    });
  }

  async remove(id: number) {
    await this.prisma.attendance.delete({ where: { id } });
  }

  async getAttendances({
    userId,
    startDate,
    endDate,
    type,
    status,
    sortingField,
    sortingOrder,
    page = 1,
    perPage = 30,
  }: UserAttendanceDto): Promise<PaginationDto<Partial<Attendance>>> {
    const start = dayjs(startDate ?? new Date()).startOf("day");
    const end = dayjs(endDate ?? new Date()).endOf("day");

    const items = await this.prisma.attendance.findMany({
      select: {
        id: true,
        start: true,
        end: true,
        type: true,
        status: true,
        comment: true,
        evaluatedAt: true,
        evaluatedBy: true,
        evaluatedById: true,
        user: {
          select: {
            id: true,
            name: true,
            cardId: true,
          },
        },
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
      where: {
        userId,
        start: {
          gte: startDate ? start.toISOString() : undefined,
          lte: endDate ? end.toISOString() : undefined,
        },
        type,
        status,
      },
    });

    const skip = perPage * (page - 1);

    const paginated = items.slice(skip, page * perPage);

    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      items: paginated,
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page,
      perPage: perPage,
      totalPages: totalPages,
      totalItems: totalCount,
    };
  }

  async getMonthlyAttendance({ date, userId }: MonthlyAttendanceDto): Promise<{
    totalWorkDay: number;
    totalWorkTime: number;
    totalOverTime: number;
  }> {
    const now = dayjs(date ?? new Date());

    const startOfMonth = now
      .subtract(now.date() > 25 ? 0 : 1, "month")
      .set("date", 25)
      .startOf("hour");
    const endOfMonth = startOfMonth.add(1, "month");

    const items = await this.prisma.attendance.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth.toISOString(),
          lt: endOfMonth.toISOString(),
        },
        type: { in: ["OFFICE", "REMOTE"] },
        status: "APPROVED",
      },
    });

    const totalWorkDay = items.length;
    const totalWorkTime = items.reduce((total, value) => {
      const diffInMinutes = dayjs(value.end).diff(dayjs(value.start), "minute");

      return total + diffInMinutes;
    }, 0);

    const totalOverTime = items.reduce((total, value) => {
      const diffInMinutes = dayjs(value.end).diff(dayjs(value.start), "minute");
      const overTime = diffInMinutes - 8 * 60;
      if (overTime > 0) return total + overTime;
    }, 0);

    return {
      totalWorkDay,
      totalWorkTime,
      totalOverTime,
    };
  }

  async getUsersAttendance({
    startDate,
    endDate,
    sortingField,
    sortingOrder,
    type,
    status,
    page = 1,
    perPage = 30,
  }: UsersAttendanceDto): Promise<PaginationDto<Partial<User>>> {
    const end = dayjs(endDate ?? new Date()).endOf("day");
    const start = dayjs(
      startDate ??
        end.subtract(end.date() > 25 ? 0 : 1, "month").set("date", 25),
    ).startOf("day");

    const users = await this.prisma.user.findMany({
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        cardId: true,
        attendance: {
          select: {
            id: true,
            start: true,
            end: true,
            type: true,
            status: true,
          },
          where: {
            start: {
              gte: startDate ? start.toISOString() : undefined,
              lte: endDate ? end.toISOString() : undefined,
            },
            type,
            status,
          },
        },
      },
    });

    const skip = perPage * (page - 1);
    const paginated = users.slice(skip, page * perPage);

    let list: userAttendanceType[] = [];
    let dates: dayjs.Dayjs[] = [];

    for (let i = 0; i <= end.diff(start, "day"); i++) {
      dates.push(start.add(i + 1, "day"));
    }

    for (const user of paginated) {
      const _attendance = dates.map((_date) =>
        user.attendance.filter((element) => {
          if (
            dayjs(element.start) >= _date.startOf("day") &&
            dayjs(element.end) <= _date.endOf("day")
          ) {
            return element;
          } else {
            let _diff: number = dayjs(element.end).diff(
              dayjs(element.start),
              "day",
            );
            if (
              dayjs(element.start) <= _date.endOf("day") &&
              dayjs(element.end) >= _date.startOf("day") &&
              dayjs(element.end) <= _date.add(_diff + 1, "day").endOf("day")
            )
              return element;
          }
        }),
      );

      list.push({
        id: user.id,
        name: user.name,
        cardId: user.cardId,
        attendances: _attendance,
      });
    }

    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      items: list,
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page,
      perPage: perPage,
      totalPages: totalPages,
      totalItems: totalCount,
    };
  }

  async pullFromCardData(date: Date) {
    const items = await this.prisma.cardAttendance.findMany({
      where: {
        createdAt: {
          gte: dayjs(date).startOf("day").toISOString(),
          lte: dayjs(date).endOf("day").toISOString(),
        },
      },
    });

    const ACCEPTEDHOUR = 9;
    for (const item of items) {
      const isNormal =
        item.timestamps.length === 2 &&
        dayjs(item.timestamps[1]).diff(dayjs(item.timestamps[0]), "hour") >=
          ACCEPTEDHOUR;

      const end = isNormal ? item.timestamps[1] : item.timestamps.at(-1);
      const status = isNormal ? "APPROVED" : "PENDING";

      await this.prisma.attendance.create({
        data: {
          userId: item.userId,
          start: item.timestamps[0],
          end,
          type: "OFFICE",
          status,
        },
      });
    }
  }
}
type userAttendanceType = {
  id: number;
  name: string;
  cardId: string;
  attendances: (
    | {
        id: number;
        start: Date;
        end: Date;
        type: string;
        status: string;
      }[]
    | null
  )[];
};
