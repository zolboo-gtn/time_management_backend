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
import { JwtAuthGuard } from "modules/auth/guards";

import { MonitorService } from "modules/monitor";
import { AttendancesService } from "./attendances.service";
import {
  AddTimestampByCardIdDto,
  EvaluateRequestDto,
  MonthlyAttendanceDto,
  SendRequestDto,
  StartWorkDto,
  UpdateCardAttendanceDto,
  UpdateRequestDto,
  UserAttendanceDto,
  UsersAttendanceDto,
} from "./dtos";
import { JwtRoleGuard } from "./guards";
import { Request } from "express";
import { IRequestWithUser } from "common/interfaces";

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
  async startWork(
    @Body() { type }: StartWorkDto,
    @Req() req: IRequestWithUser,
  ) {
    return await this.attendancesService.startWork({
      type,
      userId: +req.user.id,
    });
  }

  /**
   * Ажлийн цагийг дуусгах.
   * @param req
   * @returns
   */
  @Patch("/end")
  @UseGuards(JwtAuthGuard)
  async endWork(@Req() req: IRequestWithUser) {
    return await this.attendancesService.endWork(+req.user.id);
  }

  /**
   * Чөлөө, өвчтэй, амралтын хүсэлт илгээх
   * @param data
   * @param req
   */
  @Post("/request-send")
  @UseGuards(JwtAuthGuard)
  async requestSend(
    @Body() data: SendRequestDto,
    @Req() req: IRequestWithUser,
  ) {
    return await this.attendancesService.sendRequest(data, +req.user.id);
  }

  /**
   * Ажилтан өөрийн илгээсэн хүсэлтийг засах.
   * :id is attendanceId
   * @param data
   * @param req
   * @returns
   */
  @Patch("/request-update/:id")
  @UseGuards(JwtAuthGuard, JwtRoleGuard("OWNER"))
  async requestUpdate(
    @Body() data: UpdateRequestDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return await this.attendancesService.updateRequest(data, id);
  }

  @Patch("/request-evaluate/:id")
  @UseGuards(JwtAuthGuard, JwtRoleGuard("ADMIN"))
  async requestEvaluate(
    @Body() data: EvaluateRequestDto,
    @Param("id", ParseIntPipe) id: number,
    @Req() req: IRequestWithUser,
  ) {
    return await this.attendancesService.evaluateRequest(
      data,
      id,
      +req.user.id,
    );
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
    return await this.attendancesService.remove(id);
  }

  /**
   *  Сонгосон нэг хэрэглэгчийн ирцийн мэдээлэл авах
   * @param query
   * @returns
   */
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

  @Get("/usersAttendance")
  @UseGuards(JwtRoleGuard("ADMIN"))
  async getUsersAttendance(@Query() query: UsersAttendanceDto) {
    return await this.attendancesService.getUsersAttendance(query);
  }
}
