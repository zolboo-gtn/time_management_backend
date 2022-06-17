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

    const { errors } = error;
    const errorResponse: ICustomError = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: Object.values(
        errors.find(({ constraints }) => constraints !== {})?.constraints ?? {},
      ).find((value) => value),
    };

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
