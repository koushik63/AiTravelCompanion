import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Travel Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'The AI packing list & live Vande Bharat train status tracking saved me so much hassle during my Rajasthan trip!'
    },
    {
      name: 'Ananya Roy',
      role: 'Solo Explorer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'Loved the live weather adjustments in Goa! When it rained in Panaji, it instantly suggested indoor art galleries.'
    },
    {
      name: 'Vikram Patel',
      role: 'Family Traveler',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      comment: 'Expense tracking in INR with category pie charts kept our Kerala family trip completely on budget.'
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          User Testimonials (Demo)
        </span>
        <h2 className="text-3xl font-bold text-slate-100">Loved by Travelers Nationwide</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div key={idx} className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-100 text-xs">{t.name}</h4>
                <span className="text-[10px] text-slate-400">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
