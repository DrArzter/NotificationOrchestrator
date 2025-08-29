export interface DND {
  start: string;
  end: string;
}

export interface EventSetting {
  enabled: boolean;
}

export interface UserPreferences {
  dnd: DND;
  eventSettings: {
    [eventType: string]: EventSetting;
  };
}