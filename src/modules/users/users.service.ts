import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "modules/prisma";
import { CreateUserDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ email, name, role, password }: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        role,
        hash,
      },
    });

    return new UserEntity(user);
  }
  async findAll() {
    const users = await this.prisma.user.findMany();

    return UserEntity.usersFromJson(users);
  }
  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user);
  }
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
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
