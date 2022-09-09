import { Attendance, Role, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string;
  role: Role;
  cardId: string;
  attendance: Attendance[];
  deletedAt: Date;

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
