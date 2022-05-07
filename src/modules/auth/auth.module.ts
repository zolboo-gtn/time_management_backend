import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { JWTConfig } from "configs/default.config";
import { PrismaService } from "modules/prisma";
import { UsersModule } from "modules/users";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards";
import { JwtStrategy, LocalStrategy } from "./strategies";

@Module({
  imports: [
    JwtModule.register({
      secret: JWTConfig.secret,
      signOptions: { expiresIn: "1h" },
    }),
    PassportModule,
    UsersModule,
  ],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
