import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "modules/auth";
import { PrismaModule } from "modules/prisma";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
