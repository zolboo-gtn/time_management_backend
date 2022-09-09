import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  Process,
  Processor,
} from "@nestjs/bull";
import { Job } from "bull";
import { AttendancesService } from "./attendances.service";

@Processor("pull-attendance")
export class AttendanceProcessor {
  constructor(private readonly attendanceService: AttendancesService) {}

  /** Job listeners */
  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processng job ${job.name}.`);
  }

  @OnQueueError()
  onError(err: Error) {
    console.log(`Error job.`, err);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(`Failed job ${job.name}.`);
  }

  @Process("pull-attendance-from-card")
  async pullFromCardData(job: Job) {
    const date = job.data;
    await this.attendanceService.pullFromCardData(date);
  }
}
