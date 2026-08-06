import { Router } from 'express';
import { MemoryController } from '../controllers/memoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, MemoryController.getMemories);
router.post('/', authenticateToken, MemoryController.addMemory);

export default router;
