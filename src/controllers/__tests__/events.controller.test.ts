import request from "supertest";
import express from "express";

import { createEventRouter } from "../../routes/events.routes";
import { EventsService } from "../../services/events.service";
import { InMemoryStore } from "../../store/in-memory.store";
import { UserPreferences } from "../../types/user-preferences.types";
import { Event } from "../../types/events.types";

jest.mock("../../store/in-memory.store");
const MockedInMemoryStore = InMemoryStore as jest.MockedClass<
  typeof InMemoryStore
>;

const mockPreferenceStore = new MockedInMemoryStore() as jest.Mocked<
  InMemoryStore<UserPreferences>
>;

const eventsService = new EventsService(mockPreferenceStore);

const app = express();
app.use(express.json());

const eventRouter = createEventRouter(eventsService);
app.use("/events", eventRouter);

describe("EventsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /events", () => {
    it("should return 200 and DND_ACTIVE when event is inside DND window", async () => {
      const event: Event = {
        eventId: "event123",
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T23:00:00Z",
      };

      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };

      mockPreferenceStore.get.mockReturnValue(userPrefs);

      const response = await request(app).post("/events").send(event);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        eventId: "event123",
        message: "DND_ACTIVE",
        success: false,
      });
    });

    it("should return 200 and USER_PREFERENCES_NOT_FOUND when user preferences are not found", async () => {
      const event: Event = {
        eventId: "event123",
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
      };

      mockPreferenceStore.get.mockReturnValue(undefined);

      const response = await request(app).post("/events").send(event);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: "USER_PREFERENCES_NOT_FOUND",
        eventId: "event123",
      });
    });

    it("should return 200 and USER_UNSUBSCRIBED_FROM_EVENT when user is unsubscribed from event", async () => {
      const event: Event = {
        eventId: "event123",
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
      };

      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: false } },
      };

      mockPreferenceStore.get.mockReturnValue(userPrefs);

      const response = await request(app).post("/events").send(event);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: false,
        message: "USER_UNSUBSCRIBED_FROM_EVENT",
        eventId: "event123",
      });
    });

    it("should return 202 and PROCESS_NOTIFICATION when event is outside DND window", async () => {
      const event: Event = {
        eventId: "event123",
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
      };

      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };

      mockPreferenceStore.get.mockReturnValue(userPrefs);

      const response = await request(app).post("/events").send(event);

      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        success: true,
        message: "PROCESS_NOTIFICATION",
        eventId: "event123",
      });
    });
  });
});
