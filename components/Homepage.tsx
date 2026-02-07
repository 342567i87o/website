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

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowExplore(false);
      } else {
        setShowExplore(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pvkkImages = [
    "assets/pvkk_1.jpg",
    "assets/pvkk_2.jpg",
    "assets/pvkk_3.jpg",
    "assets/pvkk_4.jpg"
  ];

  const vostokImages = [
    "assets/vostok_1.jpg",
    "assets/vostok_2.jpg",
    "assets/vostok_3.jpg",
    "assets/vostok_4.jpg"
  ];

  const openLightbox = (gallery: string[], index: number) => {
    setCurrentGallery(gallery);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % currentGallery.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + currentGallery.length) % currentGallery.length);
  };

  const scrollToInfo = () => {
    const section = document.getElementById('possibilities-galleries');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className={`relative w-full overflow-hidden ${isDark ? "bg-[#000000] text-white" : "bg-[#F9FAFB] text-gray-900"}`}>
      
      {/* Side Explore Arrow Navigation (Added back) */}
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
        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${
          isDark ? 'bg-white/5 border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10' : 'bg-black/5 border-black/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/5'
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors text-4xl font-light z-[110]"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          
          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
            onClick={prevImage}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="relative max-w-7xl max-h-full flex items-center justify-center">
            <img 
              src={currentGallery[currentIndex]} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg animate-zoom-in" 
              alt="Zoomed preview"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";
              }}
            />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/40 font-black text-[10px] uppercase tracking-[0.5em]">
              {currentIndex + 1} / {currentGallery.length}
            </div>
          </div>

          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
            onClick={nextImage}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute top-[-10%] left-[5%] w-[70%] h-[70%] rounded-full blur-[150px] animate-blob ${isDark ? 'bg-blue-600/20' : 'bg-blue-300/25'}`} />
        <div className={`absolute bottom-[-10%] right-[5%] w-[70%] h-[70%] rounded-full blur-[150px] animate-blob animation-delay-2000 ${isDark ? 'bg-indigo-600/15' : 'bg-indigo-300/20'}`} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 flex flex-col items-center text-center max-w-7xl mx-auto w-full">
          <div className="mb-6 relative flex flex-col items-center animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full animate-pulse scale-125 opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
              <PolarityLogo size={65} className="relative z-10" />
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
            Describe your vision and watch as AI generates photorealistic environments, complex systems, and atmospheric worlds.
          </p>
          <div className="w-full max-w-3xl relative group">
            <div className={`absolute -inset-[2px] bg-gradient-to-b from-blue-500/40 via-blue-400/10 to-transparent rounded-[2rem] blur-md opacity-20 group-hover:opacity-100 transition-all duration-500`}></div>
            <div className={`relative ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-black/5'} rounded-[2rem] p-5 text-left border shadow-2xl transition-all duration-300 group-hover:border-blue-500/30`}>
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full bg-transparent border-none focus:ring-0 text-base md:text-lg ${isDark ? 'text-white placeholder-gray-800' : 'text-gray-900 placeholder-gray-300'} resize-none min-h-[100px] font-medium tracking-tight mb-2`}
                placeholder="Describe your game idea..."
              />
              <div className="flex items-center justify-between">
                <span className={`text-[8px] font-black ${isDark ? 'text-gray-700' : 'text-gray-400'} uppercase tracking-[0.3em] ml-2`}>
                   <span className="text-blue-500/60 font-bold">SHIFT + ENTER</span> FOR NEW LINE
                </span>
                <button 
                  onClick={onStartBuilding}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-[#1a1a1a] text-white hover:bg-[#222222] border border-white/5' : 'bg-black text-white'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
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
              { title: "3D Model Generation", icon: "🌐", color: "text-blue-400", desc: "AI-powered mesh generation creates characters, environments, and props instantly." },
              { title: "Intelligent Scripting", icon: "</>", color: "text-gray-200", desc: "GDScript generation powered by advanced AI. From player controllers to complex AI behaviors." },
              { title: "Audio Synthesis", icon: "♫", color: "text-gray-400", desc: "Generate background music and SFX that match your game's atmosphere perfectly." },
              { title: "Animation System", icon: "▶", color: "text-gray-100", desc: "Skeletal animations, blend trees, and state machines configured automatically." },
              { title: "Level Design", icon: "🗺️", color: "text-blue-500", desc: "Procedural level generation with hand-crafted quality. Worlds that feel designed." },
              { title: "Godot Integration", icon: "⚙️", color: "text-gray-600", desc: "Native .tscn and .gd files. Export directly to Godot Engine seamlessly." },
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

        {/* Possibilities with the engine Galleries */}
        <section id="possibilities-galleries" className={`py-40 px-6 w-full max-w-7xl mx-auto border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4 block opacity-60">[ PORTFOLIO ]</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase">Possibilities with <br/> <span className="text-blue-500">the engine</span></h2>
          </div>

          {/* PVKK Section */}
          <div className="mb-40">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">PVKK: Planetenverteidigungskanonenkommandant</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  A high-fidelity simulation of complex industrial systems and planetary defense mechanisms. 
                  Demonstrating intricate cockpit design and reactive environmental feedback.
                </p>
              </div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full">Module: System Logic</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pvkkImages.map((src, i) => (
                <div 
                  key={i} 
                  className="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-white/5 cursor-zoom-in shadow-2xl transition-transform hover:scale-[1.02]"
                  onClick={() => openLightbox(pvkkImages, i)}
                >
                  <img 
                    src={src} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    alt={`PVKK Screenshot ${i+1}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"; }}
                  />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Road to Vostok Section */}
          <div>
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Road to Vostok</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Hyper-realistic environments and survival mechanics set in the Finnish borderlands. 
                  Showcasing advanced lighting, photogrammetry, and atmospheric depth.
                </p>
              </div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full">Module: Visual Synthesis</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vostokImages.map((src, i) => (
                <div 
                  key={i} 
                  className="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-white/5 cursor-zoom-in shadow-2xl transition-transform hover:scale-[1.02]"
                  onClick={() => openLightbox(vostokImages, i)}
                >
                  <img 
                    src={src} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    alt={`Vostok Screenshot ${i+1}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2044&auto=format&fit=crop"; }}
                  />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Feature Grid Section */}
        <section className={`py-60 px-6 w-full max-w-7xl mx-auto border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center mb-32">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6 block opacity-80">[ POSSIBILITIES ]</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase">
              Possibilities with <br/> <span className="text-blue-500">the Engine</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed opacity-60">
              Explore the unlimited creative potential. From indie games to AAA experiences, the engine empowers your imagination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "INFINITE WORLDS", desc: "Create procedurally generated environments that are unique every playthrough, from vast galaxies to intimate dungeons." },
              { title: "INTELLIGENT NPCS", desc: "AI-driven characters that learn, adapt, and react to player choices creating truly dynamic storytelling experiences." },
              { title: "CROSS-PLATFORM PLAY", desc: "Build once, deploy everywhere. Export to Web, Desktop, Mobile, and Consoles with a single unified codebase." },
              { title: "REAL-TIME COLLABORATION", desc: "Work with your team in real-time. Share ideas, iterate quickly, and bring your vision to life together instantly." },
              { title: "ADVANCED PHYSICS", desc: "Photorealistic simulations power your gameplay. From ragdoll physics to fluid dynamics, create believable worlds." },
              { title: "CUSTOM ENGINES", desc: "Go beyond templates. Build entirely custom systems for your unique game vision with our modular architecture." }
            ].map((card, i) => (
              <div key={i} className={`group p-12 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-black/5 shadow-xl'}`}>
                <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase group-hover:text-blue-500 transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                  {card.desc}
                </p>
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
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-blob { animation: blob 10s infinite alternate ease-in-out; }
        .animate-zoom-in { animation: zoom-in 0.4s ease-out forwards; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Homepage;
