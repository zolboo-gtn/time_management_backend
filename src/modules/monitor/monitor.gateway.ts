import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { MonitorService } from "./monitor.service";

@WebSocketGateway({
  cors: {
    origin: [
      "http://localhost:3000",
      "https://time-attendance-management.herokuapp.com",
    ],
  },
})
export class MonitorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private monitorService: MonitorService) {}

  afterInit(server: Server) {
    this.monitorService.server = server;
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.debug(`connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.debug(`disconnected: ${client.id}`);
  }
}
