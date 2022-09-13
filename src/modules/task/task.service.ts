import { Cron } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { AttendancesService } from "modules/attendances";
// import { InjectQueue } from "@nestjs/bull"; //REDIS
// import { Queue } from "bull"; //REDIS

@Injectable()
export class TaskService {
  constructor(
    private readonly attendanceService: AttendancesService, // @InjectQueue("pull-attendance") private readonly attendanceQueue: Queue, //REDIS
  ) {}

  @Cron("* 59 23 * * *", { timeZone: "Asia/Ulaanbaatar" })
  async asynchandlePullAttendanceCron() {
    // this.attendanceQueue.add("pull-attendance-from-card", new Date()); //REDIS
    await this.attendanceService.pullFromCardData(new Date()); //no-REDIS
  }
}
