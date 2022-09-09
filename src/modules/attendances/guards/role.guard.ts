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

export const JwtRoleGuard = (
  ...requiredRoles: (Role | "OWNER")[]
): Type<CanActivate> => {
  @Injectable()
  class JwtRoleGuardMixin extends JwtAuthGuard {
    constructor(private readonly attendancesService: AttendancesService) {
      super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      // EMPTY
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const { user, params } = context
        .switchToHttp()
        .getRequest<IRequestWithUser>();

      if (requiredRoles.some((role) => user.role === role)) return true;

      // OWNER
      if (requiredRoles.includes("OWNER")) {
        const attendance = await this.attendancesService.findOneById(
          +params.id,
        );
        return attendance.userId === user.id;
      }

      return false;
    }
  }

  return mixin(JwtRoleGuardMixin);
};
