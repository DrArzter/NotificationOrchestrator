import { InMemoryStore } from "../store/in-memory.store";
import { UserPreferences } from "../types/user-preferences.types";
import { Event } from "../types/events.types";

export class EventsService {
  constructor(
    private readonly preferencesStore: InMemoryStore<UserPreferences>
  ) {}

  public sendEvent(event: Event): { sent: boolean; message: string } {
    console.log(`Processing event ${event.eventId} for user ${event.userId}`);

    const userPrefs = this.preferencesStore.get(event.userId);

    if (!userPrefs) {
      return { sent: false, message: "USER_PREFERENCES_NOT_FOUND" };
    }

    const eventSetting = userPrefs.eventSettings[event.eventType];
    if (!eventSetting || !eventSetting.enabled) {
      return { sent: false, message: "USER_UNSUBSCRIBED_FROM_EVENT" };
    }

    if (this.isInDNDPeriod(userPrefs.dnd, event.timestamp)) {
      return { sent: false, message: "DND_ACTIVE" };
    }

    console.log(`Sending notification for event ${event.eventId} to user ${event.userId}`);
    return { sent: true, message: "PROCESS_NOTIFICATION" };
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private isInDNDPeriod(
    dnd: { start: string; end: string },
    timestamp: string
  ): boolean {
    try {
      const eventTime = new Date(timestamp);

      const eventMinutes =
        eventTime.getUTCHours() * 60 + eventTime.getUTCMinutes();

      const startMinutes = this.timeToMinutes(dnd.start);
      const endMinutes = this.timeToMinutes(dnd.end);

      if (startMinutes > endMinutes) {
        return eventMinutes >= startMinutes || eventMinutes < endMinutes;
      } else {
        return eventMinutes >= startMinutes && eventMinutes < endMinutes;
      }
    } catch (error) {
      console.error("Error in DND logic:", error);
      return false;
    }
  }
}
