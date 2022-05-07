import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { IRequestWithUser } from "common/interfaces";

export const RequestUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest<IRequestWithUser>();

    return user;
  },
);
