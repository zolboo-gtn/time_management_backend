import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

import { ICustomError } from "common/interfaces";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.debug("HttpExceptionFilter", exception);

    const errorResponse: ICustomError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(errorResponse);
  }
}
