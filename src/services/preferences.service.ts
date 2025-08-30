import { InMemoryStore } from "../store/in-memory.store";
import { UserPreferences } from "src/types/user-preferences.types";

export class PreferencesService {
  constructor(
    private readonly preferencesStore: InMemoryStore<UserPreferences>
  ) {}

  public findUserPreferences(userId: string): UserPreferences | undefined {
    console.log(`Searching for preferences for user ${userId}`);
    const prefs = this.preferencesStore.get(userId);
    if (!prefs) {
      console.log("User preferences not found");
      return undefined;
    } else {
      console.log("User preferences found");
      return this.preferencesStore.get(userId);
    }
  }

  public updateUserPreferences(
    userId: string,
    prefs: UserPreferences
  ): UserPreferences {
    console.log(`Updating preferences for user ${userId}`);
    this.preferencesStore.set(userId, prefs);
    return prefs;
  }
}
