import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Luggage } from 'lucide-react';
import { PackingItem } from '../../types';

interface PackingChecklistProps {
  items: PackingItem[];
  onToggle: (id: string) => void;
  onAddItem: (name: string, category: string) => void;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({ items, onToggle, onAddItem }) => {
  const [newItemName, setNewItemName] = useState('');
  const [category, setCategory] = useState('Essentials');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), category);
    setNewItemName('');
  };

  const packedCount = items.filter((i) => i.isPacked).length;

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Luggage className="w-5 h-5 text-sky-400" /> Travel Packing Checklist
          </h3>
          <p className="text-xs text-slate-400">
            {packedCount} of {items.length} items packed ({items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0}%)
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item (e.g. Universal Powerbank)"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
        >
          <option value="Essentials">Essentials</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Toiletries">Toiletries</option>
        </select>
        <button type="submit" className="glass-button text-xs py-2 px-4 flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              item.isPacked
                ? 'bg-slate-950/40 border-slate-900 text-slate-500 line-through'
                : 'bg-slate-950/90 border-slate-800 text-slate-200 hover:border-sky-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.isPacked ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-medium">{item.itemName}</span>
            </div>

            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
