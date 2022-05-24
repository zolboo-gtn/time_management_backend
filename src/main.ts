import { ClassSerializerInterceptor, INestApplication } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import {
  CustomValidationErrorFilter,
  HttpExceptionFilter,
  PrismaErrorFilter,
} from "common/exception_filters";
import { CustomValidationPipe } from "common/pipes";
import { AppModule } from "modules/app";
import { PrismaService } from "modules/prisma";

const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Title")
    .setDescription("Description")
    .setVersion("Version")
    .setBasePath("https://afternoon-garden-59095.herokuapp.com")
    .addTag("tag")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
};

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

  // swagger
  setupSwagger(app);

  // CORS
  app.enableCors({
    origin: ["http://localhost:3000"],
  });

  await app.listen(process.env.PORT || 3001);
};
bootstrap();
