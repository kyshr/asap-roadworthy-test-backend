import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { MessageService } from "../services/message-service";
import { asyncHandler } from "../middleware/async-handler";

class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  getMessages = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { bookingId } = req.params;
      const messages = await this.messageService.getMessagesByBooking(
        bookingId,
        req.user.id
      );

      return res.status(200).json({
        success: true,
        data: {
          messages: messages.map((message) => ({
            id: message._id,
            content: message.content,
            sender: message.sender,
            senderType: message.senderType,
            read: message.read,
            booking: message.booking,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          })),
        },
      });
    }
  );

  createMessage = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Not authorized",
        });
      }

      const { bookingId } = req.params;
      const { content } = req.body;

      const message = await this.messageService.createMessage(
        bookingId,
        req.user.id,
        content
      );

      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: {
          message: {
            id: message._id,
            content: message.content,
            sender: message.sender,
            senderType: message.senderType,
            read: message.read,
            booking: message.booking,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          },
        },
      });
    }
  );
}

export const messageController = new MessageController();

