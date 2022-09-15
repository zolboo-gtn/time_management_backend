import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { RequestUser } from "common/decorators";
import { BasicAuthGuard } from "modules/attendances/guards";
import { JwtAuthGuard, LocalAuthGuard } from "modules/auth/guards";
import { UserEntity, UsersService, CreateUserDto } from "modules/users";

import { AuthService } from "./auth.service";
import { ChangeEmailDto, ChangePasswordDto } from "./dtos";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(BasicAuthGuard, LocalAuthGuard)
  @Post("login")
  async login(@RequestUser() user: UserEntity) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      name: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  @Post("register")
  async register(@Body() data: CreateUserDto) {
    const user = await this.usersService.create(data);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      name: user.name,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/change_email")
  async changeEmail(
    @RequestUser() user: UserEntity,
    @Body() data: ChangeEmailDto,
  ) {
    return await this.authService.changeEmail(user.id, data.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/change_password")
  async changePassword(
    @RequestUser() user: UserEntity,
    @Body() data: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user.id, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  async getProfile(@RequestUser() user: UserEntity) {
    return user;
  }
}
