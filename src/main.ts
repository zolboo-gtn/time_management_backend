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
    logger: ["error"],
  });

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaErrorFilter(),
    new CustomValidationErrorFilter(),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new CustomValidationPipe());

  // prisma
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // CORS
  app.enableCors({
    origin: ["http://localhost:3000"],
  });

  await app.listen(process.env.PORT || 3000);
};
bootstrap();
