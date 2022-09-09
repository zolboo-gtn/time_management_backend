import { Module } from "@nestjs/common";

import { MonitorModule } from "modules/monitor";
import { PrismaModule } from "modules/prisma";
import { AttendancesService } from "./attendances.service";
import { AttendancesController } from "./attendances.controller";
import { AttendanceProcessor } from "./attendance.processor";

@Module({
  imports: [MonitorModule, PrismaModule],
  exports: [AttendancesService],
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendanceProcessor],
})
export class AttendancesModule {}
