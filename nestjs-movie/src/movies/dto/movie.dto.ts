import { ApiProperty } from '@nestjs/swagger';

export class MovieSearchDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Search query for movie',
    required: false,
    example: 'batman',
  })
  search?: string;

  @ApiProperty({
    description: 'Sort by field',
    required: false,
    example: 'popularity.desc',
  })
  sort?: string;
}
