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

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() { timestamps }: UpdateAttendanceDto,
  ) {
    return await this.attendancesService.update(id, {
      timestamps: timestamps.map((timestamp) => new Date(timestamp)),
    });
  }

  @Patch("/addTimestamp")
  async addTimestamp(@Body() { timestamp, userId }: AddTimestampDto) {
    return await this.attendancesService.addTimestamp({
      timestamp: new Date(timestamp),
      userId,
    });
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.attendancesService.remove(id);
  }
}
