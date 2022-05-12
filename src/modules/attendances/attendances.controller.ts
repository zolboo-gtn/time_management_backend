import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";

import {
  AddTimestampByCardIdDto,
  AddTimestampByUserIdDto,
  UpdateAttendanceDto,
} from "./dtos";
import { JwtRoleGuard } from "./guards";
import { AttendancesService } from "./attendances.service";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Patch("/addTimestampByCardId")
  async addTimestampByCardId(
    @Body() { timestamp, cardId }: AddTimestampByCardIdDto,
  ) {
    return await this.attendancesService.addTimestampByCardId({
      timestamp,
      cardId,
    });
  }
  @Patch("/addTimestampByUserId")
  async addTimestampByUserId(
    @Body() { timestamp, userId }: AddTimestampByUserIdDto,
  ) {
    return await this.attendancesService.addTimestampByUserId({
      timestamp,
      userId,
    });
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() { timestamps }: UpdateAttendanceDto,
  ) {
    return await this.attendancesService.update(id, {
      timestamps,
    });
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.attendancesService.remove(id);
  }
}
