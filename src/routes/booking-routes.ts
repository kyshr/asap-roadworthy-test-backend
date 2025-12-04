import { Router } from "express";
import { bookingController } from "../controllers/booking-controller";
import { protect } from "../middleware/auth-middleware";
import { validate } from "../config/zod-validator";
import {
  getBookingSchema,
  createBookingSchema,
  updateBookingSchema,
  deleteBookingSchema,
} from "../schemas/booking-schema";

const router = Router();

// All booking routes require authentication
router.use(protect);

router.get("/", bookingController.getBookings);
router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking
);
router.get(
  "/:id",
  validate(getBookingSchema),
  bookingController.getBookingById
);
router.put(
  "/:id",
  validate(updateBookingSchema),
  bookingController.updateBooking
);
router.delete(
  "/:id",
  validate(deleteBookingSchema),
  bookingController.deleteBooking
);

export default router;

