
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Game, GameScript, SceneNode, Attachment } from '../types';
import { copilotMessage } from '../services/geminiService';

interface EditorProps {
  game: Game;
  onBack: () => void;
  theme: 'dark' | 'light';
  onUpdateGame: (updates: Partial<Game>) => void;
}

interface ContextMenu {
  x: number;
  y: number;
  filename: string;
}

const Editor: React.FC<EditorProps> = ({ game, onBack, theme, onUpdateGame }) => {
  const [mainTab, setMainTab] = useState<'2D' | '3D' | 'Script' | 'AssetLib'>('3D');
  const [activeRightDock, setActiveRightDock] = useState<'Inspector' | 'Copilot'>('Copilot');
  const isDark = theme === 'dark';

  // Panel Resizing State
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(288);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [bottomConsoleHeight, setBottomConsoleHeight] = useState(128);
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const [localFiles, setLocalFiles] = useState<GameScript[]>(game.scripts || []);
  const [hierarchy, setHierarchy] = useState<SceneNode[]>(game.hierarchy || []);
  const [activeFilename, setActiveFilename] = useState<string>(localFiles[0]?.filename || '');
  const [scriptContent, setScriptContent] = useState<string>(localFiles[0]?.content || '');
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  // Annotation State
  const [isAnnotating, setIsAnnotating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [drawColor, setDrawColor] = useState('#3b82f6');
  const [isDrawing, setIsDrawing] = useState(false);

  // Copilot State
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copilotRefs, setCopilotRefs] = useState<Attachment[]>([]);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string, hasAnnotation?: boolean }[]>([
    { role: 'model', text: `Polarity Studio ready for "${game.title}". How can I update your project today?` }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resizing Logic
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    if (isResizing === 'left') {
      setLeftSidebarWidth(Math.max(150, Math.min(e.clientX, 500)));
    } else if (isResizing === 'right') {
      setRightSidebarWidth(Math.max(200, Math.min(window.innerWidth - e.clientX, 600)));
    } else if (isResizing === 'bottom') {
      setBottomConsoleHeight(Math.max(50, Math.min(window.innerHeight - e.clientY, 400)));
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Sync state with game prop
  useEffect(() => {
    setLocalFiles(game.scripts || []);
    setHierarchy(game.hierarchy || []);
  }, [game.id]);

  useEffect(() => {
    if (activeFilename) {
      const updatedFiles = localFiles.map(f => f.filename === activeFilename ? { ...f, content: scriptContent } : f);
      setLocalFiles(updatedFiles);
      onUpdateGame({ scripts: updatedFiles });
    }
  }, [scriptContent]);

  useEffect(() => {
    onUpdateGame({ hierarchy });
  }, [hierarchy]);

  // Tab Control
  const handleSwitchTab = (filename: string) => {
    const file = localFiles.find(f => f.filename === filename);
    if (file) {
      setActiveFilename(filename);
      setScriptContent(file.content);
      setMainTab('Script');
    }
  };

  const handleAddNewTab = () => {
    const newName = `NewFile_${localFiles.length + 1}.gd`;
    const newFile: GameScript = { filename: newName, content: 'extends Node\n', type: 'script' };
    const nextFiles = [...localFiles, newFile];
    setLocalFiles(nextFiles);
    setActiveFilename(newName);
    setScriptContent(newFile.content);
    setMainTab('Script');
    onUpdateGame({ scripts: nextFiles });
  };

  const handleCloseTab = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    if (localFiles.length <= 1) return;
    const filtered = localFiles.filter(f => f.filename !== filename);
    setLocalFiles(filtered);
    if (activeFilename === filename) {
      setActiveFilename(filtered[0].filename);
      setScriptContent(filtered[0].content);
    }
  };

  // Context Menu
  const handleContextMenu = (e: React.MouseEvent, filename: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, filename });
  };

  const deleteFile = (filename: string) => {
    if (localFiles.length <= 1) {
      alert("Cannot delete the last remaining file.");
      setContextMenu(null);
      return;
    }
    const nextFiles = localFiles.filter(f => f.filename !== filename);
    setLocalFiles(nextFiles);
    if (activeFilename === filename) {
      setActiveFilename(nextFiles[0].filename);
      setScriptContent(nextFiles[0].content);
    }
    onUpdateGame({ scripts: nextFiles });
    setContextMenu(null);
  };

  // Annotation Canvas Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isAnnotating) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isAnnotating) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearAnnotation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Copilot Submissions
  const handleCopilotSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!copilotInput.trim() && copilotRefs.length === 0 && !isAnnotating) || isCopilotLoading) return;
    
    const userMsg = copilotInput || (isAnnotating ? "Update based on these annotations." : "Attached references.");
    setCopilotInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg, hasAnnotation: isAnnotating }]);
    setIsCopilotLoading(true);

    let currentRefs = [...copilotRefs];

    // If annotating, capture the viewport as an image
    if (isAnnotating && canvasRef.current && viewportRef.current) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = viewportRef.current.clientWidth;
      offscreenCanvas.height = viewportRef.current.clientHeight;
      const oCtx = offscreenCanvas.getContext('2d');
      
      if (oCtx) {
        oCtx.fillStyle = isDark ? '#050505' : '#f3f4f6';
        oCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        oCtx.font = '20px JetBrains Mono';
        oCtx.fillStyle = '#3b82f6';
        oCtx.fillText(`${mainTab} VIEWPORT`, 40, 60);
        
        oCtx.drawImage(canvasRef.current, 0, 0);
        
        const base64 = offscreenCanvas.toDataURL('image/jpeg').split(',')[1];
        currentRefs.push({
          name: 'annotation.jpg',
          mimeType: 'image/jpeg',
          data: base64
        });
      }
      setIsAnnotating(false);
      clearAnnotation();
    }

    const result = await copilotMessage(game.title, userMsg, chatHistory, { files: localFiles, hierarchy }, currentRefs);
    
    setChatHistory(prev => [...prev, { role: 'model', text: result.text }]);
    setCopilotRefs([]);

    if (result.updates) {
      if (result.updates.filesToUpdate) {
        setLocalFiles(prev => {
          let next = [...prev];
          result.updates.filesToUpdate.forEach((update: GameScript) => {
            const idx = next.findIndex(f => f.filename === update.filename);
            if (idx > -1) next[idx] = update;
            else next.push(update);
          });
          onUpdateGame({ scripts: next });
          return next;
        });
      }
      if (result.updates.newHierarchy) {
        setHierarchy(result.updates.newHierarchy);
        onUpdateGame({ hierarchy: result.updates.newHierarchy });
      }
    }
    
    setIsCopilotLoading(false);
  };

  // Speech to Text
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCopilotInput(prev => (prev + ' ' + transcript).trim());
    };

    recognition.start();
  };

  // File Upload Reference
  const handleFileRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        const base64 = result.split(',')[1];
        setCopilotRefs(prev => [...prev, {
          name: file.name,
          mimeType: file.type,
          data: base64,
          preview: file.type.startsWith('image/') ? result : undefined
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const renderSceneTree = (nodes: SceneNode[]) => (
    <div className="pl-3 space-y-0.5">
      {nodes.map(node => (
        <div key={node.id}>
          <div className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors cursor-pointer group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
            <span className="text-[10px] w-3 opacity-30">{node.children ? '▼' : ''}</span>
            <span className="text-xs">{node.icon}</span>
            <span className={`text-[11px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{node.name}</span>
            <span className={`ml-auto text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>{node.type}</span>
          </div>
          {node.children && renderSceneTree(node.children)}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-black text-white' : 'bg-[#f9fafb] text-black'} overflow-hidden relative transition-colors duration-300`} onClick={() => setContextMenu(null)}>
      {/* Resizing Overlay Cursor */}
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize" />}

      {/* Header */}
      <div className={`h-12 border-b flex items-center px-6 justify-between shrink-0 ${isDark ? 'bg-[#050505] border-white/5' : 'bg-white border-black/5'}`}>
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-blue-400 transition-colors">← Back</button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black">{game.title}</span>
            <div className={`flex items-center p-0.5 rounded-xl border ml-4 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-black/5'}`}>
              {['2D', '3D', 'Script', 'AssetLib'].map(tab => (
                <button key={tab} onClick={() => setMainTab(tab as any)} className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mainTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-500'}`}>{tab}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isAnnotating && (
             <div className="flex items-center gap-2 animate-fade-in pr-4 border-r border-white/5 mr-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mr-2">Annotate Mode</span>
               {['#ef4444', '#3b82f6', '#10b981', '#ffffff', '#000000'].map(c => (
                 <button key={c} onClick={() => setDrawColor(c)} className={`w-4 h-4 rounded-full border border-white/10 transition-transform ${drawColor === c ? 'scale-125 ring-2 ring-blue-500 shadow-lg' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
               ))}
               <button onClick={clearAnnotation} className="ml-2 text-[10px] font-black uppercase text-gray-500 hover:text-blue-400 transition-colors">Clear</button>
             </div>
           )}
           {['▶', '⏸', '◼'].map(ctrl => <button key={ctrl} className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-500'}`}>{ctrl}</button>)}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Scenes & Files */}
        <aside 
          className={`relative border-r flex flex-col shrink-0 transition-width ${isDark ? 'bg-[#080808] border-white/5' : 'bg-white border-black/5'}`}
          style={{ width: leftSidebarWidth }}
        >
          <div className={`flex-1 border-b flex flex-col min-h-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className={`px-4 py-2 border-b text-[9px] font-black uppercase tracking-widest ${isDark ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'}`}>Scene Hierarchy</div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">{renderSceneTree(hierarchy)}</div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className={`px-4 py-2 border-b text-[9px] font-black uppercase tracking-widest ${isDark ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'}`}>FileSystem</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {localFiles.map(f => (
                <div 
                  key={f.filename} 
                  onClick={() => handleSwitchTab(f.filename)} 
                  onContextMenu={(e) => handleContextMenu(e, f.filename)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-[11px] cursor-pointer transition-all ${activeFilename === f.filename ? 'bg-blue-600/10 text-blue-500 font-bold' : 'text-gray-500 hover:text-blue-500'}`}
                >
                  <span>{f.type === 'scene' ? '💠' : '📜'}</span>
                  {f.filename}
                </div>
              ))}
            </div>
          </div>
          {/* Resize Handle Left */}
          <div onMouseDown={() => setIsResizing('left')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-20" />
        </aside>

        {/* Center: Content */}
        <main className={`flex-1 relative flex flex-col ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className={`h-10 border-b flex items-center shrink-0 ${isDark ? 'bg-[#050505] border-white/5' : 'bg-gray-100 border-black/5'}`}>
            {localFiles.map(file => (
              <button 
                key={file.filename} 
                onClick={() => handleSwitchTab(file.filename)}
                onContextMenu={(e) => handleContextMenu(e, file.filename)}
                className={`relative px-4 h-full flex items-center gap-2 text-[11px] font-medium border-r group transition-all ${activeFilename === file.filename ? (isDark ? 'bg-[#0A0A0A] text-white' : 'bg-white text-black font-bold') : 'text-gray-500'} ${isDark ? 'border-white/5' : 'border-black/5'}`}
              >
                {activeFilename === file.filename && <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-blue-500" />}
                {file.filename}
                <span onClick={(e) => handleCloseTab(e, file.filename)} className="opacity-0 group-hover:opacity-100 ml-2 hover:text-red-500 transition-all">×</span>
              </button>
            ))}
            <button onClick={handleAddNewTab} className="px-4 h-full text-gray-600 hover:text-blue-500 transition-colors">+</button>
          </div>

          <div className="flex-1 relative flex flex-col min-h-0">
            {mainTab === 'Script' ? (
              <textarea 
                value={scriptContent} 
                onChange={(e) => setScriptContent(e.target.value)} 
                className={`flex-1 w-full p-8 font-mono text-xs outline-none resize-none transition-colors ${isDark ? 'bg-black text-blue-100/80' : 'bg-white text-blue-900/80'}`}
                spellCheck={false}
              />
            ) : (
              <div ref={viewportRef} className={`flex-1 relative flex items-center justify-center overflow-hidden ${isAnnotating ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                <div className="w-56 h-56 border border-blue-500/30 bg-blue-500/5 rounded-2xl animate-pulse flex items-center justify-center text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                  {mainTab} VIEWPORT ACTIVE
                </div>

                {/* Annotation Overlay */}
                <canvas 
                  ref={canvasRef}
                  width={viewportRef.current?.clientWidth || 800}
                  height={viewportRef.current?.clientHeight || 600}
                  className={`absolute inset-0 z-40 transition-opacity ${isAnnotating ? 'cursor-crosshair opacity-100' : 'pointer-events-none opacity-0'}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                
                {isAnnotating && (
                  <div className="absolute top-6 left-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce">
                    Drawing Mode Active
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Console */}
          <div 
            className={`relative border-t shrink-0 transition-colors ${isDark ? 'bg-[#080808] border-white/5' : 'bg-white border-black/5'}`}
            style={{ height: bottomConsoleHeight }}
          >
            <div onMouseDown={() => setIsResizing('bottom')} className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-blue-500/50 transition-colors z-20" />
            <div className="h-full p-4 font-mono text-[10px] text-gray-500 overflow-y-auto custom-scrollbar">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <p className="text-blue-500 font-bold uppercase tracking-widest">Polarity OS Kernel v2.5.1</p>
               </div>
               <p>[Core] Project context loaded: {localFiles.length} modules.</p>
               <p>[Engine] Viewport rendering via WebGPU backend.</p>
               <p className="text-blue-500/50">[Autosave] Snapshot committed at {new Date().toLocaleTimeString()}.</p>
            </div>
          </div>
        </main>

        {/* Right Side: Inspector / Copilot */}
        <aside 
          className={`relative border-l flex flex-col shrink-0 transition-width ${isDark ? 'bg-[#080808] border-white/5' : 'bg-white border-black/5'}`}
          style={{ width: rightSidebarWidth }}
        >
          <div onMouseDown={() => setIsResizing('right')} className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-20" />

          <div className={`flex p-1 border-b shrink-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            {['Inspector', 'Copilot'].map(dock => (
              <button key={dock} onClick={() => setActiveRightDock(dock as any)} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeRightDock === dock ? 'bg-blue-600/10 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}>{dock}</button>
            ))}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeRightDock === 'Copilot' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] leading-relaxed relative shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : (isDark ? 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none' : 'bg-gray-100 text-gray-800 border border-black/5 rounded-tl-none')}`}>
                        {msg.text}
                        {msg.hasAnnotation && (
                          <div className="mt-2 text-[8px] font-black uppercase tracking-tighter opacity-70 flex items-center gap-1.5 border-t border-white/10 pt-2">
                            🖼️ Annotated Viewport Snapshot Attached
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isCopilotLoading && (
                    <div className="flex justify-start">
                      <div className={`p-3 rounded-2xl flex gap-1 rounded-tl-none ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className={`p-4 border-t shrink-0 ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50'}`}>
                  {copilotRefs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {copilotRefs.map((ref, idx) => (
                        <div key={idx} className="relative group">
                          <div className={`w-10 h-10 rounded-lg border overflow-hidden flex items-center justify-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                            {ref.preview ? <img src={ref.preview} className="w-full h-full object-cover" /> : <span className="text-[8px] font-black uppercase tracking-tighter truncate px-1 text-gray-500">{ref.name}</span>}
                          </div>
                          <button onClick={() => setCopilotRefs(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleCopilotSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <textarea 
                        value={copilotInput} 
                        onChange={(e) => setCopilotInput(e.target.value)} 
                        disabled={isCopilotLoading}
                        placeholder={isAnnotating ? "Explain your annotations to the AI..." : "Request script updates or scene changes..."} 
                        className={`w-full border rounded-xl pl-4 pr-10 py-3 text-[11px] outline-none transition-all resize-none min-h-[80px] disabled:opacity-50 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-blue-500/50' : 'bg-white border-black/10 text-black focus:border-blue-500/30'}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCopilotSubmit();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={toggleRecording}
                        className={`absolute right-3 top-3 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-white border-black/10 text-gray-500 hover:bg-gray-100 hover:text-black'}`}
                      >
                        📂 Add Ref
                        <input type="file" ref={fileInputRef} onChange={handleFileRefUpload} multiple className="hidden" />
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => {
                          setIsAnnotating(true);
                          setMainTab(mainTab === 'Script' ? '3D' : mainTab);
                        }}
                        className={`flex-1 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAnnotating ? 'bg-blue-600 text-white border-blue-500' : (isDark ? 'bg-white/5 border-white/5 text-blue-400 hover:bg-blue-600/10' : 'bg-white border-blue-500/20 text-blue-600 hover:bg-blue-50')}`}
                      >
                        🖍️ Annotate
                      </button>

                      <button 
                        type="submit"
                        disabled={(!copilotInput.trim() && copilotRefs.length === 0 && !isAnnotating) || isCopilotLoading}
                        className="w-12 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-500 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 19V5M12 5L5 12M12 5L19 12"/>
                        </svg>
                      </button>
                    </div>
                    
                    {isAnnotating && (
                      <button onClick={() => setIsAnnotating(false)} className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 transition-colors text-center mt-1">
                        Cancel Annotation Mode
                      </button>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center h-full text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 border shadow-inner ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-black/5 border-black/10 text-black/20'}`}>⚙️</div>
                <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Inspector Module</div>
                <p className={`text-[9px] mt-4 font-bold uppercase tracking-widest max-w-[180px] leading-relaxed ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>Select an entity in the hierarchy to visualize properties.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className={`fixed z-[100] w-48 border rounded-xl shadow-2xl overflow-hidden py-1 animate-fade-in ${isDark ? 'bg-[#111111] border-white/10' : 'bg-white border-black/10'}`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`px-4 py-2 border-b text-[9px] font-black uppercase tracking-widest truncate ${isDark ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'}`}>
            {contextMenu.filename}
          </div>
          <button onClick={() => deleteFile(contextMenu.filename)} className="w-full text-left px-4 py-2 text-[11px] font-medium text-red-500 hover:bg-red-500/10 transition-colors">Delete File</button>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .transition-width { transition: width 0.05s ease-out; }
      `}</style>
    </div>
  );
};

export default Editor;
