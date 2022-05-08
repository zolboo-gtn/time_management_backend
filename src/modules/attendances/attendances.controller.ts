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
    @Body() data: UpdateAttendanceDto,
  ) {
    console.log("data", data);
    return await this.attendancesService.update(id, data);
  }

  @Patch("/addTimestamp")
  async addTimestamp(@Body() data: AddTimestampDto) {
    console.log("data", data);

    return await this.attendancesService.addTimestamp(data);
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.attendancesService.remove(id);
  }
}
