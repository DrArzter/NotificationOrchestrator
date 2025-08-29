import { Request, Response } from 'express';
import { PreferencesService } from '../services/preferences.service';

export const updatePreferencesHandler = (service: PreferencesService) => {
  return (req: Request, res: Response) => {
    const userId = req.params.userId;
    const newPrefs = req.body;
    
    try {
      const updatedPrefs = service.updateUserPreferences(userId, newPrefs);
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
    const userId = req.params.userId;
    
    try {
      const prefs = service.findUserPreferences(userId);
      
      if (prefs) {
        res.status(200).json(prefs);
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'User preferences not found' 
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