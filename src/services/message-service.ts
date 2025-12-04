import { IMessage } from "../models/message-model";
import { MessageRepository } from "../repositories/message-repository";
import { BookingRepository } from "../repositories/booking-repository";
import { AppError } from "../utils/app-error";

export class MessageService {
  private messageRepository: MessageRepository;
  private bookingRepository: BookingRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.bookingRepository = new BookingRepository();
  }

  getMessagesByBooking = async (
    bookingId: string,
    customerId: string
  ): Promise<IMessage[]> => {
    // Verify booking belongs to customer
    const booking = await this.bookingRepository.findByIdAndCustomer(
      bookingId,
      customerId
    );

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return await this.messageRepository.findByBookingId(bookingId);
  };

  createMessage = async (
    bookingId: string,
    customerId: string,
    content: string
  ): Promise<IMessage> => {
    // Verify booking belongs to customer
    const booking = await this.bookingRepository.findByIdAndCustomer(
      bookingId,
      customerId
    );

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    const message = await this.messageRepository.create({
      booking: bookingId,
      sender: customerId,
      senderType: "customer",
      content,
    });

    return message;
  };
}

