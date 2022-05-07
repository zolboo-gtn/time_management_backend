import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import * as bcrypt from "bcrypt";
import { Strategy } from "passport-local";

import { UsersService } from "modules/users";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!(user && (await bcrypt.compare(password, user.hash)))) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
