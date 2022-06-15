import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ example: ["items"] })
  items: any;

  @ApiProperty({ example: 1 })
  currentPage!: number;

  @ApiProperty({ example: 1 })
  nextPage!: number | null;

  @ApiProperty({ example: 1 })
  prevPage!: number | null;

  @ApiProperty({ example: 1 })
  perPage!: number;

  @ApiProperty({ example: 1 })
  totalPages!: number;

  @ApiProperty({ example: 1 })
  totalItems!: number;

  constructor(dto: PaginationDto) {
    Object.assign(this, dto);
  }
}
