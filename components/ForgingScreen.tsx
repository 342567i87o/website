
import React, { useEffect, useState, useRef } from 'react';
import { ForgingStep, GameScript } from '../types';
import { INITIAL_FORGING_STEPS } from '../constants';

interface ForgingScreenProps {
  onComplete: () => void;
  gameTitle: string;
  theme: 'dark' | 'light';
  scripts?: GameScript[];
}

const ForgingScreen: React.FC<ForgingScreenProps> = ({ onComplete, gameTitle, theme, scripts }) => {
  const [steps, setSteps] = useState<ForgingStep[]>(INITIAL_FORGING_STEPS);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [terminalText, setTerminalText] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalText]);

  useEffect(() => {
    if (currentStepIdx < steps.length) {
      const step = steps[currentStepIdx];
      
      // Add terminal logs for each step
      const logs = [
        `[CORE] Initializing sequence for ${step.label}...`,
        `[AI] Allocating synthesis resources...`,
      ];
      
      if (step.id === 'godot' && scripts && scripts.length > 0) {
        logs.push(`[CODE] Generating ${scripts[0].filename}...`);
        // Show some of the actual code in the terminal
        const codePreview = scripts[0].content.split('\n').slice(0, 5).map(line => `>> ${line}`);
        logs.push(...codePreview);
        logs.push(`[CODE] Successfully compiled core logic.`);
      }

      setTerminalText(prev => [...prev, ...logs]);

      const timer = setTimeout(() => {
        setSteps(prev => prev.map((step, idx) => {
          if (idx === currentStepIdx) return { ...step, status: 'completed' as const };
          if (idx === currentStepIdx + 1) return { ...step, status: 'processing' as const };
          return step;
        }));
        setCurrentStepIdx(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setTerminalText(prev => [...prev, `[CORE] FORGE COMPLETE. Redirecting to Editor...`]);
      setTimeout(onComplete, 1500);
    }
  }, [currentStepIdx, steps.length, onComplete, scripts]);

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'} z-50 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-500`}>
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-25%] left-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob ${isDark ? 'bg-blue-600/30' : 'bg-blue-300/40'}`} />
        <div className={`absolute bottom-[-25%] right-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob animation-delay-2000 ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/25'}`} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        
        {/* Left Side: Status and Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Synthesis Active
            </div>
            <h1 className={`text-6xl font-black ${isDark ? 'text-white' : 'text-black'} mb-4 tracking-tighter leading-none`}>Forging <br/>{gameTitle}</h1>
            <p className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-lg max-w-lg font-medium`}>
              The AI Core is synthesizing your project structure, assets, and engine code in real-time.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-700 ${
                  step.status === 'processing' 
                    ? 'bg-blue-500/10 border-blue-500/30 translate-x-2' 
                    : step.status === 'completed'
                    ? (isDark ? 'bg-white/5 border-white/5 opacity-40' : 'bg-gray-50 border-black/5 opacity-40')
                    : 'bg-transparent border-transparent opacity-20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                  step.status === 'completed' ? 'bg-green-500/20 text-green-500' : (isDark ? 'bg-white/5 text-gray-400' : 'bg-black/5 text-gray-400')
                }`}>
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-black'} uppercase tracking-widest`}>{step.label}</div>
                  {step.status === 'processing' && (
                    <div className={`mt-2 h-0.5 w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full overflow-hidden`}>
                      <div className="h-full bg-blue-500 animate-progress"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Code Terminal */}
        <div className={`flex flex-col h-[600px] border rounded-[2.5rem] overflow-hidden shadow-2xl transition-all backdrop-blur-3xl animate-fade-in delay-500 ${
          isDark ? 'bg-black/80 border-white/5' : 'bg-white border-black/5 shadow-xl'
        }`}>
          <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Synthesis Terminal</span>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto custom-scrollbar leading-relaxed">
            {terminalText.map((text, i) => (
              <div key={i} className={`mb-1 ${text.startsWith('[AI]') ? 'text-blue-400' : text.startsWith('>>') ? 'text-gray-500' : 'text-gray-400'}`}>
                {text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 8s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ForgingScreen;
