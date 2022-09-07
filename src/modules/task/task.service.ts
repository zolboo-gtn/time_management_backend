import { Cron } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class TaskService {
  constructor(
    @InjectQueue("pull-attendance") private readonly attendanceQueue: Queue,
  ) {}

  @Cron("* * * * * *", { timeZone: "Asia/Ulaanbaatar" })
  asynchandlePullAttendanceCron() {
    this.attendanceQueue.add("pull-attendance-from-card", new Date());
  }
}
