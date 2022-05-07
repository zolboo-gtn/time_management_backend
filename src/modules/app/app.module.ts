import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { logger } from "common/middlewares";
import { AuthModule } from "modules/auth";
import { UsersController, UsersModule } from "modules/users";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(UsersController);
  }
}
