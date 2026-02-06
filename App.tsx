
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateGameWizard from './components/CreateGameWizard';
import ForgingScreen from './components/ForgingScreen';
import Editor from './components/Editor';
import Settings from './components/Settings';
import Homepage from './components/Homepage';
import AuthView from './components/AuthView';
import { AppView, Game, Genre, User, Attachment, GameScript, SceneNode } from './types';
import { MOCK_GAMES } from './constants';
import { generateGameThumbnail, generateProjectFiles } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('polarity_session');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      const storedGames = localStorage.getItem('polarity_games');
      if (storedGames) {
        setGames(JSON.parse(storedGames));
      } else {
        setGames(MOCK_GAMES);
      }
    } catch (e) {
      console.error("Failed to load initial state", e);
      setGames(MOCK_GAMES);
    }

    try {
      const savedTheme = localStorage.getItem('polarity_theme') as 'dark' | 'light' | null;
      if (savedTheme) setTheme(savedTheme);
      else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
    } catch (e) {
      setTheme('dark');
    }
    
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Persist games whenever they change
  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem('polarity_games', JSON.stringify(games));
    }
  }, [games, isInitializing]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('polarity_theme', nextTheme);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('polarity_session', JSON.stringify(newUser));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('polarity_session');
    setView('home');
  };

  const updateGame = (gameId: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...updates, lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : g));
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
  };

  const duplicateGame = (gameId: string) => {
    const gameToDuplicate = games.find(g => g.id === gameId);
    if (gameToDuplicate) {
      const newGame: Game = {
        ...gameToDuplicate,
        id: Math.random().toString(36).substr(2, 9),
        title: `${gameToDuplicate.title} (Copy)`,
        lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setGames(prev => [newGame, ...prev]);
    }
  };

  const handleCreateGame = async (data: { title: string; genre: Genre; description: string; spec: any; attachments: Attachment[] }) => {
    setView('forging');
    
    try {
      const spec = data.spec;
      const thumbnailPrompt = spec?.aiPromptForThumbnail || data.description;
      
      const [thumbUrl, projectData] = await Promise.all([
        generateGameThumbnail(thumbnailPrompt),
        generateProjectFiles(data.title, data.genre, spec, data.attachments)
      ]);
      
      const newGame: Game = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        genre: data.genre,
        description: data.description,
        thumbnailUrl: thumbUrl || undefined,
        status: 'In Development',
        lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        assets: [],
        scripts: projectData?.files || [],
        hierarchy: projectData?.hierarchy || [],
        specification: spec
      };

      setGames(prev => [newGame, ...prev]);
      setActiveGame(newGame);
    } catch (error) {
      console.error("Forging failed:", error);
      setView('dashboard');
    }
  };

  const openGame = (game: Game) => {
    setActiveGame(game);
    setView('editor');
  };

  if (isInitializing) {
    return (
      <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#F9FAFB]'} flex items-center justify-center`}>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated && view !== 'home' && view !== 'auth') {
    return <AuthView onLogin={handleLogin} theme={theme} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      {view !== 'forging' && view !== 'editor' && (
        <Header 
          view={view} 
          setView={setView} 
          onCreateNew={() => setView('make')} 
          onLogout={handleLogout}
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'home' && <Homepage theme={theme} onStartBuilding={() => isAuthenticated ? setView('make') : setView('auth')} />}
      {view === 'dashboard' && (
        <Dashboard 
          theme={theme} 
          games={games} 
          onOpenGame={openGame} 
          onDeleteGame={deleteGame} 
          onDuplicateGame={duplicateGame}
          onCreateNew={() => setView('make')} 
          user={user} 
        />
      )}
      {view === 'make' && <CreateGameWizard theme={theme} onCancel={() => setView('dashboard')} onComplete={handleCreateGame} />}
      {view === 'forging' && <ForgingScreen theme={theme} onComplete={() => setView('editor')} gameTitle={activeGame?.title || 'Game'} scripts={activeGame?.scripts} />}
      {view === 'editor' && activeGame && (
        <Editor 
          theme={theme} 
          game={games.find(g => g.id === activeGame.id) || activeGame} 
          onBack={() => setView('dashboard')} 
          onUpdateGame={(updates) => updateGame(activeGame.id, updates)}
        />
      )}
      {view === 'settings' && <Settings theme={theme} user={user} onToggleTheme={toggleTheme} />}
      {view === 'auth' && <AuthView theme={theme} onLogin={handleLogin} />}
    </div>
  );
};

export default App;
