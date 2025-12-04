import { IBooking } from "../models/booking-model";
import { BookingRepository } from "../repositories/booking-repository";
import { AppError } from "../utils/app-error";

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  getBookingsByCustomer = async (customerId: string): Promise<IBooking[]> => {
    return await this.bookingRepository.findByCustomerId(customerId);
  };

  getBookingById = async (
    bookingId: string,
    customerId: string
  ): Promise<IBooking> => {
    const booking = await this.bookingRepository.findByIdAndCustomer(
      bookingId,
      customerId
    );

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return booking;
  };

  getBookingAttachments = async (
    bookingId: string,
    customerId: string
  ): Promise<IBooking["attachments"]> => {
    const booking = await this.getBookingById(bookingId, customerId);
    return booking.attachments;
  };
}

