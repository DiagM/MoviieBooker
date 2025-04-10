// src/movies/movies.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL')!;
    this.apiKey = this.configService.get<string>('TMDB_API_KEY')!;
  }

  async getMovies(params: { page: number; search: string; sort: string }) {
    const { page, search, sort } = params;

    // Set the URL based on whether the search query is provided or not
    const url = search
      ? `${this.baseUrl}/search/movie`
      : `${this.baseUrl}/discover/movie`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          params: {
            api_key: this.apiKey,
            page,
            query: search || undefined, // Pass the search query if it's not empty
            sort_by: sort, // Make sure to pass the sort parameter here
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new Error('Error fetching movies from TMDb');
    }
  }
}
