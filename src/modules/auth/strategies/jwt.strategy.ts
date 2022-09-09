import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UsersService } from "modules/users";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("jwt.secret"),
    });
  }

  async validate(payload: IJWTPayload) {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
interface IJWTPayload {
  email: string;
  sub: number;
}
