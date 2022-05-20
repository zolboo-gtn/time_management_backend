import { Injectable, NotFoundException } from "@nestjs/common";

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
  async addTimestampByCardId({ timestamp, cardId }: AddTimestampByCardIdDto) {
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const user = await this.prisma.user.findUnique({
      where: {
        cardId,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId: user.id,
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
        userId: user.id,
      },
      where: { id: attendance?.id ?? -1 },
    });
  }
  async addTimestampByUserId({ timestamp, userId }: AddTimestampByUserIdDto) {
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
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
  async getUserAttendance({ userId, startDate, endDate }: UserAttendanceDto) {
    const attendance = await this.prisma.attendance.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lt: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    return attendance;
  }
}
