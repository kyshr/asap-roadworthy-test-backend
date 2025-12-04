import { z } from "zod";

export const getMessagesSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
  }),
});

export const createMessageSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Message content is required")
      .max(5000, "Message content must be less than 5000 characters"),
  }),
});

