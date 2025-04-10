import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID du film à réserver' })
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({ description: 'Heure de début de la réservation' })
  @IsDateString()
  startTime: string;
}
