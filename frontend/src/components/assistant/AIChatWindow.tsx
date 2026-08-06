import React, { useState } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { AIService } from '../../services/api';

export const AIChatWindow: React.FC<{ tripContext?: any }> = ({ tripContext }) => {
  const destName = tripContext?.destination || 'your destination';

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string }>>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I am your AI Travel Companion for ${destName}. Ask me anything about your itinerary, budget, packing, local dining, or top attractions in ${destName}!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (tripContext?.destination) {
      setMessages([
        {
          id: `m_${Date.now()}`,
          sender: 'ai',
          text: `Hello! I am your AI Travel Companion for ${tripContext.destination}. Ask me anything about your itinerary, budget, local food, or attractions in ${tripContext.destination}!`
        }
      ]);
    }
  }, [tripContext?.id, tripContext?.destination]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const historyStr = messages.map((m) => `${m.sender}: ${m.text}`).join('\n');
      const res = await AIService.assistantChat(userText, tripContext, historyStr);
      setMessages((prev) => [...prev, { id: `ai_${Date.now()}`, sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: 'I recommend exploring local cafes and sticking to your budgeted expenditure for today!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel h-[550px] flex flex-col justify-between p-4 border-sky-500/30">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">Smart AI Travel Assistant</h3>
        </div>
        <span className="text-[10px] bg-sky-500/10 text-sky-400 font-bold px-2 py-0.5 rounded-full border border-sky-500/20">
          {tripContext?.destination ? `Context: ${tripContext.destination}` : 'Conversational Engine Ready'}
        </span>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-sky-500 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for budget tips, food recommendations, or local advice..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
        />
        <button type="submit" disabled={isLoading} className="glass-button text-xs py-2.5 px-4 flex items-center justify-center">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
