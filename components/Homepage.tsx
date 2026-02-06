
import React, { useState, useEffect } from 'react';
import QuestionAgent from './QuestionAgent';
import { PolarityLogo } from './Header';

interface HomepageProps {
  onStartBuilding: () => void;
  theme: 'dark' | 'light';
}

const Homepage: React.FC<HomepageProps> = ({ onStartBuilding, theme }) => {
  const isDark = theme === 'dark';
  const [inputValue, setInputValue] = useState('');
  const [showExplore, setShowExplore] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Permanently hide the arrow once the user has scrolled down significantly
      if (window.scrollY > 100) {
        setShowExplore(false);
        // Remove the listener since we don't need to show it again until reload
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const examples = [
    "A 3D platformer with a robot character collecting...",
    "Top-down zombie survival shooter with crafting and...",
    "Puzzle game with gravity manipulation mechanics in...",
    "Racing game with hovercars on procedurally generat..."
  ];

  const scrollToInfo = () => {
    const section = document.getElementById('workflow-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`relative w-full overflow-hidden ${isDark ? "bg-[#000000] text-white" : "bg-[#F9FAFB] text-gray-900"}`}>
      
      {/* Side Info Navigation - x.ai Style Explore Down Arrow */}
      <div 
        className={`fixed left-8 bottom-12 z-40 hidden lg:flex flex-col items-center group cursor-pointer transition-all duration-1000 ease-in-out ${
          showExplore ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'
        }`} 
        onClick={scrollToInfo}
      >
        <span className={`text-[10px] font-black uppercase tracking-[0.5em] mb-3 transition-all duration-500 ${
          isDark ? 'text-gray-600 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-600'
        }`}>
          Explore
        </span>
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
          isDark ? 'bg-white/5 border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10' : 'bg-black/5 border-black/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/5'
        }`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Subtle Ambient Glow behind the arrow */}
        <div className="absolute -bottom-2 w-12 h-12 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Enhanced Animated Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[5%] w-[70%] h-[70%] rounded-full blur-[150px] animate-blob ${isDark ? 'bg-blue-600/20' : 'bg-blue-300/25'}`} />
        <div className={`absolute bottom-[-10%] right-[5%] w-[70%] h-[70%] rounded-full blur-[150px] animate-blob animation-delay-2000 ${isDark ? 'bg-indigo-600/15' : 'bg-indigo-300/20'}`} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="pt-24 pb-10 px-6 flex flex-col items-center text-center max-w-7xl mx-auto w-full">
          <div className="mb-6 relative flex flex-col items-center animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full animate-pulse scale-125 opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
              <PolarityLogo size={65} className="relative z-10 transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </div>

          <div className="mb-4 animate-fade-in">
             <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.7em] ${isDark ? 'text-blue-400/60' : 'text-blue-600/60'}`}>
               The Engine for Imagined Worlds
             </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 max-w-5xl leading-[0.95] animate-slide-up">
            Build the <br /> 
            <span className={isDark ? "text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#A0A0A0] to-[#505050]" : "text-gray-900"}>
              Impossible.
            </span>
          </h1>
          
          <p className={`${isDark ? "text-gray-500" : "text-gray-500"} text-xs md:text-sm max-w-lg mb-8 leading-relaxed font-medium opacity-80`}>
            Describe your game idea and watch as AI generates 3D models, code, sounds, maps, and animations — all powered by Godot Engine.
          </p>

          {/* Highly Responsive x.ai Style Prompt Box */}
          <div className="w-full max-w-3xl relative group">
            <div className={`absolute -inset-[2px] bg-gradient-to-b from-blue-500/40 via-blue-400/10 to-transparent rounded-[2.1rem] blur-md opacity-20 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500`}></div>
            
            <div className={`relative ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-black/5'} rounded-[2rem] p-5 text-left border shadow-2xl transition-all duration-300 group-hover:border-blue-500/30`}>
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full bg-transparent border-none focus:ring-0 text-base md:text-lg ${isDark ? 'text-white placeholder-gray-800' : 'text-gray-900 placeholder-gray-300'} resize-none min-h-[100px] font-medium tracking-tight mb-2`}
                placeholder="Describe your game idea..."
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 ml-2">
                   <span className={`text-[8px] font-black ${isDark ? 'text-gray-700' : 'text-gray-400'} uppercase tracking-[0.3em]`}>
                     <span className="text-blue-500/60 font-bold">SHIFT + ENTER</span> FOR NEW LINE
                   </span>
                </div>
                <button 
                  onClick={onStartBuilding}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-[#1a1a1a] text-white hover:bg-[#222222] border border-white/5' : 'bg-black text-white'} group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:border-blue-500/50`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-4xl">
             <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4 opacity-60">Try an Example</div>
             <div className="flex flex-wrap justify-center gap-2">
                {examples.map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => setInputValue(ex)}
                    className={`px-5 py-2 rounded-full border text-[9px] font-black transition-all hover:scale-105 active:scale-95 whitespace-nowrap uppercase tracking-widest ${
                      isDark ? 'bg-[#0a0a0a] border-[#1a1a1a] text-gray-500 hover:text-blue-400 hover:border-blue-500/30' : 'bg-white border-black/5 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
             </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow-section" className={`py-40 px-6 w-full max-w-6xl mx-auto border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center mb-32">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4 block opacity-60">[ WORKFLOW ]</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">From Idea to <span className="text-blue-500">Playable Game</span></h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">A streamlined pipeline that transforms your game concept into a fully functional Godot project.</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 hidden md:block"></div>

            <div className="space-y-32">
              {[
                { id: "01", icon: "💬", title: "Describe Your Vision", desc: "Write a natural language description of your game. Include gameplay mechanics, visual style, and any specific features you want." },
                { id: "02", icon: "💡", title: "AI Analyzes & Plans", desc: "Our AI breaks down your description into game components: characters, environments, mechanics, sounds, and more." },
                { id: "03", icon: "⚡", title: "Assets Generated", desc: "Third-party AI services generate 3D models, textures, animations, audio, and code simultaneously." },
                { id: "04", icon: "⚙️", title: "Godot Assembly", desc: "All assets are automatically assembled into proper Godot project structure with scenes, scripts, and resources." },
                { id: "05", icon: "▶", title: "Export & Play", desc: "Download your complete Godot project or continue editing in our cloud studio. Export to any platform." }
              ].map((s, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} group`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-blue-500 transition-colors tracking-tight uppercase">{s.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'} leading-relaxed max-w-sm font-medium ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      {s.desc}
                    </p>
                  </div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 ${
                      isDark ? 'bg-black border-white/5 group-hover:border-blue-500 shadow-2xl' : 'bg-white border-black/5 group-hover:border-blue-500 shadow-sm'
                    }`}>
                      {s.icon}
                    </div>
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-500 ${isDark ? 'bg-black' : 'bg-[#F9FAFB]'} px-2`}>{s.id}</div>
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI-Powered Game Creation Section */}
        <section className={`py-32 px-6 w-full max-w-7xl mx-auto border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-none uppercase">AI-Powered <br/> Game Creation</h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed font-medium">Every component of your game is generated by specialized AI services, then assembled into a complete Godot project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "3D Model Generation", icon: "🌐", color: "text-blue-400", desc: "AI-powered mesh generation creates characters, environments, and props instantly from text descriptions." },
              { title: "Intelligent Scripting", icon: "</>", color: "text-gray-200", desc: "GDScript generation powered by advanced AI. From player controllers to complex AI behaviors." },
              { title: "Audio Synthesis", icon: "♫", color: "text-gray-400", desc: "Generate background music, ambient sounds, and SFX that match your game's atmosphere perfectly." },
              { title: "Animation System", icon: "▶", color: "text-gray-100", desc: "Skeletal animations, blend trees, and state machines generated and configured automatically." },
              { title: "Level Design", icon: "🗺️", color: "text-blue-500", desc: "Procedural level generation with hand-crafted quality. Create worlds that feel designed, not random." },
              { title: "Godot Integration", icon: "⚙️", color: "text-gray-600", desc: "Native .tscn and .gd files. Export directly to Godot Engine and continue development seamlessly." },
            ].map((f, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border transition-all hover:bg-white/[0.04] ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'} border ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight uppercase tracking-widest">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'} font-medium`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Question Agent Container */}
        <div className="relative w-full">
           <QuestionAgent theme={theme} />
        </div>

        {/* Footer */}
        <footer className={`py-40 px-6 border-t w-full ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
              <div className="max-w-sm">
                <div className="flex items-center gap-4 mb-8">
                  <PolarityLogo size={44} />
                  <span className={`text-2xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-black'}`}>Polarity</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">The first generative engine for professional game developers and creative visionaries.</p>
                <div className="flex items-center gap-6">
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer transition-colors text-2xl font-black">𝕏</span>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer transition-colors text-2xl font-black">🐙</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Engine</h4>
                  <ul className={`space-y-4 text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Documentation</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">API Reference</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Cloud Studio</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Platform</h4>
                  <ul className={`space-y-4 text-xs font-bold ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Synthesis Core</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Models</a></li>
                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest">Assets</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`flex flex-col md:flex-row items-center justify-between pt-16 border-t ${isDark ? 'border-white/5' : 'border-black/5'} gap-8`}>
              <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.4em]">© 2026 Polarity Intelligence</p>
              <div className="flex items-center gap-8 text-[9px] font-black text-gray-800 uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-gray-400">Privacy</a>
                <a href="#" className="hover:text-gray-400">Terms</a>
                <a href="#" className="hover:text-gray-400">Status</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
