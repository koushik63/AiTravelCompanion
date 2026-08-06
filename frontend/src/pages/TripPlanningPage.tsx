import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, RefreshCw, CheckCircle2, ShieldAlert, Luggage, DollarSign, Lightbulb } from 'lucide-react';
import { AIService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { useUIStore } from '../store/useUIStore';
import { AIPromptForm } from '../components/ai/AIPromptForm';
import { GenerationProgress } from '../components/ai/GenerationProgress';
import { ItineraryTimeline } from '../components/ai/ItineraryTimeline';
import { AIStatusIndicator } from '../components/ai/AIStatusIndicator';
import { AIItineraryResponse, AIPromptInput } from '../types';
import { formatCurrency } from '../utils/currencyHelper';
import { validateDestination } from '../utils/destinationValidator';

export const TripPlanningPage: React.FC = () => {
  const [input, setInput] = useState<AIPromptInput | null>(null);
  const [itinerary, setItinerary] = useState<AIItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'packing' | 'budget' | 'tips'>('itinerary');

  const { addTrip } = useTravelStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleGenerate = async (promptInput: AIPromptInput) => {
    const validation = validateDestination(promptInput.destination);
    if (!validation.isValid) {
      addToast({ type: 'error', message: validation.errorMessage || `The place "${promptInput.destination}" does not exist.` });
      return;
    }

    setInput(promptInput);
    setIsLoading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 25));
    }, 400);

    try {
      const res = await AIService.generateItinerary(promptInput);
      setItinerary(res);
      setProgress(100);
      addToast({ type: 'success', message: 'AI Itinerary generated successfully!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to generate AI itinerary' });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleSaveToTrips = async () => {
    if (!itinerary || !input) return;
    await addTrip({
      title: itinerary.tripTitle,
      destination: itinerary.destination,
      budget: itinerary.estimatedTotalCost,
      startDate: new Date(input.startDate).toISOString(),
      endDate: new Date(input.endDate).toISOString(),
      currency: itinerary.currency,
      status: 'UPCOMING',
      description: itinerary.summary
    });
    addToast({ type: 'success', message: 'Saved to your active trips!' });
    navigate('/trips');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" /> AI Trip Planner Engine
          </h1>
          <p className="text-xs text-slate-400">Gemini-powered structured travel itineraries and smart recommendations</p>
        </div>

        <AIStatusIndicator />
      </div>

      <AIPromptForm onSubmit={handleGenerate} isLoading={isLoading} />

      {isLoading && input && <GenerationProgress progress={progress} destination={input.destination} />}

      {!isLoading && itinerary && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Summary Banner */}
          <div className="glass-panel p-6 space-y-4 border-sky-500/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">
                  AI Synthesized Itinerary
                </span>
                <h2 className="text-2xl font-bold text-slate-100 mt-2">{itinerary.tripTitle}</h2>
                <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">{itinerary.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => input && handleGenerate(input)}
                  className="glass-button-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
                <button
                  onClick={handleSaveToTrips}
                  className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-xl shadow-sky-500/20"
                >
                  <Save className="w-3.5 h-3.5" /> Save to Trips
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Est. Total Budget</span>
                <span className="font-bold text-emerald-400 block text-sm">{formatCurrency(itinerary.estimatedTotalCost, itinerary.currency)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Duration</span>
                <span className="font-bold text-slate-200 block text-sm">{itinerary.days.length} Days</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Destination</span>
                <span className="font-bold text-slate-200 block text-sm">{itinerary.destination}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Engine Status</span>
                <span className="font-bold text-sky-400 block text-sm">Verified JSON</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'itinerary' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Day-by-Day Itinerary
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'packing' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Luggage className="w-3.5 h-3.5" /> AI Packing List
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'budget' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Budget Tips
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'tips' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Local & Safety Tips
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'itinerary' && <ItineraryTimeline itinerary={itinerary} />}

          {activeTab === 'packing' && (
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-sky-400" /> Climate-Adaptive Packing Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {itinerary.packingList.map((item: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Daily Expense & Budget Strategy
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommended total budget: <span className="font-bold text-emerald-400">{formatCurrency(itinerary.estimatedTotalCost, itinerary.currency)}</span>. Average daily expenditure per person is estimated at {formatCurrency(Math.round(itinerary.estimatedTotalCost / itinerary.days.length), itinerary.currency)}.
              </p>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 space-y-3">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" /> Local Cultural Advice
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {itinerary.localTips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-6 space-y-3">
                <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" /> Safety & Health Precautions
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {itinerary.safetyTips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
