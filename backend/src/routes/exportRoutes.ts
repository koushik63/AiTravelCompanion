import { Router } from 'express';
import { ExportController } from '../controllers/exportController';

const router = Router();

router.get('/:tripId/json', ExportController.exportJSON);
router.get('/:tripId/pdf', ExportController.exportPDF);

export default router;
