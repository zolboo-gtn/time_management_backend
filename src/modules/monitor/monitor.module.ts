import { Module } from "@nestjs/common";
import { MonitorService } from "./monitor.service";
import { MonitorGateway } from "./monitor.gateway";

@Module({
  exports: [MonitorService],
  providers: [MonitorGateway, MonitorService],
})
export class MonitorModule {}
