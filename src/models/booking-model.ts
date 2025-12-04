import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  bookingNumber: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  serviceType: string;
  description?: string;
  scheduledDate?: Date;
  location?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a customer"],
    },
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    serviceType: {
      type: String,
      required: [true, "Please provide a service type"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of non-deleted bookings
bookingSchema.index({ customer: 1, deletedAt: 1 });

// Generate unique booking number before saving
bookingSchema.pre("save", async function (next) {
  if (!this.isNew || this.bookingNumber) {
    return next();
  }

  const count = await mongoose.model<IBooking>("Booking").countDocuments();
  this.bookingNumber = `BK-${Date.now()}-${count + 1}`;
  next();
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
