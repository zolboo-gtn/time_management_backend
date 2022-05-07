import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsString, Matches } from "class-validator";

export class CreateUserDto {
  @IsEmail({
    message: "InvalidEmail",
  })
  readonly email: string;

  @IsString({
    message: "InvalidName",
  })
  readonly name: string;

  @IsEnum(Role, {
    message: "InvalidRole",
  })
  readonly role: Role;

  @IsString({
    message: "InvalidCardId",
  })
  readonly cardId: string;

  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/, {
    message: "InvalidPassword",
  })
  readonly password: string;
}
