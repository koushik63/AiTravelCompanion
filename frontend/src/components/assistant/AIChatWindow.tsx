import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import { AIService } from '../../services/api';

export const AIChatWindow: React.FC<{ tripContext?: any }> = ({ tripContext }) => {
  const destName = tripContext?.destination || 'your destination';
  const contextId = tripContext?.id || (tripContext?.destination === 'Worldwide Travel' ? 'general' : 'default');
  const storageKey = `wanderai_chat_history_${contextId}`;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitialMessages = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore storage errors
    }
    return [
      {
        id: 'm1',
        sender: 'ai',
        text: `Hello! I am your AI Travel Companion for ${destName}. Ask me anything about your itinerary, budget, live weather, local food, or top places to visit!`
      }
    ];
  };

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string }>>(getInitialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync messages when switching trip context
  useEffect(() => {
    const key = `wanderai_chat_history_${contextId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'ai',
        text: `Hello! I am your AI Travel Companion for ${destName}. Ask me anything about your itinerary, budget, live weather, local food, or top places to visit!`
      }
    ]);
  }, [contextId, destName]);

  // Persist chat history on any change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'ai',
        text: `Chat history cleared. How can I help you with ${destName} today?`
      }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const newMessages = [...messages, { id: `u_${Date.now()}`, sender: 'user' as const, text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyStr = newMessages.map((m) => `${m.sender}: ${m.text}`).join('\n');
      const res = await AIService.assistantChat(userText, tripContext, historyStr);
      setMessages((prev) => [...prev, { id: `ai_${Date.now()}`, sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `For ${destName}, we recommend checking top historic landmarks, local cuisine spots, and public transit schedules!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel h-[550px] flex flex-col justify-between p-4 border-sky-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">Smart AI Travel Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-sky-500/10 text-sky-400 font-bold px-2 py-0.5 rounded-full border border-sky-500/20">
            {tripContext?.destination ? `Context: ${tripContext.destination}` : 'Worldwide Engine'}
          </span>
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
                  ? 'bg-sky-500 text-white rounded-tr-none shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-sky-400 bg-sky-950/40 p-3 rounded-2xl border border-sky-500/20 w-max">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>AI Assistant is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for places to visit, live weather, food tips, or budget advice..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
        />
        <button type="submit" disabled={isLoading} className="glass-button text-xs py-2.5 px-4 flex items-center justify-center">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
