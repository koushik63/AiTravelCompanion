import { Router } from 'express';
import { TransportController } from '../controllers/transportController';

const router = Router();

router.get('/flight-status', TransportController.getFlightStatus);
router.get('/train-status', TransportController.getTrainStatus);
router.get('/tickets', TransportController.getTickets);

export default router;
