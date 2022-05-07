import { Role } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

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

  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/, {
    message: "InvalidPassword",
  })
  readonly password: string;
}
