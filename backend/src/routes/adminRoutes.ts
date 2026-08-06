import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/stats', authenticateToken, AdminController.getStats);
router.post('/feedback', authenticateToken, AdminController.submitFeedback);
router.get('/notifications', authenticateToken, AdminController.getNotifications);
router.put('/notifications/:id/read', authenticateToken, AdminController.markNotificationRead);

export default router;
