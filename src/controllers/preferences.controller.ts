import { Request, Response } from 'express';
import { PreferencesService } from '../services/preferences.service';
import { UserPreferences } from 'src/types/user-preferences.types';

export const updatePreferencesHandler = (service: PreferencesService) => {
  return (req: Request, res: Response) => {
    const userId: string = req.params.userId;
    const newPrefs: UserPreferences = req.body;
    
    try {
      const updatedPrefs: UserPreferences = service.updateUserPreferences(userId, newPrefs);
      res.status(200).json(updatedPrefs);
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update preferences' 
      });
    }
  };
};

export const getPreferencesHandler = (service: PreferencesService) => {
  return (req: Request, res: Response) => {
    const userId: string = req.params.userId;
    
    try {
      const prefs: UserPreferences | undefined = service.findUserPreferences(userId);
      
      if (prefs) {
        res.status(200).json(prefs);
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'USER_PREFERENCES_NOT_FOUND' 
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch preferences' 
      });
    }
  };
};