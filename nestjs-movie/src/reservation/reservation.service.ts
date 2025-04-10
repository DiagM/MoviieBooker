import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
  ) {}

  // Création d'une réservation
  async createReservation(userId: string, movieId: string, startTime: Date) {
    const movieDuration = 2 * 60 * 60 * 1000; // 2h en ms
    const endTime = new Date(startTime.getTime() + movieDuration);

    // Vérifier si l'utilisateur a une réservation dans les 2h précédentes ou suivantes
    const conflict = await this.reservationModel.findOne({
      userId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflict) {
      throw new ConflictException(
        'Conflit avec une autre réservation. Respectez un délai de 2h entre deux films.',
      );
    }

    const reservation = new this.reservationModel({
      userId,
      movieId,
      startTime,
      endTime,
    });

    return reservation.save();
  }

  // Lister les réservations d’un utilisateur
  async getUserReservations(userId: string) {
    return this.reservationModel.find({ userId }).sort({ startTime: 1 });
  }

  // Annuler une réservation
  async cancelReservation(reservationId: string, userId: string) {
    const reservation = await this.reservationModel.findOne({
      _id: reservationId,
      userId,
    });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable.');
    }

    await this.reservationModel.deleteOne({ _id: reservationId });
    return { message: 'Réservation annulée avec succès.' };
  }
}
