import React from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { AICoreVisualizer } from './AICoreVisualizer';
import { ProjectCorePanel } from './ProjectCorePanel';
import { QuickActionCards } from './QuickActionCards';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { 
  Rocket, 
  Database, 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const MainDashboardView: React.FC = () => {
  const { currentProject, telemetry, setActiveModule, setIsCreateProjectOpen } = useApp();
  const { playCockpitBeep } = useTheme();

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SECTION 6 & 7: MAIN HERO WITH AI CORE & SATELLITE NODES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left 7 Cols: Central AI Gravitational Core */}
        <div className="lg:col-span-7 flex flex-col">
          <AICoreVisualizer />
        </div>

        {/* Right 5 Cols: Project Core Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <ProjectCorePanel />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 9: QUICK ACTION COMMAND MODULES */}
      {/* ========================================================================= */}
      <QuickActionCards />

      {/* ========================================================================= */}
      {/* MISSION CONTROL TELEMETRY & SYSTEM STATE ROW */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Project Memory State */}
        <HoloPanel
          title="QUANTUM MEMORY"
          subtitle="PERSISTENT CONTEXT"
          headerRight={<Database className="w-3.5 h-3.5 text-[var(--dm-accent)]" />}
        >
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">IDEAS VAULTED</span>
              <span className="font-display font-semibold text-cyan-400">{currentProject.ideas?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">SCRIPTS ACTIVE</span>
              <span className="font-display font-semibold text-indigo-300">{currentProject.scripts?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">SCENES & SHOTS</span>
              <span className="font-display font-semibold text-white">{currentProject.scenes.length}</span>
            </div>
          </div>
        </HoloPanel>

        {/* Card 2: Gravitational Warp & Frequency */}
        <HoloPanel
          title="WARP TELEMETRY"
          subtitle="RELATIVISTIC DRIFT"
          headerRight={<Zap className="w-3.5 h-3.5 text-amber-400" />}
        >
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">G-WARP VELOCITY</span>
              <span className="font-mono font-bold text-amber-400">{telemetry.gravityWarp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">CORE CARRIER FREQ</span>
              <span className="font-mono text-white">{telemetry.coreFrequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">GRID STABILITY</span>
              <span className="font-mono text-emerald-400">99.98%</span>
            </div>
          </div>
        </HoloPanel>

        {/* Card 3: Story Mode Fusion Status */}
        <HoloPanel
          title="STORY HARMONICS"
          subtitle="ACTIVE MODE FUSION"
          headerRight={<SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />}
        >
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">PRIMARY MODE</span>
              <span className="font-display font-bold text-white uppercase">{currentProject.primaryMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">SECONDARY MODE</span>
              <span className="font-display font-bold text-purple-400 uppercase">{currentProject.secondaryMode}</span>
            </div>
            <button
              onClick={() => {
                playCockpitBeep('engage');
                setActiveModule('story-mode');
              }}
              className="w-full text-right text-[10px] font-mono text-[var(--dm-accent)] hover:underline pt-1 cursor-pointer flex items-center justify-end gap-1"
            >
              ADJUST FUSION MATRIX <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </HoloPanel>

        {/* Card 4: Cockpit Operational Status */}
        <HoloPanel
          title="SYSTEM STATE"
          subtitle="MISSION DIRECTIVE"
          headerRight={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
        >
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">PIPELINE STATUS</span>
              <span className="font-mono font-bold text-emerald-400 uppercase">{currentProject.systemState}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">AI CORE STATUS</span>
              <span className="font-mono text-cyan-400 uppercase">{telemetry.aiCoreStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--dm-muted)] font-mono text-[10px]">INTEGRITY SHIELD</span>
              <span className="font-mono text-emerald-400">NOMINAL // 100%</span>
            </div>
          </div>
        </HoloPanel>
      </div>
    </div>
  );
};
