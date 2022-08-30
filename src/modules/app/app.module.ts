import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { logger } from "common/middlewares";
import { AttendancesController, AttendancesModule } from "modules/attendances";
import { AuthModule } from "modules/auth";
import { BasicStrategy } from "modules/auth/strategies/basic.strategy";
import { TaskModule } from "modules/task/task.module";
import { UsersController, UsersModule } from "modules/users";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    AttendancesModule,
    AuthModule,
    UsersModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, BasicStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(AttendancesController, UsersController);
  }
}
