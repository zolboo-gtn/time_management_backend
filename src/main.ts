import { ClassSerializerInterceptor } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import {
  CustomValidationErrorFilter,
  HttpExceptionFilter,
  PrismaErrorFilter,
} from "common/exception_filters";
import { CustomValidationPipe } from "common/pipes";
import { AppModule } from "modules/app";
import { PrismaService } from "modules/prisma";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    // logger: ["error"],
  });
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaErrorFilter(),
    new CustomValidationErrorFilter(),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new CustomValidationPipe());

  // https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT || 3000);
};
bootstrap();
