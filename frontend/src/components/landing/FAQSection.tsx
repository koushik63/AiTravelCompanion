import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Gemini AI generate my itinerary?',
      a: 'WanderAI uses Google Gemini API to analyze your destination, budget style, duration, and interests, synthesizing structured day-by-day activities with location tags and estimated costs.'
    },
    {
      q: 'Does it support travel in India?',
      a: 'Yes! WanderAI has built-in support for Indian destinations (Goa, Jaipur, Kerala, Delhi, Mumbai, etc.), INR (₹) currency budgeting, and Vande Bharat / IRCTC train tracking.'
    },
    {
      q: 'How does Demo Mode work?',
      a: 'If external API keys or database connections are unconfigured, Demo Mode automatically engages mock fallback generators so every page and feature works 100% smoothly.'
    },
    {
      q: 'Can I track flight and train status live?',
      a: 'Yes, the Transport Hub provides live running status, platform numbers, gate assignments, and delay notifications.'
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-100">Frequently Asked Questions</h2>
        <p className="text-slate-400 text-sm">Everything you need to know about WanderAI.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-panel overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left font-semibold text-slate-100 text-sm flex items-center justify-between gap-4"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-slate-300 border-t border-slate-800/80 pt-3 leading-relaxed animate-in fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
