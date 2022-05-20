import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "modules/prisma";
import { CreateUserDto, SearchUsersDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities/user.entity";

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
  }: SearchUsersDto) {
    const users = await this.prisma.user.findMany({
      where: {
        cardId: { contains: cardId },
        email: { contains: email },
        name: { contains: name },
        role,
      },
      orderBy: sortingField ? { [sortingField]: sortingOrder } : undefined,
    });

    return UserEntity.usersFromJson(users);
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
