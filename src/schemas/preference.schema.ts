import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const DNDSchema = z.object({
  start: z
    .string({
      error: "DND start time is required",
    })
    .regex(timeRegex, {
      message: "Start time must be in HH:mm format (e.g. '22:00')",
    }),

  end: z
    .string({
      error: "DND end time is required",
    })
    .regex(timeRegex, {
      message: "End time must be in HH:mm format (e.g. '22:00')",
    }),
});

const EventSettingSchema = z.object({
  enabled: z.boolean({
    message: "Event enabled status must be a boolean",
  }),
});

const PreferenceBodyOnlySchema = z.object({
  dnd: DNDSchema,
  eventSettings: z
    .record(
      z.string().min(1, { message: "Event type cannot be empty" }),
      EventSettingSchema
    )
    .refine((eventSettings) => Object.keys(eventSettings).length > 0, {
      message: "At least one event setting must be provided",
    }),
});

export const PreferenceBodySchema = PreferenceBodyOnlySchema;
