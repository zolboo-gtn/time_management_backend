import { BasicStrategy as Strategy } from "passport-http";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { env } from "process";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
      env.HTTP_BASIC_USERNAME === username &&
      env.HTTP_BASIC_PASSWORD === password
    )
      return true;
    throw new UnauthorizedException();
  };
}
