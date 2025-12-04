import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { BookingService } from "../services/booking-service";
import { asyncHandler } from "../middleware/async-handler";

class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  getBookings = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const bookings = await this.bookingService.getBookingsByCustomer(
        req.user.id
      );

      return res.status(200).json({
        success: true,
        data: {
          bookings: bookings.map((booking) => ({
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: booking.status,
            serviceType: booking.serviceType,
            description: booking.description,
            scheduledDate: booking.scheduledDate,
            location: booking.location,
            attachmentCount: booking.attachments.length,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          })),
        },
      });
    }
  );

  getBookingById = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { id } = req.params;
      const booking = await this.bookingService.getBookingById(id, req.user.id);

      return res.status(200).json({
        success: true,
        data: {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: booking.status,
            serviceType: booking.serviceType,
            description: booking.description,
            scheduledDate: booking.scheduledDate,
            location: booking.location,
            attachments: booking.attachments.map((attachment) => ({
              id: attachment._id,
              filename: attachment.filename,
              originalName: attachment.originalName,
              mimeType: attachment.mimeType,
              size: attachment.size,
              uploadedAt: attachment.uploadedAt,
            })),
            customer: booking.customer,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          },
        },
      });
    }
  );

  getBookingAttachments = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { id } = req.params;
      const attachments = await this.bookingService.getBookingAttachments(
        id,
        req.user.id
      );

      return res.status(200).json({
        success: true,
        data: {
          attachments: attachments.map((attachment) => ({
            id: attachment._id,
            filename: attachment.filename,
            originalName: attachment.originalName,
            mimeType: attachment.mimeType,
            size: attachment.size,
            path: attachment.path,
            uploadedAt: attachment.uploadedAt,
          })),
        },
      });
    }
  );
}

export const bookingController = new BookingController();

