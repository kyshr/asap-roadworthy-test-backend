import { z } from "zod";

export const getBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Booking ID is required"),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    serviceType: z.string().min(1, "Service type is required"),
    description: z.string().optional(),
    scheduledDate: z.union([z.string(), z.date()]).optional(),
    location: z.string().optional(),
  }),
});

export const updateBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Booking ID is required"),
  }),
  body: z.object({
    serviceType: z.string().min(1, "Service type is required").optional(),
    description: z.string().optional(),
    scheduledDate: z.union([z.string(), z.date()]).optional(),
    location: z.string().optional(),
    status: z.enum(["pending", "confirmed", "in-progress", "completed", "cancelled"]).optional(),
  }),
});

export const deleteBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Booking ID is required"),
  }),
});

