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
import { AttendancesService } from "modules/attendances/attendances.service";

export const JwtRoleGuard = (...requiredRoles: Role[]): Type<CanActivate> => {
  @Injectable()
  class JwtRoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      // EMPTY
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest<IRequestWithUser>();

      return requiredRoles.some((role) => user.role === role);
    }
  }

  return mixin(JwtRoleGuardMixin);
};
