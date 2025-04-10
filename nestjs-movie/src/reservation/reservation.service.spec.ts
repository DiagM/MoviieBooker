import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { Reservation } from './schemas/reservation.schema';

describe('ReservationService', () => {
  let service: ReservationService;
  let model: any;

  let mockSave: jest.Mock;

  beforeEach(async () => {
    mockSave = jest.fn();

    const mockReservationConstructor = jest.fn().mockImplementation(() => ({
      save: mockSave,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getModelToken(Reservation.name),
          useValue: Object.assign(mockReservationConstructor, {
            findOne: jest.fn(),
            find: jest.fn(),
            deleteOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    model = module.get(getModelToken(Reservation.name));
  });

  it('should create and return a reservation when no conflict', async () => {
    const userId = 'user123';
    const movieId = 'movie123';
    const startTime = new Date('2025-04-10T18:00:00Z');

    const expectedReservation = {
      _id: 'resv123',
      userId,
      movieId,
      startTime,
      endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000),
    };

    model.findOne.mockResolvedValue(null);
    mockSave.mockResolvedValue(expectedReservation);

    const result = await service.createReservation(userId, movieId, startTime);

    expect(model.findOne).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(expectedReservation);
  });

  describe('createReservation', () => {
    it('should throw ConflictException if a reservation already exists in conflict', async () => {
      const userId = 'user123';
      const movieId = 'movie123';
      const startTime = new Date('2025-04-10T18:00:00Z');

      model.findOne.mockResolvedValue({ _id: 'existingResv' });

      await expect(
        service.createReservation(userId, movieId, startTime),
      ).rejects.toThrow(ConflictException);

      expect(model.findOne).toHaveBeenCalled();
    });
  });
});
