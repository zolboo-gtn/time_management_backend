import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { PrismaService } from "modules/prisma";
import { UsersModule } from "modules/users";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards";
import { JwtStrategy, LocalStrategy } from "./strategies";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: { expiresIn: "1h" },
      }),
      inject: [ConfigService],
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
