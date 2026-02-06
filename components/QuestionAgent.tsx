import React, { useState, useRef, useEffect } from 'react';
import { copilotMessage } from '../services/geminiService';

interface QuestionAgentProps {
  theme: 'dark' | 'light';
}

const QuestionAgent: React.FC<QuestionAgentProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I'm the Polarity Guide. Ask me anything about how this engine works or how to build your first game." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Fix: copilotMessage expects 4 arguments (gameTitle, message, history, currentProject).
      // We pass an empty project structure since the QuestionAgent is for general platform queries.
      const response = await copilotMessage("Polarity Platform", userMsg, messages, { files: [], hierarchy: [] });
      
      // Fix: The response from copilotMessage is a parsed JSON object containing a 'text' property.
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a bit of trouble connecting. Could you try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`mb-4 w-[350px] max-h-[500px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-slide-up transition-colors duration-300 ${
          isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shadow-lg shadow-blue-600/20">?</div>
              <div>
                <div className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Polarity Guide</div>
                <div className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">AI Online</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-black/10 text-gray-400'}`}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : isDark ? 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none' : 'bg-black/5 text-gray-700 border border-black/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl flex gap-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50'}`}>
            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className={`w-full py-2.5 pl-4 pr-10 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                  isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-white border-black/10 text-black'
                } border`}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1.5 w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-500 transition-all active:scale-90"
              >
                ↑
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-600/40 hover:scale-110 transition-transform active:scale-95 group relative`}
      >
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
        {isOpen ? '✕' : '?'}
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default QuestionAgent;