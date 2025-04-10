import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule, 
    ConfigModule, 
  ],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
