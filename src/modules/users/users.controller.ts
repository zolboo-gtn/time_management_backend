import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";

import { SearchUsersDto, UpdateUserDto } from "./dtos";
import { JwtRoleGuard } from "./guards";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: SearchUsersDto) {
    return await this.usersService.findAll(query);
  }

  @Get(":id")
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);

    return user;
  }

  @UseGuards(JwtRoleGuard("ADMIN", "OWNER"))
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return await this.usersService.update(id, data);
  }

  @UseGuards(JwtRoleGuard("ADMIN", "OWNER"))
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }
}
