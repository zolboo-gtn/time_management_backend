import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "modules/prisma";
import { CreateUserDto, SearchUsersDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities/user.entity";

import { PaginationDto } from "common/dtos";
import dayjs from "dayjs";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ email, name, role, cardId, password }: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        role,
        cardId,
        hash,
      },
    });

    return new UserEntity(user);
  }
  async findAll({
    cardId,
    email,
    name,
    role,
    sortingField,
    sortingOrder,
    page = 1,
    perPage = 30,
  }: SearchUsersDto): Promise<PaginationDto<UserEntity>> {
    const users = await this.prisma.user.findMany({
      where: {
        cardId: { contains: cardId },
        email: { contains: email },
        name: { contains: name },
        role,
        deletedAt: null,
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
    });

    const skip = perPage * (page - 1);
    // TODO: slice vs count()
    const paginated = users.slice(skip, page * perPage);

    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      items: UserEntity.usersFromJson(paginated),
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page,
      perPage: perPage,
      totalPages: totalPages,
      totalItems: totalCount,
    };
  }
  async findOneById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return new UserEntity(user);
  }
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return new UserEntity(user);
  }
  async update(id: number, data: UpdateUserDto) {
    return await this.prisma.user.updateMany({
      data,
      where: { id, deletedAt: null },
    });
  }
  async remove(id: number) {
    return await this.prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: dayjs().toDate() },
    });
  }
}
