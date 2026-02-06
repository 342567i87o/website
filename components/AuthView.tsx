
import React, { useState } from 'react';
import { User } from '../types';
import { PolarityLogo } from './Header';

interface AuthViewProps {
  onLogin: (user: User) => void;
  theme: 'dark' | 'light';
}

type AuthMode = 'signin' | 'signup';

const AuthView: React.FC<AuthViewProps> = ({ onLogin, theme }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const isDark = theme === 'dark';

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'signup' && !name)) return;
    
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      onLogin({
        id: `user_email_${Math.random().toString(36).substr(2, 9)}`,
        name: authMode === 'signup' ? name : email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate high-end Google OAuth verification
    setTimeout(() => {
      onLogin({
        id: 'user_google_1',
        name: 'Alex Rivera',
        email: 'alex.rivera@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      });
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto transition-colors duration-500 ${
      isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'
    }`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 py-12 animate-slide-up">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className={`w-20 h-20 mb-6 flex items-center justify-center rounded-[2rem] border shadow-2xl relative group transition-all duration-700 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'
          }`}>
             <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
             <PolarityLogo size={48} />
          </div>
          <h1 className={`text-3xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {authMode === 'signin' ? 'Login' : 'Join the Forge'}
          </h1>
          <p className={`text-xs font-medium tracking-tight text-center max-w-[280px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {authMode === 'signin' ? 'Enter your credentials to access the engine.' : 'Create an account to start building your universe.'}
          </p>
        </div>

        {/* Auth Form Container */}
        <div className={`border rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-3xl transition-all ${
          isDark ? 'bg-[#0a0a0a]/80 border-white/5 shadow-black/50' : 'bg-white border-black/5 shadow-lg'
        }`}>
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {authMode === 'signup' && (
              <div className="animate-fade-in">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full px-5 py-3.5 rounded-2xl text-sm border outline-none transition-all ${
                    isDark ? 'bg-black/50 border-white/5 text-white focus:border-blue-500/50' : 'bg-gray-50 border-black/5 text-black focus:border-blue-500/30'
                  }`}
                />
              </div>
            )}
            
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className={`w-full px-5 py-3.5 rounded-2xl text-sm border outline-none transition-all ${
                  isDark ? 'bg-black/50 border-white/5 text-white focus:border-blue-500/50' : 'bg-gray-50 border-black/5 text-black focus:border-blue-500/30'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Secure Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-5 py-3.5 rounded-2xl text-sm border outline-none transition-all ${
                  isDark ? 'bg-black/50 border-white/5 text-white focus:border-blue-500/50' : 'bg-gray-50 border-black/5 text-black focus:border-blue-500/30'
                }`}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full group relative overflow-hidden font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 mt-2 ${
                isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {isLoading ? (
                <div className={`w-4 h-4 border-2 rounded-full animate-spin border-white/20 border-t-white`} />
              ) : (
                <>
                  {authMode === 'signin' ? 'Authenticate' : 'Initialize Profile'}
                  <span className="text-lg opacity-60">→</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>OR</span>
              <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full group relative overflow-hidden font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-4 border shadow-sm disabled:opacity-50 ${
                isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-black/5 text-black hover:bg-gray-50'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Login
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              type="button"
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-500 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {authMode === 'signin' ? "No account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 opacity-40">
          <a href="#" className={`text-[8px] font-black uppercase tracking-[0.3em] hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>Privacy Policy</a>
          <a href="#" className={`text-[8px] font-black uppercase tracking-[0.3em] hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>Terms of Service</a>
          <a href="#" className={`text-[8px] font-black uppercase tracking-[0.3em] hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}>System Status</a>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
