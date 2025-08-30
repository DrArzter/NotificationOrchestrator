import request from "supertest";
import express from "express";

import { createPreferencesRouter } from "../../routes/preferences.routes";
import { PreferencesService } from "../../services/preferences.service";
import { InMemoryStore } from "../../store/in-memory.store";
import { UserPreferences } from "../../types/user-preferences.types";

jest.mock("../../store/in-memory.store");
const MockedInMemoryStore = InMemoryStore as jest.MockedClass<
  typeof InMemoryStore
>;

const mockPreferencesStore = new MockedInMemoryStore() as jest.Mocked<
  InMemoryStore<UserPreferences>
>;
const preferencesService = new PreferencesService(mockPreferencesStore);

const app = express();
app.use(express.json());

const preferencesRouter = createPreferencesRouter(preferencesService);
app.use("/preferences", preferencesRouter);

describe("PreferencesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /preferences/:userId", () => {
    it("should return user preferences", async () => {
      const userId = "user123";
      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };

      mockPreferencesStore.get.mockReturnValue(userPrefs);

      const response = await request(app).get(`/preferences/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(userPrefs);
    });

    it("should return 404 if user preferences are not found", async () => {
      const userId = "user123";

      mockPreferencesStore.get.mockReturnValue(undefined);
      const response = await request(app).get(`/preferences/${userId}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "USER_PREFERENCES_NOT_FOUND",
      });
    });
  });

  describe("POST /preferences/:userId", () => {
    it("should update user preferences", async () => {
      const userId = "user123";
      const userPrefs: UserPreferences = {
        dnd: { start: "22:00", end: "07:00" },
        eventSettings: { item_shipped: { enabled: true } },
      };
      const response = await request(app)
        .post(`/preferences/${userId}`)
        .send(userPrefs);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(userPrefs);
    });
  });
});
