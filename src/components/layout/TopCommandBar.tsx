import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { 
  ChevronDown, 
  Cpu, 
  HardDrive, 
  Sliders, 
  Search, 
  Plus, 
  Radio, 
  Palette,
  Volume2,
  VolumeX,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { AccentColor, ThemeMode } from '../../types';

interface TopCommandBarProps {
  onToggleMobileNav?: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = () => {
  const { 
    currentProject, 
    projects, 
    selectProject, 
    renameProject,
    archiveProject,
    restoreProject,
    deleteProject,
    exportProjectJson,
    autosaveStatus,
    telemetry, 
    setIsCreateProjectOpen, 
    setIsCommandPaletteOpen,
    setIsSettingsOpen
  } = useApp();

  const { 
    theme, 
    setTheme, 
    accent, 
    setAccent, 
    soundEnabled, 
    setSoundEnabled, 
    playCockpitBeep 
  } = useTheme();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const accents: { id: AccentColor; label: string; colorClass: string }[] = [
    { id: 'cyan', label: 'Cyan', colorClass: 'bg-cyan-400' },
    { id: 'purple', label: 'Purple', colorClass: 'bg-purple-400' },
    { id: 'blue', label: 'Blue', colorClass: 'bg-blue-400' },
    { id: 'green', label: 'Green', colorClass: 'bg-emerald-400' },
    { id: 'orange', label: 'Orange', colorClass: 'bg-orange-400' },
    { id: 'pink', label: 'Pink', colorClass: 'bg-pink-400' },
    { id: 'red', label: 'Red', colorClass: 'bg-red-400' },
  ];

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setRenameValue(currentProject.name);
  };

  const handleSaveRename = () => {
    if (renameValue.trim() && renameValue !== currentProject.name) {
      renameProject(currentProject.id, renameValue);
    }
    setIsRenaming(false);
  };

  return (
    <header className="relative z-30 h-14 border-b border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] backdrop-blur-md px-3 sm:px-5 flex items-center justify-between select-none">
      {/* Subtle top energetic glow accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--dm-accent)] to-transparent opacity-80" />

      {/* Left: Branding & Cockpit Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {/* Black Hole Symbol Mini Logo */}
          <div className="relative w-7 h-7 rounded-full bg-black border border-[var(--dm-accent-border)] flex items-center justify-center shadow-[0_0_12px_var(--dm-accent-soft)]">
            <div className="w-4 h-4 rounded-full border border-dashed border-[var(--dm-accent)] animate-spin-slow" />
            <div className="absolute w-2 h-2 rounded-full bg-[var(--dm-accent)]" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-sm tracking-wider text-[var(--dm-text)]">
                DARK MATTER
              </span>
              <span className="text-[var(--dm-accent)] font-mono text-[11px] font-semibold">
                //
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[var(--dm-text-secondary)] hidden sm:inline">
                COMMAND OS
              </span>
            </div>
          </div>
        </div>

        {/* Global Quick Command Prompt Button (Ctrl+K) */}
        <button
          onClick={() => {
            playCockpitBeep('pulse');
            setIsCommandPaletteOpen(true);
          }}
          className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md border border-[var(--dm-border)] bg-[var(--dm-surface)] hover:border-[var(--dm-accent-border)] text-xs text-[var(--dm-text-secondary)] transition-all cursor-pointer"
          title="Open AI Command Terminal"
        >
          <Search className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
          <span className="font-mono text-[11px]">
            &gt; Direct Command System...
          </span>
          <kbd className="font-mono text-[9px] bg-[var(--dm-surface-elevated)] px-1.5 py-0.5 rounded border border-[var(--dm-border)] text-[var(--dm-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Current Project Selector & Actions */}
      <div className="relative flex items-center gap-2">
        {isRenaming ? (
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-cyan-500">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename();
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              autoFocus
              className="bg-transparent text-white font-mono text-xs focus:outline-none w-48 px-1"
            />
            <button
              onClick={handleSaveRename}
              className="text-[10px] font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-black px-2 py-0.5 rounded"
            >
              SAVE
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              playCockpitBeep('click');
              setIsProjectDropdownOpen(!isProjectDropdownOpen);
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-[var(--dm-border-bright)] bg-[var(--dm-surface)] hover:border-[var(--dm-accent-border)] hover:bg-[var(--dm-surface-hover)] transition-all shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                currentProject.status === 'Archived'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
              }`}
            />
            <span className="font-mono text-[10px] text-[var(--dm-accent)] tracking-wider uppercase font-semibold">
              PROJECT:
            </span>
            <span className="font-display text-xs sm:text-sm font-semibold text-[var(--dm-text)] tracking-wide max-w-[140px] sm:max-w-[200px] truncate">
              {currentProject.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-slate-700 bg-slate-900 text-slate-400">
              {currentProject.status || 'Active'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--dm-muted)] ml-1" />
          </button>
        )}

        {/* Rename trigger button */}
        {!isRenaming && (
          <button
            onClick={handleStartRename}
            className="p-1.5 rounded border border-slate-800 hover:border-slate-600 bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
            title="Rename Active Mission"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Project Selector Dropdown */}
        {isProjectDropdownOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 rounded-xl border border-[var(--dm-border-bright)] bg-[var(--dm-surface-elevated)] shadow-2xl backdrop-blur-xl p-2.5 z-50">
            <div className="px-2 py-1.5 border-b border-[var(--dm-divider)] flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--dm-muted)]">
                SPACE MISSIONS ({projects.length})
              </span>
              <button
                onClick={() => {
                  setIsProjectDropdownOpen(false);
                  setIsCreateProjectOpen(true);
                }}
                className="font-mono text-[10px] text-[var(--dm-accent)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Plus className="w-3 h-3" /> NEW EXPEDITION
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto my-1.5 space-y-1">
              {projects.map((proj) => {
                const isSelected = proj.id === currentProject.id;
                const isArchived = proj.status === 'Archived';
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      selectProject(proj.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between text-xs cursor-pointer group ${
                      isSelected
                        ? 'bg-[var(--dm-accent-soft)] border border-[var(--dm-accent-border)] text-[var(--dm-text)]'
                        : 'hover:bg-[var(--dm-surface-hover)] text-[var(--dm-text-secondary)] border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="font-display font-semibold truncate text-[var(--dm-text)]">
                          {proj.name}
                        </p>
                        {isArchived && (
                          <span className="text-[9px] font-mono px-1 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60">
                            VAULT
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[9px] text-[var(--dm-muted)] uppercase">
                        {proj.contentType} // {proj.primaryMode}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isArchived ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreProject(proj.id);
                          }}
                          className="p-1 hover:text-emerald-400 rounded"
                          title="Restore Project"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveProject(proj.id);
                          }}
                          className="p-1 hover:text-amber-400 rounded"
                          title="Archive Project"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(proj.id);
                        }}
                        className="p-1 hover:text-red-400 rounded"
                        title="Purge Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[var(--dm-divider)] flex gap-1.5">
              <button
                onClick={() => {
                  setIsProjectDropdownOpen(false);
                  setIsCreateProjectOpen(true);
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-display uppercase tracking-wider text-black bg-[var(--dm-accent)] hover:brightness-110 rounded-lg transition-all cursor-pointer font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW MISSION</span>
              </button>

              <button
                onClick={() => {
                  exportProjectJson();
                  setIsProjectDropdownOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1"
                title="Export Active Mission as JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Autosave Indicator, Telemetry, Themes, Audio, Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Autosave Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition-all ${
            autosaveStatus === 'SAVED'
              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
              : autosaveStatus === 'SAVING'
              ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400'
              : autosaveStatus === 'ERROR'
              ? 'border-red-500/40 bg-red-950/20 text-red-400'
              : 'border-amber-500/40 bg-amber-950/20 text-amber-400'
          }`}
          title="Autonomous Storage State"
        >
          {autosaveStatus === 'SAVED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          {autosaveStatus === 'SAVING' && <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />}
          {autosaveStatus === 'ERROR' && <AlertCircle className="w-3 h-3 text-red-400" />}
          <span>{autosaveStatus}</span>
        </div>

        {/* Telemetry badges */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px] font-mono border-r border-[var(--dm-divider)] pr-3">
          {/* AI Core Status */}
          <div className="flex items-center space-x-1.5" title="AI Core Operational State">
            <Radio className="w-3.5 h-3.5 text-[var(--dm-accent)] animate-pulse" />
            <span className="text-[var(--dm-muted)]">CORE:</span>
            <span className="text-emerald-400 font-semibold">{telemetry.aiCoreStatus}</span>
          </div>

          {/* Local AI Status */}
          <div className="flex items-center space-x-1.5" title="Local Autonomous Core State">
            <Cpu className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
            <span className="text-[var(--dm-muted)]">LOCAL:</span>
            <span className="text-cyan-400 font-semibold">{telemetry.localAIStatus}</span>
          </div>

          {/* Storage Buffer */}
          <div className="flex items-center space-x-1.5" title="Gravitational Storage Buffer">
            <HardDrive className="w-3.5 h-3.5 text-[var(--dm-muted)]" />
            <span className="text-[var(--dm-muted)]">BUFFER:</span>
            <span className="text-[var(--dm-text-secondary)]">{telemetry.bufferOccupancy}%</span>
          </div>
        </div>

        {/* Theme & Accent Palette Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              playCockpitBeep('click');
              setIsThemeMenuOpen(!isThemeMenuOpen);
            }}
            className="p-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] hover:border-[var(--dm-accent-border)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text)] transition-all cursor-pointer"
            title="Appearance & Accent Palette"
          >
            <Palette className="w-4 h-4 text-[var(--dm-accent)]" />
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--dm-border-bright)] bg-[var(--dm-surface-elevated)] shadow-2xl backdrop-blur-xl p-3 z-50">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--dm-muted)] mb-2">
                COCKPIT ATMOSPHERE
              </div>

              {/* Theme Modes */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {(['dark', 'mixed', 'light'] as ThemeMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTheme(m)}
                    className={`px-2 py-1.5 text-[11px] font-display uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                      theme === m
                        ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-[var(--dm-text)] font-semibold'
                        : 'border-[var(--dm-border)] text-[var(--dm-muted)] hover:text-[var(--dm-text)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--dm-muted)] mb-2">
                PHOTON ACCENT HARMONICS
              </div>

              {/* Accent Color Circles */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                {accents.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccent(acc.id)}
                    className={`w-6 h-6 rounded-full ${acc.colorClass} flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${
                      accent === acc.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                    }`}
                    title={acc.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cockpit Audio Toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playCockpitBeep('engage');
          }}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            soundEnabled
              ? 'border-[var(--dm-accent-border)] bg-[var(--dm-accent-soft)] text-[var(--dm-accent)] shadow-[0_0_8px_var(--dm-accent-soft)]'
              : 'border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-muted)]'
          }`}
          title={soundEnabled ? 'Cockpit Audio Feedback: ON' : 'Cockpit Audio Feedback: OFF'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            playCockpitBeep('click');
            setIsSettingsOpen(true);
          }}
          className="p-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] hover:border-[var(--dm-accent-border)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text)] transition-all cursor-pointer"
          title="Master System Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Commander Identity Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[var(--dm-divider)]">
          <div className="w-7 h-7 rounded-lg border border-[var(--dm-border-bright)] bg-[var(--dm-surface-hover)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--dm-accent)] shadow-[0_0_8px_var(--dm-accent-soft)]">
            EV
          </div>
          <div className="hidden xl:block leading-none">
            <p className="font-display text-xs font-semibold text-[var(--dm-text)]">CMDR. VANCE</p>
            <p className="font-mono text-[9px] text-[var(--dm-muted)] uppercase">BRIDGE COMMAND</p>
          </div>
        </div>
      </div>
    </header>
  );
};
