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
            customer: booking.customer,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          },
        },
      });
    }
  );

  createBooking = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const booking = await this.bookingService.createBooking(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: booking.status,
            serviceType: booking.serviceType,
            description: booking.description,
            scheduledDate: booking.scheduledDate,
            location: booking.location,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          },
        },
      });
    }
  );

  updateBooking = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { id } = req.params;
      const booking = await this.bookingService.updateBooking(
        id,
        req.user.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: {
          booking: {
            id: booking._id,
            bookingNumber: booking.bookingNumber,
            status: booking.status,
            serviceType: booking.serviceType,
            description: booking.description,
            scheduledDate: booking.scheduledDate,
            location: booking.location,
            customer: booking.customer,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
          },
        },
      });
    }
  );

  deleteBooking = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { id } = req.params;
      await this.bookingService.softDeleteBooking(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
      });
    }
  );
}

export const bookingController = new BookingController();

