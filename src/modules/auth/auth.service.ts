import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "modules/prisma";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async changeEmail(id: number, email: string) {
    await this.prisma.user.updateMany({
      data: { email },
      where: { id, deletedAt: null },
    });
  }
  async changePassword(id: number, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await this.prisma.user.updateMany({
      data: { hash },
      where: { id, deletedAt: null },
    });
  }
}
