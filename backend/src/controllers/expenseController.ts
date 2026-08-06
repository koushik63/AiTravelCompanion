import { Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { AuthRequest } from '../middleware/authMiddleware';

export class ExpenseController {
  static async getExpenses(req: AuthRequest, res: Response) {
    try {
      const tripId = (req.query.tripId as string) || 'trip_1';
      const trip = await DatabaseService.getTripById(tripId);
      return res.json(trip?.expenses || []);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async addExpense(req: AuthRequest, res: Response) {
    try {
      const { tripId, category, amount, description, currency } = req.body;
      if (!tripId || !category || !amount || !description) {
        return res.status(400).json({ error: 'tripId, category, amount, and description are required' });
      }

      const expense = await DatabaseService.addExpense({
        tripId,
        category,
        amount: Number(amount),
        description,
        currency: currency || 'USD'
      });
      return res.status(201).json(expense);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteExpense(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      await DatabaseService.deleteExpense(id);
      return res.json({ message: 'Expense removed successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
