import mongoose, { Document, Schema } from "mongoose";

export interface IFileAttachment extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: Date;
}

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  bookingNumber: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  serviceType: string;
  description?: string;
  scheduledDate?: Date;
  location?: string;
  attachments: IFileAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const fileAttachmentSchema = new Schema<IFileAttachment>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

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
    attachments: [fileAttachmentSchema],
  },
  {
    timestamps: true,
  }
);

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
