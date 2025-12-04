import { Router } from "express";
import { bookingController } from "../controllers/booking-controller";
import { protect } from "../middleware/auth-middleware";
import { validate } from "../config/zod-validator";
import {
  getBookingSchema,
  getBookingAttachmentsSchema,
} from "../schemas/booking-schema";

const router = Router();

// All booking routes require authentication
router.use(protect);

router.get("/", bookingController.getBookings);
router.get(
  "/:id",
  validate(getBookingSchema),
  bookingController.getBookingById
);
router.get(
  "/:id/attachments",
  validate(getBookingAttachmentsSchema),
  bookingController.getBookingAttachments
);

export default router;

