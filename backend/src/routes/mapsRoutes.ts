import { Router } from 'express';
import { MapsController } from '../controllers/mapsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/search-places', MapsController.searchPlaces);
router.get('/nearby', MapsController.getNearby);
router.get('/directions', MapsController.getDirections);

router.get('/saved', authenticateToken, MapsController.getSavedPlaces);
router.post('/saved', authenticateToken, MapsController.savePlace);
router.delete('/saved/:id', authenticateToken, MapsController.removeSavedPlace);

export default router;
