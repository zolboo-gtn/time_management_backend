import { Injectable, NotFoundException } from "@nestjs/common";
import { Attendance } from "@prisma/client";
import { PaginationDto } from "common/dtos";
import * as dayjs from "dayjs";

import { PrismaService } from "modules/prisma";
import {
  AddTimestampByCardIdDto,
  AddTimestampByUserIdDto,
  UpdateAttendanceDto,
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
  async update(id: number, data: UpdateAttendanceDto) {
    await this.prisma.attendance.update({ data, where: { id } });
  }
  async addTimestampByCardId({
    timestamp,
    cardId,
  }: AddTimestampByCardIdDto): Promise<Attendance | null> {
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
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    return await this.prisma.attendance.upsert({
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
  async addTimestampByUserId({ timestamp, userId }: AddTimestampByUserIdDto) {
    const today = dayjs().startOf("day").toDate();
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    await this.prisma.attendance.upsert({
      update: {
        timestamps: {
          push: timestamp,
        },
      },
      create: {
        timestamps: [timestamp],
        userId,
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
    });

    const skip = perPage * (page - 1);
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
}
