import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "modules/prisma";
import { AddTimestampDto, UpdateAttendanceDto } from "./dtos";

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
  async addTimestamp({ timestamp, userId }: AddTimestampDto) {
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
}
