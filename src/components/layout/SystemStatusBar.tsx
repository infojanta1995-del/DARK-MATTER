import React from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { Activity, ShieldCheck, Cpu, Radio, Zap, Gauge } from 'lucide-react';

export const SystemStatusBar: React.FC<{
  onToggleMobileNav: () => void;
}> = ({ onToggleMobileNav }) => {
  const { currentProject, activeModule, telemetry } = useApp();
  const { performance } = useTheme();

  return (
    <footer className="relative z-30 h-8 border-t border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] backdrop-blur-md px-3 sm:px-4 flex items-center justify-between text-[10px] font-mono select-none">
      {/* Left: Mobile Nav Toggle & Core Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden px-2 py-0.5 rounded border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-accent)] font-semibold"
        >
          CONSOLE MENU
        </button>

        <div className="flex items-center space-x-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider hidden sm:inline">
            SYSTEM STATUS:
          </span>
          <span className="font-bold">OPERATIONAL</span>
        </div>

        <div className="hidden md:flex items-center space-x-1 text-[var(--dm-muted)] border-l border-[var(--dm-divider)] pl-3">
          <Radio className="w-3 h-3 text-[var(--dm-accent)]" />
          <span>FREQ:</span>
          <span className="text-[var(--dm-text-secondary)]">{telemetry.coreFrequency}</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1 text-[var(--dm-muted)]">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>WARP:</span>
          <span className="text-[var(--dm-text-secondary)]">{telemetry.gravityWarp}</span>
        </div>
      </div>

      {/* Center: Mission & Active Module Context */}
      <div className="flex items-center space-x-2 text-[var(--dm-text-secondary)] truncate px-2">
        <span className="text-[var(--dm-muted)] hidden sm:inline">MISSION:</span>
        <span className="text-[var(--dm-accent)] font-semibold truncate max-w-[120px] sm:max-w-[180px]">
          {currentProject.name}
        </span>
        <span className="text-[var(--dm-muted)]">//</span>
        <span className="text-[var(--dm-muted)] hidden sm:inline">ACTIVE:</span>
        <span className="text-[var(--dm-text)] uppercase font-semibold">
          {activeModule.replace('-', ' ')}
        </span>
      </div>

      {/* Right: Telemetry & Engine Diagnostics */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-1 text-[var(--dm-muted)]">
          <Cpu className="w-3 h-3 text-[var(--dm-accent)]" />
          <span>PERF:</span>
          <span className="text-cyan-400 font-semibold uppercase">{performance}</span>
        </div>

        <div className="flex items-center space-x-1 text-[var(--dm-muted)]">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>LATENCY:</span>
          <span className="text-emerald-400 font-semibold">4.2ms</span>
        </div>

        <div className="hidden md:flex items-center space-x-1 text-[var(--dm-muted)] border-l border-[var(--dm-divider)] pl-2">
          <ShieldCheck className="w-3 h-3 text-[var(--dm-accent)]" />
          <span>QUANTUM SHIELD:</span>
          <span className="text-emerald-400">100%</span>
        </div>
      </div>
    </footer>
  );
};
