import { Module } from "@nestjs/common";
import { AttendancesService } from "modules/attendances";
import { PrismaService } from "modules/prisma";
import { TaskService } from "./task.service";
// import { BullModule } from "@nestjs/bull"; //REDIS
@Module({
  imports: [
    //REDIS:
    // BullModule.registerQueue({
    //   name: "pull-attendance",
    //   defaultJobOptions: {
    //     removeOnComplete: true,
    //   },
    // }),
  ],
  providers: [TaskService, AttendancesService, PrismaService],
})
export class TaskModule {}
