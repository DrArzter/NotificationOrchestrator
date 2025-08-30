import { EventsService } from "../events.service";
import { Event } from "../../types/events.types";

import { InMemoryStore } from "../../store/in-memory.store";
import { UserPreferences } from "../../types/user-preferences.types";

jest.mock("../../store/in-memory.store");
const MockedInMemoryStore = InMemoryStore as jest.MockedClass<
  typeof InMemoryStore
>;

describe("EventsService", () => {
  let eventsService: EventsService;
  let mockPreferencesStore: jest.Mocked<InMemoryStore<UserPreferences>>;

  beforeEach(() => {
    MockedInMemoryStore.mockClear();

    mockPreferencesStore = new MockedInMemoryStore() as jest.Mocked<
      InMemoryStore<UserPreferences>
    >;
    eventsService = new EventsService(mockPreferencesStore);
  });

  describe("sendEvent", () => {
    it("Should return DND_ACTIVE when event is inside overnight DND window", () => {
      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };

      const event: Event = {
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T23:00:00Z",
        eventId: "evt1",
      };

      mockPreferencesStore.get.mockReturnValue(userPrefs);

      const result = eventsService.sendEvent(event);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith("user123");
      expect(result.sent).toBe(false);
      expect(result.message).toBe("DND_ACTIVE");
    });

    it("Should return PROCESS_NOTIFICATION when event is outside DND window", () => {
      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };

      const event: Event = {
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
        eventId: "evt1",
      };

      mockPreferencesStore.get.mockReturnValue(userPrefs);

      const result = eventsService.sendEvent(event);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith("user123");
      expect(result.sent).toBe(true);
      expect(result.message).toBe("PROCESS_NOTIFICATION");
    });

    it("Should return USER_UNSUBSCRIBED_FROM_EVENT when user is unsubscribed from event", () => {
      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: false } },
      };

      const event: Event = {
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
        eventId: "evt1",
      };

      mockPreferencesStore.get.mockReturnValue(userPrefs);

      const result = eventsService.sendEvent(event);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith("user123");
      expect(result.sent).toBe(false);
      expect(result.message).toBe("USER_UNSUBSCRIBED_FROM_EVENT");
    });

    it("Should return USER_PREFERENCES_NOT_FOUND when user preferences are not found", () => {
      const event: Event = {
        userId: "user123",
        eventType: "item_shipped",
        timestamp: "2025-08-01T21:00:00Z",
        eventId: "evt1",
      };

      mockPreferencesStore.get.mockReturnValue(undefined);

      const result = eventsService.sendEvent(event);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith("user123");
      expect(result.sent).toBe(false);
      expect(result.message).toBe("USER_PREFERENCES_NOT_FOUND");
    });
  });
});
