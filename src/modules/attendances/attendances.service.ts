import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Attendance, AttendanceType, CardAttendance } from "@prisma/client";
import { PaginationDto } from "common/dtos";
import * as dayjs from "dayjs";

import { PrismaService } from "modules/prisma";
import {
  AddTimestampByCardIdDto,
  ApproveRequestDto,
  MonthlyAttendanceDto,
  SendRequestDto,
  UpdateCardAttendanceDto,
  UpdateRequestDto,
  UserAttendanceDto,
} from "./dtos";

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
    const today = dayjs().startOf("day").toDate();
    const tommorrow = dayjs().add(1, "day").startOf("day").toDate();

    // Өнөөдөр ажил аль хэдийн эхэлчихсэн дуусгаагүй байгаа бол дахиж үүсгэх боломжгүй байна. Буюу өмнөх ажлын цагаа дуусгасны дараа дахиж үүсгэх боломжтой байна.
    const beforeStarted = await this.prisma.attendance.findFirst({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today,
            },
          },
          {
            start: {
              lte: tommorrow,
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
    const today = dayjs().startOf("day").toDate();
    const tommorrow = dayjs().add(1, "day").startOf("day").toDate();

    // Ажлын цаг эхлээгүй бол дуусгах боломжгүй байна.
    const attendance = await this.prisma.attendance.findFirstOrThrow({
      where: {
        userId,
        AND: [
          {
            start: {
              gte: today,
            },
          },
          {
            start: {
              lte: tommorrow,
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

  async approveRequest(
    data: ApproveRequestDto,
    id: number,
    approvedById: number,
  ) {
    return await this.prisma.attendance.update({
      where: {
        id: +id,
      },
      data: {
        ...data,
        approvedById,
        approvedAt: dayjs().toISOString(),
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
      .set("hour", 16)
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
      // if (value.timestamps.length > 1) {
      //   const first = value.timestamps[0];
      //   const last = value.timestamps[value.timestamps.length - 1];
      //   const diffInMinutes = dayjs(last).diff(dayjs(first), "minute");

      //   return total + diffInMinutes;
      // }
      return total;
    }, 0);
    const totalOverTime = items.reduce((total, value) => {
      // if (value.timestamps.length > 1) {
      //   const first = value.timestamps[0];
      //   const last = value.timestamps[value.timestamps.length - 1];
      //   const diffInMinutes = dayjs(last).diff(dayjs(first), "minute");
      //   const overTime = diffInMinutes - 8 * 60;

      //   if (overTime > 0) {
      //     return total + overTime;
      //   }
      // }
      return total;
    }, 0);

    return {
      totalWorkDay,
      totalWorkTime,
      totalOverTime,
    };
  }
}
