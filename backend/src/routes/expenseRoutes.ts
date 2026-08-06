import { Router } from 'express';
import { ExpenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, ExpenseController.getExpenses);
router.post('/', authenticateToken, ExpenseController.addExpense);
router.delete('/:id', authenticateToken, ExpenseController.deleteExpense);

export default router;
