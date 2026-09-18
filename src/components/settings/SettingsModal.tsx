import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  X, 
  Cpu, 
  HardDrive, 
  Volume2, 
  VolumeX, 
  Palette, 
  Check, 
  Download, 
  Upload, 
  Layers, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { ProviderRegistry } from '../../core/ai/ProviderRegistry';
import { AccentColor, PerformanceLevel, ThemeMode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    projects, 
    currentProject, 
    autosaveStatus, 
    exportProjectJson, 
    importProjectJson,
    triggerToast,
  } = useApp();

  const {
    theme,
    setTheme,
    accent,
    setAccent,
    performance,
    setPerformance,
    soundEnabled,
    setSoundEnabled,
    playCockpitBeep,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'system' | 'storage' | 'ai' | 'visuals'>('system');
  const providers = ProviderRegistry.listProviders();

  if (!isOpen) return null;

  const handleExport = () => {
    playCockpitBeep('engage');
    exportProjectJson();
    triggerToast('success', 'TELEMETRY EXPORTED', 'Project mission manifest successfully generated as JSON.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importProjectJson(parsed);
        playCockpitBeep('engage');
        triggerToast('success', 'PAYLOAD RESTORED', 'Project successfully imported into command bridge memory.');
      } catch (err) {
        console.error('Import parse error:', err);
        triggerToast('error', 'CORRUPT PAYLOAD', 'Invalid JSON project structure. Telemetry abort.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const accents: { id: AccentColor; label: string; colorClass: string }[] = [
    { id: 'purple', label: 'Dark Nebula', colorClass: 'bg-purple-500' },
    { id: 'cyan', label: 'Cyan Pulsar', colorClass: 'bg-cyan-500' },
    { id: 'blue', label: 'Deep Void', colorClass: 'bg-blue-500' },
    { id: 'green', label: 'Aurora Grid', colorClass: 'bg-emerald-500' },
    { id: 'orange', label: 'Solar Flare', colorClass: 'bg-amber-500' },
    { id: 'pink', label: 'Event Glow', colorClass: 'bg-pink-500' },
    { id: 'red', label: 'Core Breach', colorClass: 'bg-red-500' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playCockpitBeep('click');
            onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-xl border border-cyan-500/40 bg-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                  MASTER COMMAND CONFIGURATION // SYSTEM CORE
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Autonomous Spacecraft Operational Preferences
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playCockpitBeep('click');
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-black/40 px-6 gap-2">
            {(
              [
                { id: 'system', label: 'SYSTEM & AUDIO', icon: Volume2 },
                { id: 'visuals', label: 'HOLO VISUALS', icon: Palette },
                { id: 'storage', label: 'LOCAL STORAGE', icon: HardDrive },
                { id: 'ai', label: 'AI ADAPTERS', icon: Cpu },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playCockpitBeep('click');
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-3 text-xs font-mono font-medium border-b-2 transition-all ${
                    isActive
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs">
            {/* SYSTEM & AUDIO */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Cockpit Acoustic Synthesis
                  </h4>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-800 bg-slate-900/40">
                    <div>
                      <p className="font-semibold text-slate-100 font-sans">
                        Web Audio Cockpit Sound Feedback
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Procedural sine/square frequencies on clicks, status shifts, and engine operations.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        if (!soundEnabled) playCockpitBeep('engage');
                      }}
                      className={`px-4 py-2 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all ${
                        soundEnabled
                          ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      <span>{soundEnabled ? 'ONLINE' : 'MUTED'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <Radio className="w-4 h-4" /> Engine Pacing & Processing Mode
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['high', 'medium', 'low'] as PerformanceLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          playCockpitBeep('click');
                          setPerformance(lvl);
                        }}
                        className={`p-3 rounded-lg border text-left font-mono transition-all ${
                          performance === lvl
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs uppercase">{lvl} TIER</div>
                        <div className="text-[10px] text-slate-400 mt-1 capitalize">
                          {lvl === 'high'
                            ? 'Full 60fps canvas & particles'
                            : lvl === 'medium'
                            ? 'Balanced GPU usage'
                            : 'Eco minimal CPU draw'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISUALS */}
            {activeTab === 'visuals' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Core Theme Luminance
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'light', 'mixed'] as ThemeMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          playCockpitBeep('click');
                          setTheme(mode);
                        }}
                        className={`p-3 rounded-lg border text-left font-mono transition-all ${
                          theme === mode
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs uppercase">{mode} MODE</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {mode === 'dark'
                            ? 'Deep space obsidian canvas'
                            : mode === 'light'
                            ? 'High-visibility lunar contrast'
                            : 'Hybrid command bridge palette'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3">
                    Holographic Accent Frequency
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {accents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          playCockpitBeep('click');
                          setAccent(item.id);
                        }}
                        className={`p-2.5 rounded-lg border text-left font-mono text-xs flex items-center gap-2.5 transition-all ${
                          accent === item.id
                            ? 'border-cyan-400 bg-slate-900 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${item.colorClass}`} />
                        <span className="truncate">{item.label}</span>
                        {accent === item.id && <Check className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LOCAL STORAGE */}
            {activeTab === 'storage' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" /> Local-First Persistence Engine
                  </h4>
                  <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono text-xs">Storage Architecture:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                        LOCAL-FIRST REDUNDANT
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono text-xs">Autosave Engine Status:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/40">
                        {autosaveStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono text-xs">Total Expeditions In Storage:</span>
                      <span className="font-mono text-white font-bold">{projects.length} Projects</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-mono text-xs">Current Mission Footprint:</span>
                      <span className="font-mono text-white">
                        {currentProject.scenes.length} Scenes / {currentProject.shots.length} Shots / {currentProject.assets.length} Assets
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Backup & Telemetry Data Transfer
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleExport}
                      className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    >
                      <Download className="w-4 h-4" />
                      <span>EXPORT MISSION JSON</span>
                    </button>

                    <label className="p-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      <span>IMPORT MISSION JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* AI ADAPTERS */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/20 text-cyan-200 text-xs leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold font-mono">STANDALONE ARCHITECTURE GUARANTEE:</span>
                    <p className="mt-0.5 text-slate-300">
                      DARK MATTER does not depend on any cloud AI credentials. The Autonomous Local Engine is permanently active, while future adapters connect safely via clean interfaces.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {providers.map((p) => {
                    const isOnline = p.status === 'READY';
                    return (
                      <div
                        key={p.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isOnline
                            ? 'border-cyan-500/40 bg-slate-900/70 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                            : 'border-slate-800/80 bg-slate-950/50 opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isOnline ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
                              }`}
                            />
                            <span className="font-mono font-bold text-xs text-white">
                              {p.name}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold ${
                              isOnline
                                ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300'
                                : 'bg-slate-900 border border-slate-700 text-slate-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
                          {p.description}
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-4 text-[11px] font-mono text-slate-400">
                          <span>TYPE: {p.endpointType}</span>
                          <span>CONTEXT: {p.contextLimit}</span>
                          {p.quantization && <span>QUANT: {p.quantization}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              DARK MATTER OS // PROTOCOL V2.0.4
            </span>
            <button
              onClick={() => {
                playCockpitBeep('click');
                onClose();
              }}
              className="px-4 py-1.5 rounded border border-cyan-500 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs font-semibold tracking-wider transition-colors"
            >
              CLOSE COMMAND CONSOLE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
