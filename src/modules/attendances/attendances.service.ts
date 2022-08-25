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
import { PaginationDto } from "common/dtos";
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

const STARTHOUR: number = 16; // timeZone +8 үед 16 цаг нь 24 цагтай тэнцэнэ.
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
    const today = dayjs()
      .subtract(1, "day")
      .set("hour", STARTHOUR)
      .startOf("hour");

    // Өнөөдөр ажил аль хэдийн эхэлчихсэн дуусгаагүй байгаа бол дахиж үүсгэх боломжгүй байна. Буюу өмнөх ажлын цагаа дуусгасны дараа дахиж үүсгэх боломжтой байна.
    const beforeStarted = await this.prisma.attendance.findFirst({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today.toDate(),
            },
          },
          {
            start: {
              lt: today.add(1, "day").toDate(),
            },
          },
          {
            end: null,
          },
        ],
      },
    });
    if (beforeStarted)
      throw new HttpException(
        `Today's work has already started.`,
        HttpStatus.BAD_REQUEST,
      );

    return await this.prisma.attendance.create({ data: { type, userId } });
  }

  async endWork(userId: number) {
    const today = dayjs()
      .subtract(1, "day")
      .set("hour", STARTHOUR)
      .startOf("hour");

    // Ажлын цаг эхлээгүй бол дуусгах боломжгүй байна.
    const attendance = await this.prisma.attendance.findFirstOrThrow({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today.toDate(),
            },
          },
          {
            start: {
              lte: today.add(1, "day").toDate(),
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
    const user = await this.prisma.user.findUnique({
      where: {
        cardId,
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

  async getUserAttendance({
    userId,
    startDate,
    endDate,
    sortingField,
    sortingOrder,
    page = 1,
    perPage = 30,
  }: UserAttendanceDto): Promise<PaginationDto<Attendance>> {
    const attendance = await this.prisma.attendance.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
    });

    const skip = perPage * (page - 1);
    // TODO: slice vs count()
    const paginated = attendance.slice(skip, page * perPage);

    const totalCount = attendance.length;
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
      .set("hour", STARTHOUR)
      .startOf("hour");
    const endOfMonth = startOfMonth.add(1, "month");

    const items = await this.prisma.attendance.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth.toDate(),
          lt: endOfMonth.toDate(),
        },
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

      return total + overTime;
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
    page = 1,
    perPage = 30,
  }: UsersAttendanceDto): Promise<PaginationDto<User>> {
    const start = dayjs(startDate ?? new Date())
      .subtract(1, "day")
      .set("hour", STARTHOUR)
      .startOf("hour");
    const end = dayjs(endDate ?? new Date())
      .set("hour", STARTHOUR)
      .startOf("hour");

    const users = await this.prisma.user.findMany({
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
      include: {
        attendance: {
          where: {
            start: {
              gte: startDate ? start.toDate() : undefined,
              lte: endDate ? end.toDate() : undefined,
            },
          },
        },
      },
    });

    const skip = perPage * (page - 1);

    const paginated = users.slice(skip, page * perPage);

    const totalCount = users.length;
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
}
