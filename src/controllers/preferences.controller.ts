import { Express } from "express";

interface DND {
  start: string;
  end: string;
}

interface EventSetting {
  enabled: boolean;
}

interface UserPreferences {
  dnd: DND;
  eventSettings: {
    [eventType: string]: EventSetting;
  };
}
