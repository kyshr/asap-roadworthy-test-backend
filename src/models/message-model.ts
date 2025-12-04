import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  booking: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderType: "customer" | "admin";
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Please provide a booking"],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a sender"],
    },
    senderType: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide message content"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
messageSchema.index({ booking: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);

