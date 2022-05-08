import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";

import { AddTimestampDto, UpdateAttendanceDto } from "./dtos";
import { JwtRoleGuard } from "./guards";
import { AttendancesService } from "./attendances.service";

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Patch("/addTimestamp")
  async addTimestamp(@Body() { timestamp, userId }: AddTimestampDto) {
    console.log("timestamp", timestamp);

    return await this.attendancesService.addTimestamp({
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
    console.log("timestamps", timestamps);
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
