import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, ProfileController.getProfile);
router.put('/', authenticateToken, ProfileController.updateProfile);
router.get('/preferences', authenticateToken, ProfileController.getPreferences);
router.put('/preferences', authenticateToken, ProfileController.updatePreferences);

export default router;
