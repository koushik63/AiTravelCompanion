import { Router } from 'express';
import { MemoriesController } from '../controllers/memoriesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', MemoriesController.getMemories);
router.post('/', authenticateToken, MemoriesController.addMemory);
router.delete('/:id', authenticateToken, MemoriesController.deleteMemory);

export default router;
