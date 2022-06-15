import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "modules/prisma";
import { CreateUserDto, SearchUsersDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities/user.entity";

import { PaginationDto } from "common/dtos";

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
  }: SearchUsersDto): Promise<PaginationDto<UserEntity[]>> {
    const users = await this.prisma.user.findMany({
      where: {
        cardId: { contains: cardId },
        email: { contains: email },
        name: { contains: name },
        role,
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
    });

    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      items: UserEntity.usersFromJson(users),
      nextPage: nextPage,
      prevPage: prevPage,
      currentPage: page,
      perPage: perPage,
      totalPages: totalPages,
      totalItems: totalCount,
    };
  }
  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return new UserEntity(user);
  }
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return new UserEntity(user);
  }
  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.update({ data, where: { id } });

    return new UserEntity(user);
  }
  async remove(id: number) {
    const user = await this.prisma.user.delete({ where: { id } });

    return new UserEntity(user);
  }
}
