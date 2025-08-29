import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { EventBodySchema } from '../schemas/events.schema';
import { sendNotificationHandler } from '../controllers/events.controller';
import { EventsService } from '../services/events.service';

export const createEventRouter = (eventsService: EventsService): Router => {
  const router = Router();

  router.post('/', validate(EventBodySchema), sendNotificationHandler(eventsService));
  
  return router;
};