import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate-itinerary', authenticateToken, AIController.generateItinerary);
router.post('/regenerate', authenticateToken, AIController.regenerateItinerary);
router.post('/save-itinerary', authenticateToken, AIController.saveItinerary);
router.post('/generate-packing-list', authenticateToken, AIController.generatePackingList);
router.post('/suggest-places', authenticateToken, AIController.suggestPlaces);
router.post('/adjust-weather', authenticateToken, AIController.adjustWeather);
router.post('/budget-tips', authenticateToken, AIController.getBudgetTips);
router.post('/assistant/chat', authenticateToken, AIController.assistantChat);

export default router;
