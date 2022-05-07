import { ClassSerializerInterceptor } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import {
  HttpExceptionFilter,
  PrismaErrorFilter,
} from "common/exception_filters";
import { AppModule } from "modules/app";
import { PrismaService } from "modules/prisma";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ["error"],
  });
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaErrorFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT || 3000);
};
bootstrap();
