import { Router } from 'express';
import { TripController } from '../controllers/tripController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, TripController.getTrips);
router.post('/', authenticateToken, TripController.createTrip);
router.get('/upcoming', authenticateToken, TripController.getUpcomingTrips);
router.get('/current', authenticateToken, TripController.getCurrentTrip);
router.get('/history', authenticateToken, TripController.getTripHistory);
router.get('/calendar', authenticateToken, TripController.getCalendarEvents);
router.get('/dashboard/summary', authenticateToken, TripController.getDashboardSummary);
router.get('/statistics', authenticateToken, TripController.getStatistics);
router.get('/search', authenticateToken, TripController.searchTrips);

router.get('/:id', authenticateToken, TripController.getTripById);
router.put('/:id', authenticateToken, TripController.updateTrip);
router.delete('/:id', authenticateToken, TripController.deleteTrip);

router.post('/:id/archive', authenticateToken, TripController.archiveTrip);
router.post('/:id/restore', authenticateToken, TripController.restoreTrip);
router.post('/:id/duplicate', authenticateToken, TripController.duplicateTrip);
router.post('/:id/favorite', authenticateToken, TripController.toggleFavorite);

router.put('/packing/item/:itemId/toggle', authenticateToken, TripController.togglePackingItem);
router.post('/packing/item', authenticateToken, TripController.addPackingItem);

export default router;
