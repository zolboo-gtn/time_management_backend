import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from "@nestjs/common";
import { Role } from "@prisma/client";

import { JwtAuthGuard } from "modules/auth/guards";
import { IRequestWithUser } from "common/interfaces";
import { UsersService } from "modules/users/users.service";

export const JwtRoleGuard = (
  ...requiredRoles: (Role | "OWNER")[]
): Type<CanActivate> => {
  @Injectable()
  class JwtRoleGuardMixin extends JwtAuthGuard {
    constructor(private readonly usersService: UsersService) {
      super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      // EMPTY
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const { params, user } = context
        .switchToHttp()
        .getRequest<IRequestWithUser>();

      //
      if (requiredRoles.some((role) => user.role === role)) {
        return true;
      }

      // OWNER
      if (requiredRoles.includes("OWNER")) {
        const resource = await this.usersService.findOneById(+params.id);
        return resource.id === user.id;
      }

      return false;
    }
  }

  return mixin(JwtRoleGuardMixin);
};
