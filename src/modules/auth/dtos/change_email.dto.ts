import { PickType } from "@nestjs/mapped-types";

import { CreateUserDto } from "modules/users";

export class ChangeEmailDto extends PickType(CreateUserDto, ["email"]) {}
