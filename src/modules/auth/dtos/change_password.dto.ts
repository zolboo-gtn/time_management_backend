import { PickType } from "@nestjs/mapped-types";

import { CreateUserDto } from "modules/users";

export class ChangePasswordDto extends PickType(CreateUserDto, ["password"]) {}
