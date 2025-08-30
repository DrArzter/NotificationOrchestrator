import { PreferencesService } from "../preferences.service";

import { InMemoryStore } from "../../store/in-memory.store";
import { UserPreferences } from "../../types/user-preferences.types";

jest.mock("../../store/in-memory.store");
const MockedInMemoryStore = InMemoryStore as jest.MockedClass<
  typeof InMemoryStore
>;

describe("PreferencesService", () => {
  let preferencesService: PreferencesService;
  let mockPreferencesStore: jest.Mocked<InMemoryStore<UserPreferences>>;

  beforeEach(() => {
    MockedInMemoryStore.mockClear();

    mockPreferencesStore = new MockedInMemoryStore() as jest.Mocked<
      InMemoryStore<UserPreferences>
    >;
    preferencesService = new PreferencesService(mockPreferencesStore);
  });

  describe("findUserPreferences", () => {
    it("should return user preferences", () => {
      const userId = "user123";
      const userPreferences: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };
      mockPreferencesStore.get.mockReturnValue(userPreferences);
      const result = preferencesService.findUserPreferences(userId);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userPreferences);
    });

    it("should return undefined if user preferences are not found", () => {
      const userId = "user123";
      mockPreferencesStore.get.mockReturnValue(undefined);
      const result = preferencesService.findUserPreferences(userId);
      expect(mockPreferencesStore.get).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });

  describe("updateUserPreferences", () => {
    it("should update user preferences", () => {
      const userId = "user123";
      const userPreferences: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };
      const result = preferencesService.updateUserPreferences(
        userId,
        userPreferences
      );
      expect(mockPreferencesStore.set).toHaveBeenCalledWith(
        userId,
        userPreferences
      );
      expect(result).toEqual(userPreferences);
    });
  });
});
