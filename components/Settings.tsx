
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsProps {
  user: User | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, theme, onToggleTheme }) => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [fullName, setFullName] = useState(user?.name || 'Explorer');
  const [godotPath, setGodotPath] = useState('C:/Program Files/Godot/godot.exe');
  const isDark = theme === 'dark';

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (v: boolean) => void }) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-blue-600' : (isDark ? 'bg-white/10' : 'bg-black/10')}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className={`pt-24 px-6 pb-12 max-w-4xl mx-auto animate-fade-in`}>
      <div className="mb-12">
        <h1 className={`text-4xl font-bold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>Settings</h1>
        <p className="text-gray-400">Manage your engine configuration and identity.</p>
      </div>

      <div className="space-y-8">
        {/* Desktop / Native Bridge Section */}
        <section className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
          isDark ? 'bg-[#111111] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className={`p-8 border-b flex items-start gap-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 text-xl border border-blue-500/10">
              🖥️
            </div>
            <div>
              <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Native Bridge</h2>
              <p className="text-gray-500 text-sm">Desktop-only integration features.</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Godot Executable Path</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={godotPath}
                  onChange={(e) => setGodotPath(e.target.value)}
                  placeholder="Select Godot binary..."
                  className={`flex-1 border rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                    isDark ? 'bg-[#161616] border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'
                  }`}
                />
                <button className={`px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-black/10 hover:bg-gray-200'}`}>
                  Browse
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Direct File Sync</h3>
                <p className="text-gray-500 text-xs">Automatically save script changes to your local project folder.</p>
              </div>
              <Toggle enabled={autoSync} setEnabled={setAutoSync} />
            </div>
          </div>
        </section>

        <section className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
          isDark ? 'bg-[#111111] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className={`p-8 border-b flex items-start gap-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 text-xl border border-blue-500/10">
              👤
            </div>
            <div>
              <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Identity</h2>
              <p className="text-gray-500 text-sm">Update your system profile.</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Display Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all ${
                  isDark ? 'bg-[#161616] border-white/10 text-white' : 'bg-gray-50 border-black/10 text-black'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Email Primary</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className={`w-full border rounded-xl px-4 py-3 text-sm cursor-not-allowed ${
                  isDark ? 'bg-[#161616]/50 border-white/5 text-gray-500' : 'bg-gray-100 border-black/5 text-gray-400'
                }`}
              />
            </div>

            <div className="pt-4">
              <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}>
                Save Manifest
              </button>
            </div>
          </div>
        </section>

        <section className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
          isDark ? 'bg-[#111111] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className={`p-8 border-b flex items-start gap-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xl border border-indigo-500/10">
              🌓
            </div>
            <div>
              <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Appearance</h2>
              <p className="text-gray-500 text-sm">System aesthetic preferences.</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Dark Mode</h3>
                <p className="text-gray-500 text-xs">Toggle the high-contrast forge aesthetic.</p>
              </div>
              <Toggle enabled={isDark} setEnabled={onToggleTheme} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Forge Notifications</h3>
                <p className="text-gray-500 text-xs">Get notified when AI synthesis completes.</p>
              </div>
              <Toggle enabled={emailNotifications} setEnabled={setEmailNotifications} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
