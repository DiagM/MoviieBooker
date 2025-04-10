import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of movies' })
  @ApiResponse({ status: 200, description: 'List of movies' })

  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: '1',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for movie',
    example: 'batman',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort by field',
    example: 'popularity.desc',
  })
  async getMovies(
    @Query('page') page: string = '1',
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'popularity.desc',
  ) {
    
    const pageNumber = parseInt(page);
    const searchQuery = search.trim();

   
    return this.moviesService.getMovies({
      page: pageNumber,
      search: searchQuery || '', 
      sort,
    });
  }
}
