import express, { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { PreferenceBodySchema, } from '../schemas/preference.schema';

const router: Router = express.Router();

router.post('/:userId', validate(PreferenceBodySchema), (req, res) => {
  console.log('Received preferences for user:', req.params.userId, req.body);
  res.status(200).send({ message: 'Preferences updated' });
});

router.get('/:userId', (req, res) => {
  console.log('Getting preferences for user:', req.params.userId);
  res.status(200).send({ message: 'Preferences retrieved' });
});

export default router;