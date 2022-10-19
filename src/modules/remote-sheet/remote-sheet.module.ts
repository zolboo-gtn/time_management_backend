import { Module } from "@nestjs/common";
import { PrismaModule } from "modules/prisma";
import { RemoteSheetService } from "./remote-sheet.service";
import { RemoteSheetController } from "./remote-sheet.controller";

@Module({
  imports: [PrismaModule],
  providers: [RemoteSheetService],
  controllers: [RemoteSheetController],
})
export class RemoteSheetModule {}
