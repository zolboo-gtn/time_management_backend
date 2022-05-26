import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { MonitorService } from "modules/monitor";
import { AttendancesService } from "./attendances.service";
import {
  AddTimestampByCardIdDto,
  AddTimestampByUserIdDto,
  UpdateAttendanceDto,
  UserAttendanceDto,
} from "./dtos";
import { JwtRoleGuard } from "./guards";

@Controller("attendances")
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private monitorService: MonitorService,
  ) {}

  @Patch("/addTimestampByCardId")
  async addTimestampByCardId(
    @Body() { timestamp, cardId }: AddTimestampByCardIdDto,
  ) {
    const attendance = await this.attendancesService.addTimestampByCardId({
      timestamp,
      cardId,
    });
    if (attendance === null) {
      await this.monitorService.unregisteredCard({ cardId });
      return;
    }

    await this.monitorService.notifyMonitors({ timestamp, cardId });
    return;
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

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Get("/userAttendance")
  async getUserAttendance(@Query() query: UserAttendanceDto) {
    return await this.attendancesService.getUserAttendance(query);
  }
}
