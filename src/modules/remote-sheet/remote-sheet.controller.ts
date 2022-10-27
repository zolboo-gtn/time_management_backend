import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IRequestWithUser } from "common/interfaces";
import { JwtAuthGuard } from "modules/auth/guards";
import { RemoteSheetDto } from "./dtos";
import { JwtRoleGuard } from "./guards";
import { RemoteSheetService } from "./remote-sheet.service";

@Controller("remote-sheet")
export class RemoteSheetController {
  constructor(private readonly service: RemoteSheetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: string[], @Req() req: IRequestWithUser) {
    return await this.service.create({
      data,
      userId: +req.user.id,
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, JwtRoleGuard("OWNER"))
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Query() query: RemoteSheetDto, @Req() req: IRequestWithUser) {
    return await this.service.get(query);
  }
}
