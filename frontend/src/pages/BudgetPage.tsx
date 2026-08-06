import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, PieChart, Sparkles, Filter, Edit3, CheckCircle2 } from 'lucide-react';
import { ExpenseService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { useUIStore } from '../store/useUIStore';
import { AnalyticsCard } from '../components/budget/AnalyticsCard';
import { StatisticCard } from '../components/ui/StatisticCard';
import { formatCurrency } from '../utils/currencyHelper';
import { Expense } from '../types';

export const BudgetPage: React.FC = () => {
  const { activeTrip, updateTrip } = useTravelStore();
  const { addToast } = useUIStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // New Expense State
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Edit Budget State
  const [newBudgetInput, setNewBudgetInput] = useState('');

  const tripId = activeTrip?.id || 'trip_1';
  const totalBudget = activeTrip?.budget || 50000;
  const currency = activeTrip?.currency || 'INR';

  useEffect(() => {
    ExpenseService.getExpenses(tripId).then(setExpenses).catch(() => {});
  }, [tripId]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !description.trim()) return;

    try {
      const newExp = await ExpenseService.addExpense({
        tripId,
        category,
        amount: Number(amount),
        description: description.trim(),
        currency
      });
      setExpenses((prev) => [newExp, ...prev]);
      setShowAddModal(false);
      setAmount('');
      setDescription('');
      addToast({ type: 'success', message: 'Expense added successfully!' });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to add expense' });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await ExpenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      addToast({ type: 'info', message: 'Expense deleted' });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to delete expense' });
    }
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(newBudgetInput);
    if (isNaN(parsed) || parsed <= 0) {
      addToast({ type: 'error', message: 'Please enter a valid positive budget amount' });
      return;
    }

    try {
      if (activeTrip?.id) {
        await updateTrip(activeTrip.id, { budget: parsed });
      }
      setShowEditBudgetModal(false);
      addToast({ type: 'success', message: `Total budget updated to ${formatCurrency(parsed, currency)}!` });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to update budget' });
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const filteredExpenses = categoryFilter === 'ALL'
    ? expenses
    : expenses.filter((e) => e.category.toLowerCase() === categoryFilter.toLowerCase());

  // Category Breakdown Math
  const categoriesMap: { [key: string]: number } = {};
  expenses.forEach((e) => {
    categoriesMap[e.category] = (categoriesMap[e.category] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.keys(categoriesMap).map((cat) => ({
    category: cat,
    spent: categoriesMap[cat],
    percentage: totalSpent > 0 ? Math.round((categoriesMap[cat] / totalSpent) * 100) : 0
  }));

  const budgetPresets = [25000, 50000, 75000, 100000, 150000];

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" /> Budget & Expense Hub
          </h1>
          <p className="text-xs text-slate-400">Track trip spending, multi-currency allocations, and AI financial insights</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewBudgetInput(String(totalBudget));
              setShowEditBudgetModal(true);
            }}
            className="glass-button-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 hover:border-sky-500/50 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-sky-400" /> Edit Budget
          </button>

          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-xl shadow-sky-500/20">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatisticCard
          title="Total Allocated Budget"
          value={formatCurrency(totalBudget, currency)}
          subtitle="Trip Financial Limit"
          icon={Wallet}
          color="sky"
          actionButton={
            <button
              onClick={() => {
                setNewBudgetInput(String(totalBudget));
                setShowEditBudgetModal(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors flex items-center gap-1 text-[11px] font-semibold"
              title="Edit Allocated Budget"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          }
        />
        <StatisticCard title="Total Spent" value={formatCurrency(totalSpent, currency)} subtitle={`${expenses.length} Total Logged Expenses`} icon={PieChart} color="indigo" />
        <StatisticCard title="Remaining Funds" value={formatCurrency(remainingBudget, currency)} subtitle={remainingBudget > 0 ? 'Safe Expenditure Zone' : 'Budget Exceeded'} icon={Sparkles} color={remainingBudget > 0 ? 'emerald' : 'rose'} />
      </div>

      {/* Analytics & AI Financial Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard breakdown={categoryBreakdown} currency={currency} />

        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> AI Financial Intelligence
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="font-bold text-slate-100 block">Expenditure Ratio On Track</span>
                <span>You have utilized {Math.round((totalSpent / totalBudget) * 100 || 0)}% of your budget for {activeTrip?.destination || 'your trip'}.</span>
              </div>
            </li>
            <li className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="font-bold text-slate-100 block">AI Smart Saver Advice</span>
                <span>Opting for local thalis and public transport saves ~30% on daily food & transit expenses.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm">Logged Expenses History</h3>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Activities">Activities</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredExpenses.map((exp) => (
            <div key={exp.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{exp.description}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {exp.category}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] block">{new Date(exp.date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-emerald-400 text-sm">{formatCurrency(exp.amount, exp.currency || currency)}</span>
                <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditBudgetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveBudget} className="glass-panel p-6 max-w-md w-full space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" /> Edit Total Allocated Budget
              </h3>
              <button
                type="button"
                onClick={() => setShowEditBudgetModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                New Allocated Budget ({currency})
              </label>
              <input
                type="number"
                value={newBudgetInput}
                onChange={(e) => setNewBudgetInput(e.target.value)}
                required
                min="1000"
                placeholder="e.g. 75000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Quick Presets:</span>
              <div className="flex flex-wrap gap-2">
                {budgetPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewBudgetInput(String(preset))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      Number(newBudgetInput) === preset
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {formatCurrency(preset, currency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Preview */}
            <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Spent:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(totalSpent, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-2">
                <span>New Remaining Funds:</span>
                <span className={`font-bold ${Number(newBudgetInput) - totalSpent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(Math.max(0, Number(newBudgetInput) - totalSpent), currency)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditBudgetModal(false)}
                className="glass-button-secondary text-xs py-2.5 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button text-xs py-2.5 px-6 flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
              >
                <CheckCircle2 className="w-4 h-4" /> Save New Budget
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="glass-panel p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-slate-100 text-lg border-b border-slate-800 pb-3">Log New Expense</h3>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="e.g. Seafood Dinner at Baga" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="1500" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
                <option value="Food">Food</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Activities">Activities</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="glass-button-secondary text-xs py-2 px-4">Cancel</button>
              <button type="submit" className="glass-button text-xs py-2 px-6">Save Expense</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
