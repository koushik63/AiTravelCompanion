import { Router } from 'express';
import { SharingController } from '../controllers/sharingController';

const router = Router();

router.post('/create', SharingController.createShareLink);
router.get('/:token', SharingController.getSharedTrip);

export default router;
