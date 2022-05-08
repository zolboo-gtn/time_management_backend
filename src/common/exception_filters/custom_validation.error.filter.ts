import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

import { CustomValidationError } from "common/exceptions";
import { ICustomError } from "common/interfaces";

@Catch(CustomValidationError)
export class CustomValidationErrorFilter implements ExceptionFilter {
  catch(error: CustomValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;

    const { errors } = error;
    const errorResponse: ICustomError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: Object.values(
        errors.find(({ constraints }) => constraints !== {})?.constraints ?? {},
      ).find((value) => value),
      message: "CustomValidationErrorFilter",
    };

    response.status(status).json(errorResponse);
  }
}
