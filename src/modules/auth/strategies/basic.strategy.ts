import { BasicStrategy as Strategy } from "passport-http";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  /**
   * Basic Auth validation.
   * @param req
   * @param username HTTP_BASIC_USERNAME
   * @param password HTTP_BASIC_PASSWORD
   * @returns
   */
  public validate = async (req, username, password): Promise<Boolean> => {
    if (
      this.configService.get<string>("auth.http_basic_username") === username &&
      this.configService.get<string>("auth.http_basic_password") === password
    )
      return true;
    throw new UnauthorizedException();
  };
}
