
import React, { useState, useEffect } from 'react';
import { Game, Genre, User } from '../types';

interface DashboardProps {
  games: Game[];
  onOpenGame: (game: Game) => void;
  onDeleteGame: (gameId: string) => void;
  onDuplicateGame: (gameId: string) => void;
  onCreateNew: () => void;
  theme: 'dark' | 'light';
  user: User | null;
}

const getGenreEmoji = (genre: Genre) => {
  switch (genre) {
    case Genre.Puzzle: return '🧩';
    case Genre.Horror: return '👻';
    case Genre.Simulation: return '🏗️';
    case Genre.Action: return '⚔️';
    case Genre.Adventure: return '🗺️';
    case Genre.RPG: return '🎭';
    case Genre.Platformer: return '🎮';
    case Genre.Shooter: return '🎯';
    case Genre.Racing: return '🏎️';
    case Genre.Strategy: return '♟️';
    default: return '📦';
  }
};

const DeleteWarningModal = ({ game, onConfirm, onCancel, theme }: { game: Game, onConfirm: () => void, onCancel: () => void, theme: string }) => {
  const isDark = theme === 'dark';
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      <div className={`relative w-full max-w-md border rounded-[2.5rem] p-10 overflow-hidden shadow-4xl animate-slide-up ${
        isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl mb-8">
            ⚠️
          </div>
          <h2 className={`text-2xl font-black mb-4 tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>Delete {game.title}?</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
            You are about to permanently delete <span className="text-red-500 font-bold">{game.title}</span>. 
            This action will remove all associated assets. This cannot be undone.
          </p>
          <div className="flex w-full gap-4">
            <button 
              onClick={onCancel}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                isDark ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 border-black/5 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-500/20 transition-all active:scale-95"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionsMenu = ({ 
  game, 
  onDuplicate, 
  onExport, 
  onClose, 
  theme 
}: { 
  game: Game, 
  onDuplicate: () => void, 
  onExport: () => void, 
  onClose: () => void,
  theme: string
}) => {
  const isDark = theme === 'dark';
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Full screen invisible overlay to catch all clicks */}
      <div 
        className="fixed inset-0 z-[100] cursor-default" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
      />
      
      {/* The Menu itself */}
      <div className={`absolute right-4 bottom-14 z-[110] w-52 border rounded-[1.8rem] py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-up overflow-hidden backdrop-blur-3xl ${
        isDark ? 'bg-black/90 border-white/10' : 'bg-white/90 border-black/10'
      }`} onClick={(e) => e.stopPropagation()}>
        <div className={`px-5 py-3 border-b mb-1 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Project Actions</div>
        </div>
        <button 
          onClick={() => { onDuplicate(); onClose(); }}
          className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-[0.98] ${
            isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span className="text-sm">📂</span> Duplicate Game
        </button>
        <button 
          onClick={() => { onExport(); onClose(); }}
          className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-[0.98] ${
            isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'
          }`}
        >
          <span className="text-sm">🚀</span> Export Manifest
        </button>
        <div className={`mt-1 border-t pt-1 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <button 
            onClick={onClose}
            className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
              isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <span className="text-sm">✕</span> Close Menu
          </button>
        </div>
      </div>
    </>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  games, 
  onOpenGame, 
  onDeleteGame, 
  onDuplicateGame,
  onCreateNew, 
  theme, 
  user 
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gamePendingDeletion, setGamePendingDeletion] = useState<Game | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = (game: Game) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(game, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${game.title.replace(/\s+/g, '_')}_manifest.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-[#F9FAFB]'}`}>
      
      {gamePendingDeletion && (
        <DeleteWarningModal 
          game={gamePendingDeletion} 
          theme={theme}
          onCancel={() => setGamePendingDeletion(null)}
          onConfirm={() => {
            onDeleteGame(gamePendingDeletion.id);
            setGamePendingDeletion(null);
          }}
        />
      )}

      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-[-25%] right-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob ${isDark ? 'bg-blue-600/30' : 'bg-blue-300/40'}`} />
        <div className={`absolute bottom-[-25%] left-[-15%] w-[85%] h-[85%] rounded-full blur-[220px] animate-blob animation-delay-2000 ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/25'}`} />
      </div>

      <div className={`relative z-10 pt-24 px-8 pb-12 max-w-[1500px] mx-auto animate-fade-in`}>
        <div className="text-center mt-16 mb-24">
          <div className="flex flex-col items-center">
            {user && (
              <div className="mb-8 animate-slide-up">
                <h2 className="text-5xl md:text-8xl font-black bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent tracking-tighter leading-none mb-4">
                  Hi, {user.name}
                </h2>
                <div className="flex items-center gap-4 justify-center">
                   <div className="h-px w-12 bg-blue-500/30"></div>
                   <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                     Your Creation Terminal
                   </p>
                   <div className="h-px w-12 bg-blue-500/30"></div>
                </div>
              </div>
            )}
            <h1 className={`text-4xl md:text-5xl font-black mb-6 tracking-tight ${isDark ? 'text-white/40' : 'text-black/40'}`}>Dashboard</h1>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">Manage your synthesized worlds and continue building with the Polarity AI Core.</p>
        </div>

        <div className="flex items-center gap-4 mb-12">
          <div className="relative flex-1 max-w-xl group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project repository..." 
              className={`w-full border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pl-14 ${
                isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-white border-black/10 text-black shadow-sm'
              }`}
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-blue-500 transition-colors">🔍</span>
          </div>
          <div className={`flex items-center p-1.5 rounded-2xl border transition-all ${
            isDark ? 'bg-black/40 border-white/5' : 'bg-white border-black/10 shadow-sm'
          }`}>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? (isDark ? 'bg-white/10 text-white' : 'bg-black text-white') : 'text-gray-500 hover:text-blue-500'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? (isDark ? 'bg-white/10 text-white' : 'bg-black text-white') : 'text-gray-500 hover:text-blue-500'}`}
            >
              List
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGames.map((game) => (
              <div 
                key={game.id}
                onClick={() => onOpenGame(game)}
                className={`group relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:translate-y-[-8px] cursor-pointer shadow-3xl ${
                  isDark ? 'bg-[#0a0a0a]/80 backdrop-blur-3xl border-white/5 hover:border-blue-500/30' : 'bg-white/80 backdrop-blur-3xl border-black/5 hover:border-blue-500/20 shadow-lg'
                }`}
              >
                {/* Delete Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setGamePendingDeletion(game);
                  }}
                  className="absolute top-6 right-6 z-30 w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white flex items-center justify-center"
                  title="Delete Project"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>

                <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border text-[9px] font-black uppercase tracking-[0.2em] ${
                    isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white/80 border-black/10 text-black'
                  }`}>
                    {getGenreEmoji(game.genre)} {game.genre}
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    {game.status}
                  </span>
                </div>

                <div className={`aspect-[16/10] w-full relative overflow-hidden ${isDark ? 'bg-[#030303]' : 'bg-gray-100'}`}>
                  {game.thumbnailUrl ? (
                    <img 
                      src={game.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl opacity-5 grayscale group-hover:grayscale-0 transition-all duration-700">
                      {getGenreEmoji(game.genre)}
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${isDark ? 'from-[#0a0a0a]' : 'from-white'}`}></div>
                </div>

                <div className={`p-10 -mt-10 relative z-10 bg-gradient-to-b from-transparent ${isDark ? 'to-[#0a0a0a]' : 'to-white'}`}>
                  <h3 className={`text-3xl font-black mb-3 group-hover:text-blue-500 transition-colors tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>{game.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className={`flex items-center justify-between pt-8 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="flex items-center gap-3 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                      <span>📅</span>
                      <span>Mod. {game.lastModified}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 relative">
                      <div className="text-blue-500 font-black text-[10px] flex items-center gap-2 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                        Open <span className="text-xl">›</span>
                      </div>
                      
                      {/* More Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === game.id ? null : game.id);
                        }}
                        className={`w-10 h-10 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative z-[110] ${
                          activeMenuId === game.id 
                            ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                            : (isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600')
                        }`}
                        title="Actions"
                      >
                        <div className={`w-1 h-1 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                        <div className={`w-1 h-1 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                        <div className={`w-1 h-1 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                      </button>

                      {activeMenuId === game.id && (
                        <ActionsMenu 
                          game={game} 
                          theme={theme}
                          onDuplicate={() => onDuplicateGame(game.id)}
                          onExport={() => handleExport(game)}
                          onClose={() => setActiveMenuId(null)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div 
              className={`group relative flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed aspect-[16/13] transition-all duration-500 cursor-pointer backdrop-blur-sm ${
                isDark ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-blue-500/40 shadow-sm' : 'bg-black/[0.02] border-black/10 hover:bg-black/[0.04] hover:border-blue-500/30 shadow-sm'
              }`}
              onClick={onCreateNew}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 ${
                isDark ? 'bg-white/5 text-gray-600 group-hover:text-white border-white/5' : 'bg-black/5 text-gray-400 group-hover:text-black border-black/5'
              }`}>
                <span className="text-4xl transition-transform duration-500 group-hover:scale-150 leading-none inline-flex items-center justify-center">+</span>
              </div>
              <p className="text-gray-500 text-sm font-black uppercase tracking-[0.4em] group-hover:text-blue-500 transition-colors">Forge New Project</p>
              <p className="text-gray-700 text-[10px] mt-3 font-black uppercase tracking-[0.2em] opacity-40">Initialize Core Sequence</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <div 
                key={game.id}
                onClick={() => onOpenGame(game)}
                className={`group flex items-center gap-8 p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isDark ? 'bg-[#0a0a0a]/80 border-white/5 hover:border-blue-500/30' : 'bg-white border-black/5 hover:border-blue-500/20 shadow-sm'
                }`}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-900 shrink-0">
                  {game.thumbnailUrl ? (
                    <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">{getGenreEmoji(game.genre)}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-xl font-black truncate ${isDark ? 'text-white' : 'text-black'}`}>{game.title}</h3>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/10">{game.genre}</span>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1 font-medium">{game.description}</p>
                </div>
                <div className="text-right shrink-0 px-6">
                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{game.status}</div>
                  <div className="text-[10px] font-bold text-gray-500">Mod. {game.lastModified}</div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setGamePendingDeletion(game);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-red-500 transition-all ${
                      isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === game.id ? null : game.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative z-[110] ${
                      activeMenuId === game.id 
                        ? 'bg-blue-600 text-white' 
                        : (isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-600')
                    }`}
                  >
                    <div className={`w-0.5 h-0.5 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                    <div className={`w-0.5 h-0.5 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                    <div className={`w-0.5 h-0.5 rounded-full ${activeMenuId === game.id ? 'bg-white' : (isDark ? 'bg-gray-400' : 'bg-gray-600')}`}></div>
                  </button>

                  {activeMenuId === game.id && (
                    <ActionsMenu 
                      game={game} 
                      theme={theme}
                      onDuplicate={() => onDuplicateGame(game.id)}
                      onExport={() => handleExport(game)}
                      onClose={() => setActiveMenuId(null)}
                    />
                  )}

                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all group-hover:bg-blue-500/10 group-hover:text-blue-500">
                    <span className="text-2xl">›</span>
                  </div>
                </div>
              </div>
            ))}
            <div 
              onClick={onCreateNew}
              className={`p-6 rounded-3xl border border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all duration-300 group ${
                isDark ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/10 hover:bg-black/[0.04]'
              }`}
            >
               <span className="text-xl group-hover:scale-150 transition-transform">+</span>
               <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-blue-500">Forge New Project</span>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
