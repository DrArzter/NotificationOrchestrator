import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { PreferenceBodySchema } from '../schemas/preference.schema';
import { updatePreferencesHandler, getPreferencesHandler } from '../controllers/preferences.controller';
import { PreferencesService } from '../services/preferences.service';

export const createPreferencesRouter = (service: PreferencesService): Router => {
  const router = Router();

  router.post('/:userId', validate(PreferenceBodySchema), updatePreferencesHandler(service));
  router.get('/:userId', getPreferencesHandler(service));

  return router;
};