import { Request, Response } from "express";
import { EventsService } from "../services/events.service";

export const sendNotificationHandler = (service: EventsService) => {
  return (req: Request, res: Response) => {
    const event = req.body;

    try {
      const result = service.sendEvent(event);

      if (result.sent) {
        res.status(202).json({
          success: true,
          message: result.message,
          eventId: event.eventId,
        });
      } else {
        res.status(200).json({
          success: false,
          message: result.message,
          eventId: event.eventId,
        });
      }
    } catch (error) {
      console.error("Error processing event:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
