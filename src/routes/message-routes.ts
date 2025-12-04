import { Router } from "express";
import { messageController } from "../controllers/message-controller";
import { protect } from "../middleware/auth-middleware";
import { validate } from "../config/zod-validator";
import {
  getMessagesSchema,
  createMessageSchema,
} from "../schemas/message-schema";

const router = Router();

// All message routes require authentication
router.use(protect);

router.get(
  "/booking/:bookingId",
  validate(getMessagesSchema),
  messageController.getMessages
);
router.post(
  "/booking/:bookingId",
  validate(createMessageSchema),
  messageController.createMessage
);

export default router;

