import { DatabaseService } from './DatabaseService';

export class BudgetService {
  static async getBudgetAnalytics(tripId: string) {
    const trip = await DatabaseService.getTripById(tripId);
    const expenses = (trip?.expenses as any[]) || [];
    const totalBudget = trip?.budget || 50000;
    const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const remainingBudget = Math.max(0, totalBudget - totalSpent);

    const categoriesMap: { [key: string]: number } = {};
    expenses.forEach((e) => {
      categoriesMap[e.category] = (categoriesMap[e.category] || 0) + Number(e.amount);
    });

    const categoryBreakdown = Object.keys(categoriesMap).map((cat) => ({
      category: cat,
      spent: categoriesMap[cat],
      percentage: totalSpent > 0 ? Math.round((categoriesMap[cat] / totalSpent) * 100) : 0
    }));

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      currency: trip?.currency || 'INR',
      categoryBreakdown,
      aiAdvice: [
        totalSpent > totalBudget * 0.8
          ? '⚠️ Budget Warning: You have utilized over 80% of your allocated trip budget.'
          : '✅ Spending On Track: Expenditure is balanced across accommodation & food.',
        '💡 Saver Tip: Opt for local thali lunch specials to save 30% on food expenses daily.'
      ]
    };
  }
}
