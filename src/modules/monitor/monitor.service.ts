import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

import { AddTimestampByCardIdDto } from "modules/attendances/dtos";

@Injectable()
export class MonitorService {
  public server: Server | null = null;

  async notifyMonitors(data: AddTimestampByCardIdDto) {
    this.server?.emit("notify_monitors", data);
  }
}
