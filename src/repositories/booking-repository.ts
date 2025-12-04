import { IBooking, Booking } from "../models/booking-model";

export class BookingRepository {
  findByCustomerId = async (customerId: string): Promise<IBooking[]> => {
    return await Booking.find({
      customer: customerId,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .populate("customer", "name email phoneNumber");
  };

  findById = async (id: string): Promise<IBooking | null> => {
    return await Booking.findOne({
      _id: id,
      deletedAt: null,
    }).populate("customer", "name email phoneNumber");
  };

  findByIdAndCustomer = async (id: string, customerId: string): Promise<IBooking | null> => {
    return await Booking.findOne({
      _id: id,
      customer: customerId,
      deletedAt: null,
    }).populate("customer", "name email phoneNumber");
  };

  create = async (bookingData: {
    customer: string;
    serviceType: string;
    description?: string;
    scheduledDate?: Date;
    location?: string;
  }): Promise<IBooking> => {
    return await Booking.create(bookingData);
  };

  updateById = async (id: string, updateData: Partial<IBooking>): Promise<IBooking | null> => {
    return await Booking.findOneAndUpdate({ _id: id, deletedAt: null }, updateData, {
      new: true,
      runValidators: true,
    }).populate("customer", "name email phoneNumber");
  };

  updateByIdAndCustomer = async (
    id: string,
    customerId: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null> => {
    return await Booking.findOneAndUpdate({ _id: id, customer: customerId, deletedAt: null }, updateData, {
      new: true,
      runValidators: true,
    }).populate("customer", "name email phoneNumber");
  };

  softDeleteById = async (id: string, customerId: string): Promise<IBooking | null> => {
    return await Booking.findOneAndUpdate(
      { _id: id, customer: customerId, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    ).populate("customer", "name email phoneNumber");
  };

  deleteById = async (id: string): Promise<boolean> => {
    const result = await Booking.findByIdAndDelete(id);
    return !!result;
  };
}
