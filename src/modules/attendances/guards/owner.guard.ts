import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AttendancesService } from "../attendances.service";

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly attendancesService: AttendancesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    const attendance = await this.attendancesService.findOneById(+params.id);

    if (attendance.userId === user.id) {
      return true;
    }
    return false;
  }
}
