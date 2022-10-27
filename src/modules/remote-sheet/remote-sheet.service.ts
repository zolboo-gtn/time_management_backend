import { Injectable } from "@nestjs/common";
import { RemoteSheet, User } from "@prisma/client";
import * as dayjs from "dayjs";

import { PrismaService } from "modules/prisma";
import { PaginationDto } from "common/dtos";

import { RemoteSheetDto } from "./dtos";

@Injectable()
export class RemoteSheetService {
  constructor(private prisma: PrismaService) {}

  async create({ data, userId }: { data: string[]; userId: number }) {
    const _data = [];
    data.map((item) => {
      _data.push({ date: dayjs(item).startOf("day").toISOString(), userId });
    });
    return await this.prisma.remoteSheet.createMany({
      data: _data,
    });
  }

  async delete(id: number) {
    return await this.prisma.remoteSheet.delete({ where: { id } });
  }

  async findOneById(id: number) {
    return await this.prisma.remoteSheet.findFirstOrThrow({ where: { id } });
  }

  async get({
    startDate,
    endDate,
    page = 1,
    perPage = 30,
  }: RemoteSheetDto): Promise<PaginationDto<Partial<any>>> {
    const end = dayjs(endDate ?? dayjs().endOf("week")).endOf("day");
    const start = dayjs(startDate ?? dayjs().startOf("week")).startOf("day");

    const items = await this.prisma.remoteSheet.findMany({
      select: {
        id: true,
        date: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    let dates: string[] = [];
    for (let i = 0; i <= end.diff(start, "day"); i++) {
      dates.push(start.add(i + 1, "day").toISOString());
    }

    let list = [];
    for (const date of dates) {
      const _ll = items.filter((item) => item.date.toISOString() == date);
      list.push(_ll.map((i) => i.user));
    }
    const skip = perPage * (page - 1);
    const paginated = list.slice(skip, page * perPage);

    const totalCount = list.length;
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
