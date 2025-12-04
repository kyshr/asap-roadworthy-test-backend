import { IMessage, Message } from "../models/message-model";

export class MessageRepository {
  findByBookingId = async (bookingId: string): Promise<IMessage[]> => {
    return await Message.find({ booking: bookingId })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .populate("booking", "bookingNumber");
  };

  findById = async (id: string): Promise<IMessage | null> => {
    return await Message.findById(id)
      .populate("sender", "name email")
      .populate("booking", "bookingNumber");
  };

  create = async (messageData: {
    booking: string;
    sender: string;
    senderType: "customer" | "admin";
    content: string;
  }): Promise<IMessage> => {
    return await Message.create(messageData);
  };

  updateById = async (
    id: string,
    updateData: Partial<IMessage>
  ): Promise<IMessage | null> => {
    return await Message.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("sender", "name email")
      .populate("booking", "bookingNumber");
  };

  markAsRead = async (bookingId: string, userId: string): Promise<void> => {
    await Message.updateMany(
      {
        booking: bookingId,
        sender: { $ne: userId },
        read: false,
      },
      { read: true }
    );
  };
}

