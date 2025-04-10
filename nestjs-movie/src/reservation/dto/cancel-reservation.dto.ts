import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CancelReservationDto {
  @ApiProperty({ description: 'ID de la réservation à annuler' })
  @IsString()
  @IsNotEmpty()
  reservationId: string;
}