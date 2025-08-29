import { z } from "zod";

export const EventBodySchema = z.object({
  eventId: z
    .string({
      error: "eventId is required",
    })
    .min(1, { message: "eventId cannot be empty" }),
  userId: z
    .string({
      error: "userId is required",
    })
    .min(1, { message: "userId cannot be empty" }),
  eventType: z
    .string({
      error: "eventType is required",
    })
    .min(1, { message: "eventType cannot be empty" }),
  timestamp: z
    .string({
      error: "timestamp is required",
    })
    .datetime({ message: "timestamp must be a valid ISO 8601 datetime" }),
});
