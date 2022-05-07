import { Role, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  id: number;
  email: string;
  name: string | null;
  role: Role;

  @Exclude()
  hash: string;

  constructor(partial: Partial<UserEntity>) {
    // TODO: user class-transformer ==> data validation
    Object.assign(this, partial);
  }

  static usersFromJson = (json: Partial<UserEntity>[]) => {
    return json.map((item) => new UserEntity(item));
  };
}
