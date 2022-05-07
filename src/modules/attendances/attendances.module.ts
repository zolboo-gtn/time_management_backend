import { Module } from "@nestjs/common";

import { PrismaModule } from "modules/prisma";
import { AttendancesService } from "./attendances.service";
import { AttendancesController } from "./attendances.controller";

@Module({
  imports: [PrismaModule],
  exports: [AttendancesService],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
