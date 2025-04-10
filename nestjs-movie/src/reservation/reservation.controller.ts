import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../user/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiBody({
    description: 'Données nécessaires pour créer une réservation',
    type: CreateReservationDto,
    examples: {
      application_json: {
        summary: 'Exemple de création de réservation',
        value: {
          movieId: '12345',
          startTime: '2025-04-09T18:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Réservation créée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: 'Champs obligatoires manquants.',
  })
  async createReservation(
    @Request() req,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    const { movieId, startTime } = createReservationDto;
    const userId = req.user.userId;

    if (!movieId || !startTime) {
      throw new BadRequestException('Champs obligatoires manquants');
    }

    const startTimeDate = new Date(startTime);
    return this.reservationService.createReservation(
      userId,
      movieId,
      startTimeDate,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer les réservations de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: "Liste des réservations de l'utilisateur.",
    type: [CreateReservationDto], 
    examples: {
      application_json: {
        summary: 'Exemple de réponse pour récupérer les réservations',
        value: [
          {
            movieId: '12345',
            startTime: '2025-04-09T18:00:00Z',
            reservationId: 'abcd1234',
          },
        ],
      },
    },
  })
  async getUserReservations(@Request() req) {
    const userId = req.user.userId;
    return this.reservationService.getUserReservations(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiParam({
    name: 'id',
    description: 'ID de la réservation à annuler',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Réservation annulée avec succès.',
  })
  @ApiResponse({
    status: 400,
    description: "Réservation non trouvée ou erreur de l'utilisateur.",
  })
  async cancelReservation(@Param('id') reservationId: string, @Request() req) {
    const userId = req.user.userId;
    return this.reservationService.cancelReservation(reservationId, userId);
  }
}
