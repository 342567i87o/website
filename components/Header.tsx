
import React, { useState } from 'react';
import { AppView, User } from '../types';
import { ThemeToggle } from './ui/ThemeToggle';

interface HeaderProps {
  view: AppView;
  setView: (view: AppView) => void;
  onCreateNew: () => void;
  onLogout: () => void;
  user: User | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const PolarityLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!error ? (
        <img 
          src="assets/logo.png" 
          alt="Polarity Logo" 
          width={size}
          height={size}
          style={{ minWidth: size, minHeight: size }}
          className="object-contain relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          onError={() => setError(true)}
        />
      ) : (
        <div 
          style={{ width: size, height: size }} 
          className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg"
        >
          P
        </div>
      )}
      <div 
        className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ view, setView, onCreateNew, onLogout, user, theme, onToggleTheme }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 backdrop-blur-2xl z-50 flex items-center justify-between px-8 border-b transition-all duration-700 ${
      isDark ? 'bg-black/60 border-white/5' : 'bg-white/70 border-black/5'
    }`}>
      <div className="flex items-center gap-4 cursor-pointer group shrink-0" onClick={() => setView('home')}>
        <PolarityLogo size={32} className="transition-transform duration-500 group-hover:scale-110" />
        <span className={`font-black text-lg tracking-tighter hidden sm:inline ${isDark ? 'text-white' : 'text-black'}`}>
          Polarity <span className="text-blue-500 font-medium text-[10px] tracking-[0.4em] uppercase ml-1 opacity-70">Engine</span>
        </span>
      </div>

      <nav className={`absolute left-1/2 -translate-x-1/2 flex items-center p-1 rounded-2xl border shadow-2xl transition-all duration-500 ${
        isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'
      }`}>
        <button 
          onClick={() => setView('home')}
          className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
            view === 'home' 
              ? (isDark ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-white text-black shadow-sm') 
              : 'text-gray-500 hover:text-blue-400'
          }`}
        >
          Home
        </button>
        {user && (
          <>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                view === 'dashboard' 
                  ? (isDark ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-white text-black shadow-sm') 
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('make')}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                view === 'make' 
                  ? (isDark ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-white text-black shadow-sm') 
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              Make a Game
            </button>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4 shrink-0">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        {!user ? (
          <button 
            onClick={() => setView('auth' as any)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Enter
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-1 pr-4 rounded-full border transition-all active:scale-95 ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs text-white font-black">
                 {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:inline ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{user.name}</span>
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                <div className={`absolute right-0 mt-4 w-64 border rounded-[2rem] shadow-3xl z-20 py-3 animate-slide-up overflow-hidden transition-all ${
                  isDark ? 'bg-black border-white/10' : 'bg-white border-black/10'
                }`}>
                  <div className={`px-6 py-4 border-b mb-2 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{user.name}</div>
                    <div className="text-[10px] text-gray-500 truncate font-bold uppercase tracking-widest mt-1">{user.email}</div>
                  </div>
                  <button 
                    onClick={() => { setView('settings'); setIsProfileOpen(false); }}
                    className={`w-full text-left px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-colors ${
                      isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'
                    }`}
                  >
                    Settings
                  </button>
                  <button 
                    onClick={() => { onLogout(); setIsProfileOpen(false); }}
                    className={`w-full text-left px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-colors ${
                      isDark ? 'text-red-500 hover:bg-red-500/5' : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
