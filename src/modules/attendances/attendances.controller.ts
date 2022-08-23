import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { AttendanceType } from "@prisma/client";
import { PrismaErrorFilter } from "common/exception_filters";
import { JwtAuthGuard } from "modules/auth/guards";

import { MonitorService } from "modules/monitor";
import { AttendancesService } from "./attendances.service";
import {
  AddTimestampByCardIdDto,
  MonthlyAttendanceDto,
  StartWorkDto,
  UpdateCardAttendanceDto,
  UserAttendanceDto,
} from "./dtos";
import { JwtRoleGuard } from "./guards";

@Controller("attendances")
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private monitorService: MonitorService,
  ) {}

  // TODO: Add basic auth
  @Patch("/addTimestampByCardId")
  async addTimestampByCardId(
    @Body() { timestamp, cardId }: AddTimestampByCardIdDto,
  ) {
    const attendance = await this.attendancesService.addTimestampByCardId({
      timestamp,
      cardId,
    });
    if (attendance === null) {
      await this.monitorService.nonRegisteredCard({ cardId });
      return;
    }

    await this.monitorService.notifyMonitors({ timestamp, cardId });
    return;
  }

  /**
   * Start working hours when AttendanceType is only OFFICE or REMOTE.
   *
   * @param StartWorkDto
   * @param req
   * @returns
   */
  @Post("/start")
  @UseGuards(JwtAuthGuard)
  async startWork(@Body() { type }: StartWorkDto, @Req() req: any) {
    return await this.attendancesService.startWork({
      type,
      userId: +req.user.id,
    });
  }

  @Patch("/end")
  @UseGuards(JwtAuthGuard)
  @UseFilters(new PrismaErrorFilter())
  async endWork(@Req() req: any) {
    return await this.attendancesService.endWork(+req.user.id);
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() { timestamps }: UpdateCardAttendanceDto,
  ) {
    return await this.attendancesService.updateCardAttendance(id, {
      timestamps,
    });
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.attendancesService.remove(id); //TODO:
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Get("/userAttendance")
  async getUserAttendance(@Query() query: UserAttendanceDto) {
    return await this.attendancesService.getUserAttendance(query);
  }

  @UseGuards(JwtRoleGuard("ADMIN"))
  @Get("/monthlyAttendance")
  async getMonthlyAttendance(@Query() query: MonthlyAttendanceDto) {
    return await this.attendancesService.getMonthlyAttendance(query);
  }
}
