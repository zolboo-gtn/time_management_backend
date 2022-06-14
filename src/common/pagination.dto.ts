import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ example: ["users"] })
  users: any;

  @ApiProperty({ example: 1 })
  currentPage!: number;

  @ApiProperty({ example: 1 })
  perPage!: number;

  @ApiProperty({ example: 1 })
  totalPage!: number;

  @ApiProperty({ example: 1 })
  itemTotalCount!: number;

  constructor(dto: PaginationDto) {
    Object.assign(this, dto);
  }
}
