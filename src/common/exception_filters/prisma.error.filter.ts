import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import {
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime";
import { Request, Response } from "express";
import produce from "immer";

import { ICustomError } from "common/interfaces";

type PrismaError =
  | PrismaClientRustPanicError
  | PrismaClientValidationError
  | PrismaClientKnownRequestError
  | PrismaClientInitializationError
  | PrismaClientUnknownRequestError;
@Catch(
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(error: PrismaError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;

    let errorResponse: ICustomError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    if (error instanceof PrismaClientRustPanicError) {
    } else if (error instanceof PrismaClientValidationError) {
    } else if (error instanceof PrismaClientKnownRequestError) {
      errorResponse = produce(errorResponse, (draft) => {
        draft.code = error.code;
        draft.message = error.message;
      });
    } else if (error instanceof PrismaClientInitializationError) {
    } else {
    }

    response.status(status).json(errorResponse);
  }
}
