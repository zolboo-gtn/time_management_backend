import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto<T> {
  @ApiProperty({ example: ["items"] })
  items: T[];

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

  constructor(dto: PaginationDto<T>) {
    Object.assign(this, dto);
  }
}
