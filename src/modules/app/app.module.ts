import { BullModule } from "@nestjs/bull";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "modules/auth";
import { AttendancesController, AttendancesModule } from "modules/attendances";
import { logger } from "common/middlewares";
import { UsersController, UsersModule } from "modules/users";
import { TaskModule } from "modules/task";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BasicStrategy } from "modules/auth/strategies";
import { configuration, validationSchema } from "configs";

@Module({
  imports: [
    AttendancesModule,
    AuthModule,
    UsersModule,
    ScheduleModule.forRoot(),
    TaskModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>("redis.host"),
          port: Number(configService.get<number>("redis.port")),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BasicStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(AttendancesController, UsersController);
  }
}
