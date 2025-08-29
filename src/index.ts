// src/main.ts

import express from "express";

import { createEventRouter } from "./routes/events.routes";
import { createPreferencesRouter } from "./routes/preferences.routes";

import { InMemoryStore } from "./store/in-memory.store";
import { PreferencesService } from "./services/preferences.service";
import { EventsService } from "./services/events.service";
import { UserPreferences } from "./types/user-preferences.types";

const main = () => {
  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Hello There!" });
  });

  const preferencesStore = new InMemoryStore<UserPreferences>();
  const preferencesService = new PreferencesService(preferencesStore);
  const eventsService = new EventsService(preferencesStore);

  const preferencesRouter = createPreferencesRouter(preferencesService);
  const eventRouter = createEventRouter(eventsService);

  app.use("/preferences", preferencesRouter);
  app.use("/events", eventRouter);

  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main();
