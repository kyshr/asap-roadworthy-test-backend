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

  getBookingById = async (bookingId: string, customerId: string): Promise<IBooking> => {
    const booking = await this.bookingRepository.findByIdAndCustomer(bookingId, customerId);

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return booking;
  };

  createBooking = async (
    customerId: string,
    bookingData: {
      serviceType: string;
      description?: string;
      scheduledDate?: Date | string;
      location?: string;
    }
  ): Promise<IBooking> => {
    const bookingDataToCreate = {
      customer: customerId,
      serviceType: bookingData.serviceType,
      description: bookingData.description,
      location: bookingData.location,
      scheduledDate: bookingData.scheduledDate ? new Date(bookingData.scheduledDate) : undefined,
    };

    const booking = await this.bookingRepository.create(bookingDataToCreate);

    return booking;
  };

  updateBooking = async (
    bookingId: string,
    customerId: string,
    updateData: {
      serviceType?: string;
      description?: string;
      scheduledDate?: Date | string;
      location?: string;
      status?: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
    }
  ): Promise<IBooking> => {
    const updateDataToApply: Partial<IBooking> = {};

    if (updateData.serviceType !== undefined) {
      updateDataToApply.serviceType = updateData.serviceType;
    }
    if (updateData.description !== undefined) {
      updateDataToApply.description = updateData.description;
    }
    if (updateData.location !== undefined) {
      updateDataToApply.location = updateData.location;
    }
    if (updateData.status !== undefined) {
      updateDataToApply.status = updateData.status;
    }
    // Convert scheduledDate string to Date if provided
    if (updateData.scheduledDate !== undefined) {
      updateDataToApply.scheduledDate = new Date(updateData.scheduledDate);
    }

    const booking = await this.bookingRepository.updateByIdAndCustomer(bookingId, customerId, updateDataToApply);

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return booking;
  };

  softDeleteBooking = async (bookingId: string, customerId: string): Promise<void> => {
    const booking = await this.bookingRepository.softDeleteById(bookingId, customerId);

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
  };
}
