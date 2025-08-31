import { Request, Response } from "express";
import { EventsService } from "../services/events.service";
import { Event } from "../types/events.types";

export const sendNotificationHandler = (service: EventsService) => {
  return (req: Request, res: Response) => {
    const event: Event = req.body;

    try {
      const result: { decision: string; message: string } = service.sendEvent(event);

      if (result.decision === "PROCESS_NOTIFICATION") {
        res.status(202).json({
          decision: result.decision,
          message: result.message,
          eventId: event.eventId,
        });
      } else {
        res.status(200).json({
          decision: result.decision,
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
