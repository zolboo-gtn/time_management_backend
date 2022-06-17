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

    let errorResponse: ICustomError = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    if (error instanceof PrismaClientRustPanicError) {
      errorResponse = produce(errorResponse, (draft) => {
        draft.message = error.message;
      });
    } else if (error instanceof PrismaClientValidationError) {
      errorResponse = produce(errorResponse, (draft) => {
        draft.message = error.message;
      });
    } else if (error instanceof PrismaClientKnownRequestError) {
      errorResponse = produce(errorResponse, (draft) => {
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === "P2025") {
          draft.statusCode = HttpStatus.NOT_FOUND;
        }
        draft.code = error.code;
        draft.message = error.message;
      });
    } else if (error instanceof PrismaClientInitializationError) {
      errorResponse = produce(errorResponse, (draft) => {
        draft.message = error.message;
      });
    } else {
      errorResponse = produce(errorResponse, (draft) => {
        draft.message = error.message;
      });
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
