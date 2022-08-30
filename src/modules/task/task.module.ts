import { Module } from "@nestjs/common";
import { AttendancesService } from "modules/attendances";
import { PrismaService } from "modules/prisma";
import { TaskService } from "./task.service";

@Module({
  imports: [],
  providers: [TaskService, AttendancesService, PrismaService],
})
export class TaskModule {}
