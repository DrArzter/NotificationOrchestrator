import { InMemoryStore } from "../store/in-memory.store";
import { UserPreferences } from "src/types/user-preferences.types";

export class PreferencesService {
  constructor(
    private readonly preferencesStore: InMemoryStore<UserPreferences>
  ) {}

  public findUserPreferences(userId: string): UserPreferences | undefined {
    console.log(`Searching for preferences for user ${userId}`);
    return this.preferencesStore.get(userId);
  }

  public updateUserPreferences(
    userId: string,
    prefs: UserPreferences
  ): UserPreferences {
    console.log(`Updating preferences for user ${userId}`);
    console.log(prefs)
    this.preferencesStore.set(userId, prefs);
    return prefs;
  }
}
