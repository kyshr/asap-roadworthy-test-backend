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
      unique: true,
      trim: true,
      sparse: true,
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
  // Only generate booking number for new documents
  if (!this.isNew) {
    return next();
  }

  // Always generate booking number if it doesn't exist (auto-generated field)
  if (!this.bookingNumber) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Generate unique booking number with retry logic
    while (!isUnique && attempts < maxAttempts) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 100000); // Increased range for better uniqueness
      this.bookingNumber = `BK-${timestamp}-${random}`;

      // Check if this booking number already exists
      const existingBooking = await mongoose.model<IBooking>("Booking").findOne({
        bookingNumber: this.bookingNumber,
      });

      if (!existingBooking) {
        isUnique = true;
      } else {
        attempts++;
        // Add a small delay to ensure different timestamp on retry
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
    }

    // If still not unique after max attempts, use a more complex format
    if (!isUnique) {
      const timestamp = Date.now();
      const random1 = Math.floor(Math.random() * 100000);
      const random2 = Math.floor(Math.random() * 100000);
      this.bookingNumber = `BK-${timestamp}-${random1}-${random2}`;
    }
  }

  next();
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
