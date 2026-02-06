
import React, { useState, useRef } from 'react';
import { GENRE_DATA } from '../constants';
import { Genre, Attachment } from '../types';
import { generateGameSpec } from '../services/geminiService';

interface CreateGameWizardProps {
  onCancel: () => void;
  onComplete: (data: { title: string; genre: Genre; description: string; spec: any; attachments: Attachment[] }) => void;
  theme: 'dark' | 'light';
}

const CreateGameWizard: React.FC<CreateGameWizardProps> = ({ onCancel, onComplete, theme }) => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<Genre | null>(null);
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(Array.from(files));
  };

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const preview = file.type.startsWith('image/') ? (event.target?.result as string) : undefined;
        
        // Fix: 'mimeType' is not a property of the browser's File object; use 'type' instead.
        const newAttachment: Attachment = {
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: base64,
          preview: preview
        };
        
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePreview = async () => {
    if (!title || !genre || !description) return;
    setIsGenerating(true);
    try {
      const spec = await generateGameSpec(title, genre!, description, attachments);
      setGeneratedSpec(spec);
      setStep(3);
    } catch (error) {
      console.error("Preview generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`fixed inset-0 pt-24 pb-12 overflow-y-auto z-40 animate-fade-in transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-25%] left-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob ${isDark ? 'bg-blue-600/20' : 'bg-blue-300/30'}`} />
        <div className={`absolute bottom-[-25%] right-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob animation-delay-2000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-300/15'}`} />
      </div>

      <div className={`mx-auto px-6 relative z-10 transition-all duration-700 ${step === 3 ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase mb-4">
            ✨ AI-Powered Game Creation
          </div>
          <h1 className={`text-5xl font-black ${isDark ? 'text-white' : 'text-black'} mb-4 tracking-tight`}>
            {step === 3 ? "Review Specification" : "Make a Game"}
          </h1>
          <p className="text-gray-400 font-medium">
            {step === 3 ? "Review the world our AI has synthesized for you" : "Describe your vision and let AI bring it to life"}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : (isDark ? 'bg-white/10' : 'bg-black/10')}`} />
          ))}
        </div>

        <div className={`${isDark ? 'bg-[#0a0a0a]/80 border-white/5 shadow-black/50' : 'bg-white border-black/5 shadow-lg'} border rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl transition-all`}>
          {step === 0 && (
            <div className="animate-slide-up">
              <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-4">What's your game called?</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a memorable title..."
                className={`w-full border rounded-2xl px-6 py-4 text-xl transition-all mb-8 outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'
                }`}
              />
              <div className="flex justify-between items-center">
                <button onClick={onCancel} className="text-gray-500 hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-colors">← Back</button>
                <button 
                  disabled={!title}
                  onClick={nextStep}
                  className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-black/90'} disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl`}
                >
                  Continue <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-slide-up">
              <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-6">Select a genre</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {GENRE_DATA.map((item) => (
                  <button
                    key={item.genre}
                    onClick={() => setGenre(item.genre)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${
                      genre === item.genre 
                        ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                        : (isDark ? 'bg-black/40 border-white/5 hover:border-white/10' : 'bg-gray-50 border-black/5 hover:border-black/10')
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="text-[10px]">
                      <div className={`${isDark ? 'text-white' : 'text-black'} font-black uppercase tracking-widest mb-1`}>{item.genre}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button onClick={prevStep} className="text-gray-500 hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-colors">← Back</button>
                <button 
                  disabled={!genre}
                  onClick={nextStep}
                  className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-black/90'} disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl`}
                >
                  Continue <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Describe your game in detail</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your dream game in detail..."
                className={`w-full border rounded-2xl px-6 py-4 transition-all mb-6 resize-none outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'
                }`}
              />

              <div className="mb-10">
                <label className="block text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Contextual Attachments (Pictures/Docs)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDark ? 'bg-white/[0.02] border-white/10 hover:border-blue-500/40 hover:bg-white/[0.04]' : 'bg-black/[0.02] border-black/10 hover:border-blue-500/30'
                  }`}
                >
                  <div className="text-4xl mb-4 text-gray-600">📂</div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Drop references or click to upload</p>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-tighter">Images, PDFs, or Text documents supported</p>
                  <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*,.pdf,.txt,.doc,.docx"
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {attachments.map((att, i) => (
                      <div key={i} className={`relative w-24 h-24 rounded-2xl border overflow-hidden group ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                        {att.preview ? (
                          <img src={att.preview} alt={att.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-xl mb-1">📄</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter line-clamp-2 leading-none">{att.name}</span>
                          </div>
                        )}
                        <button 
                          onClick={() => removeAttachment(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <button onClick={prevStep} className="text-gray-500 hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-colors">← Back</button>
                <button 
                  disabled={!description || description.length < 10 || isGenerating}
                  onClick={handleGeneratePreview}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-500/40"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      Generate Project Spec <span className="text-lg">✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && generatedSpec && (
            <div className="animate-slide-up space-y-10">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-8">
                  <section>
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Expanded Concept</label>
                    <p className={`text-lg leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {generatedSpec.description}
                    </p>
                  </section>

                  <section>
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Visual Identity</label>
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
                      <p className={`text-sm font-medium italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{generatedSpec.visualStyle}"
                      </p>
                    </div>
                  </section>
                </div>

                <div className="w-full md:w-72 shrink-0 space-y-8">
                  <section>
                    <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Core Mechanics</label>
                    <ul className="space-y-3">
                      {generatedSpec.mechanics.map((m: string, i: number) => (
                        <li key={i} className={`flex items-start gap-3 p-3 rounded-xl border text-[11px] font-black uppercase tracking-widest ${isDark ? 'bg-white/[0.02] border-white/5 text-gray-500' : 'bg-white border-black/5 text-gray-600'}`}>
                          <span className="text-blue-500">•</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className={`pt-8 border-t flex justify-between items-center ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-colors">← Edit Prompt</button>
                <button 
                  onClick={() => onComplete({ title, genre: genre!, description, spec: generatedSpec, attachments })}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                >
                  Confirm & Initialize Forge <span className="text-xl">⚡</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CreateGameWizard;
