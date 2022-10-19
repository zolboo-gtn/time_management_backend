import { Injectable } from "@nestjs/common";
import { RemoteSheet, User } from "@prisma/client";
import * as dayjs from "dayjs";

import { PrismaService } from "modules/prisma";
import { PaginationDto } from "common/dtos";

import { RemoteSheetDto } from "./dtos";
import { CreateRemoteSheetDto } from "./dtos/create.dto";

@Injectable()
export class RemoteSheetService {
  constructor(private prisma: PrismaService) {}

  async create({
    data,
    userId,
  }: {
    data: CreateRemoteSheetDto[];
    userId: number;
  }) {
    const _data = [];
    data.map((item) => {
      _data.push({ date: dayjs(item.date).toISOString(), userId });
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

  async getUsers({
    startDate,
    endDate,
    sortingField,
    sortingOrder,
    page = 1,
    perPage = 30,
  }: RemoteSheetDto): Promise<PaginationDto<Partial<User>>> {
    const start = dayjs(startDate ?? new Date()).startOf("day");
    const end = dayjs(endDate ?? new Date()).endOf("day");

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        remoteSheet: {
          select: {
            id: true,
            date: true,
          },
          where: {
            date: {
              gte: startDate ? start.toISOString() : undefined,
              lte: endDate ? end.toISOString() : undefined,
            },
          },
        },
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
      where: {
        deletedAt: null,
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

  async get(
    {
      startDate,
      endDate,
      sortingField,
      sortingOrder,
      page = 1,
      perPage = 30,
    }: RemoteSheetDto,
    userId: number,
  ): Promise<PaginationDto<Partial<RemoteSheet>>> {
    const items = await this.prisma.remoteSheet.findMany({
      select: {
        id: true,
        date: true,
      },
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
}
