import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from './HoloPanel';
import { GlowButton } from './GlowButton';
import { ModuleId } from '../../types';
import {
  Search,
  Zap,
  Film,
  Sparkles,
  Layers,
  FileText,
  Sliders,
  Video,
  Mic,
  Subtitles,
  Image as ImageIcon,
  Rocket,
  Compass,
  Radar,
  Users,
  MapPin,
  TrendingUp,
  Download,
  History,
  X,
  Plus,
  Repeat,
  Share2,
  Check
} from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveModule,
    currentProject,
    setIsCreateProjectOpen,
    setIsSettingsOpen,
    exportProjectJson,
    triggerToast
  } = useApp();

  const { playCockpitBeep, theme, setTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Global keydown for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  interface CommandItem {
    id: string;
    title: string;
    category: 'NAVIGATION' | 'ACTION' | 'AI COMMAND';
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
  }

  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Jump to Command Deck Dashboard',
      category: 'NAVIGATION',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('dashboard'),
    },
    {
      id: 'nav-trends',
      title: 'Jump to Trends & Velocity Radar',
      category: 'NAVIGATION',
      icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('trends'),
    },
    {
      id: 'nav-research',
      title: 'Jump to Research & YouTube Intelligence',
      category: 'NAVIGATION',
      icon: <Radar className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('research'),
    },
    {
      id: 'nav-ideas',
      title: 'Jump to Ideas Synthesizer & Vault',
      category: 'NAVIGATION',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('ideas'),
    },
    {
      id: 'nav-story',
      title: 'Jump to Story Script Studio',
      category: 'NAVIGATION',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('story'),
    },
    {
      id: 'nav-characters',
      title: 'Jump to Character Roster & Dossiers',
      category: 'NAVIGATION',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('characters'),
    },
    {
      id: 'nav-locations',
      title: 'Jump to World Lore & Location Codex',
      category: 'NAVIGATION',
      icon: <MapPin className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('locations'),
    },
    {
      id: 'nav-production',
      title: 'Jump to Production Control Room & Shot Deck',
      category: 'NAVIGATION',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('production'),
    },
    {
      id: 'nav-voice',
      title: 'Jump to Voice & Audio Synthesizer',
      category: 'NAVIGATION',
      icon: <Mic className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('voice'),
    },
    {
      id: 'nav-captions',
      title: 'Jump to Kinetic Captions Player',
      category: 'NAVIGATION',
      icon: <Subtitles className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('captions'),
    },
    {
      id: 'nav-thumbnail',
      title: 'Jump to 4K Thumbnail Packaging Studio',
      category: 'NAVIGATION',
      icon: <ImageIcon className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('thumbnail'),
    },
    {
      id: 'nav-film',
      title: 'Jump to Film Mode & Narrative Bible',
      category: 'NAVIGATION',
      icon: <Film className="w-4 h-4 text-amber-400" />,
      action: () => setActiveModule('film-mode'),
    },
    {
      id: 'nav-publishing',
      title: 'Jump to Publishing & Distribution',
      category: 'NAVIGATION',
      icon: <Rocket className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('publishing'),
    },
    {
      id: 'nav-repurpose',
      title: 'Jump to Omni-Channel Repurpose (9:16 Shorts)',
      category: 'NAVIGATION',
      icon: <Repeat className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('repurpose'),
    },
    {
      id: 'nav-seo',
      title: 'Jump to SEO & Metadata Auditor',
      category: 'NAVIGATION',
      icon: <Share2 className="w-4 h-4 text-cyan-400" />,
      action: () => setActiveModule('seo'),
    },

    // Fast Actions
    {
      id: 'act-new-proj',
      title: 'Initialize New Production Project',
      category: 'ACTION',
      icon: <Plus className="w-4 h-4 text-emerald-400" />,
      action: () => setIsCreateProjectOpen(true),
    },
    {
      id: 'act-export-json',
      title: 'Export Project Blueprint (.JSON)',
      category: 'ACTION',
      icon: <Download className="w-4 h-4 text-emerald-400" />,
      action: () => exportProjectJson(),
    },
    {
      id: 'act-settings',
      title: 'Open Cockpit Configuration Settings',
      category: 'ACTION',
      icon: <Sliders className="w-4 h-4 text-slate-300" />,
      action: () => setIsSettingsOpen(true),
    },
  ];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd: CommandItem) => {
    playCockpitBeep('engage');
    setIsCommandPaletteOpen(false);
    cmd.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <HoloPanel glow={true} className="overflow-hidden p-0 border border-cyan-500/40 shadow-2xl bg-slate-950/95">
          {/* Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-cyan-500/20 bg-slate-900/60">
            <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or jump to module... (e.g. 'script', 'export', 'captions')"
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />
            <span className="text-[10px] font-mono text-cyan-400/70 border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-950/40 shrink-0">
              ESC TO CLOSE
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                NO COMMANDS FOUND MATCHING "{query.toUpperCase()}"
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-950/70 border border-cyan-500/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'text-slate-300 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-slate-900/80 border border-slate-700/60">
                        {cmd.icon}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-medium block">{cmd.title}</span>
                        <span className="text-[9px] font-mono text-slate-500 tracking-wider">
                          {cmd.category}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        EXECUTE <Zap className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Command Bar Footer */}
          <div className="px-4 py-2 bg-black/60 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>↑↓ NAVIGATE</span>
              <span>↵ SELECT</span>
              <span>ESC CANCEL</span>
            </div>
            <span className="text-cyan-500/80">DARK MATTER COCKPIT OS v2.5</span>
          </div>
        </HoloPanel>
      </motion.div>
    </div>
  );
};
