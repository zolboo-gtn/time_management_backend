import { Request } from "express";

// import { UserEntity } from "modules/users";

export interface IRequestWithUser extends Request {
  // user: UserEntity;
  user: any;
}
