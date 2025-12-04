import { Router } from "express";
import authRoutes from "./auth-routes";
import bookingRoutes from "./booking-routes";
import messageRoutes from "./message-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/messages", messageRoutes);

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
