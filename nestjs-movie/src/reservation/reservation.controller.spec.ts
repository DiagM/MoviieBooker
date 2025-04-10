import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { BadRequestException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    createReservation: jest.fn(),
    getUserReservations: jest.fn(),
    cancelReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    const mockUser = { user: { userId: 'user123' } };
    const validDto = {
      movieId: 'movie456',
      startTime: '2025-04-10T20:00:00Z',
    };

    it('should call service and return the created reservation', async () => {
      const mockResult = {
        _id: 'resv789',
        ...validDto,
        endTime: '2025-04-10T22:00:00Z',
        userId: mockUser.user.userId,
      };

      mockReservationService.createReservation.mockResolvedValue(mockResult);

      const result = await controller.createReservation(mockUser, validDto);

      expect(service.createReservation).toHaveBeenCalledWith(
        mockUser.user.userId,
        validDto.movieId,
        new Date(validDto.startTime),
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw BadRequestException if movieId or startTime is missing', async () => {
      await expect(
        controller.createReservation(mockUser, {
          movieId: '', 
          startTime: '',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(service.createReservation).not.toHaveBeenCalled();
    });
  });

  describe('getUserReservations', () => {
    it('should call service and return user reservations', async () => {
      const mockReservations = [
        { _id: 'resv1', movieId: 'movie1', startTime: '2025-04-10T18:00:00Z' },
        { _id: 'resv2', movieId: 'movie2', startTime: '2025-04-10T20:00:00Z' },
      ];

      mockReservationService.getUserReservations.mockResolvedValue(
        mockReservations,
      );

      const result = await controller.getUserReservations({
        user: { userId: 'user123' },
      });

      expect(service.getUserReservations).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockReservations);
    });
  });

  describe('cancelReservation', () => {
    it('should call service and cancel a reservation', async () => {
      const mockResponse = { message: 'Réservation annulée avec succès.' };
      mockReservationService.cancelReservation.mockResolvedValue(mockResponse);

      const result = await controller.cancelReservation('resv123', {
        user: { userId: 'user123' },
      });

      expect(service.cancelReservation).toHaveBeenCalledWith(
        'resv123',
        'user123',
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
