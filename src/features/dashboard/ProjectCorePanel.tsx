import React from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PipelineStage, StageStatus } from '../../types';
import { CheckCircle2, Circle, Clock, Target, Rocket, Play, ChevronRight } from 'lucide-react';

interface StageItem {
  key: PipelineStage;
  label: string;
  moduleId: string;
}

const PIPELINE_STAGES: StageItem[] = [
  { key: 'research', label: 'Research', moduleId: 'research' },
  { key: 'ideas', label: 'Ideas', moduleId: 'ideas' },
  { key: 'story', label: 'Story', moduleId: 'story' },
  { key: 'script', label: 'Script', moduleId: 'script' },
  { key: 'production', label: 'Production', moduleId: 'production' },
  { key: 'media', label: 'Media', moduleId: 'media' },
  { key: 'video', label: 'Video', moduleId: 'video' },
  { key: 'seo', label: 'SEO', moduleId: 'seo' },
  { key: 'publishing', label: 'Publishing', moduleId: 'publishing' },
];

export const ProjectCorePanel: React.FC = () => {
  const { currentProject, updatePipelineStage, setActiveModule } = useApp();
  const { playCockpitBeep } = useTheme();

  const completedCount = Object.values(currentProject.pipelineProgress).filter(
    (s) => s === 'completed'
  ).length;
  const progressPercent = Math.round((completedCount / PIPELINE_STAGES.length) * 100);

  const handleStageClick = (stage: StageItem) => {
    playCockpitBeep('click');
    const currentStatus = currentProject.pipelineProgress[stage.key];
    const nextStatus: StageStatus = 
      currentStatus === 'pending' ? 'in-progress' :
      currentStatus === 'in-progress' ? 'completed' : 'pending';
    
    updatePipelineStage(stage.key, nextStatus);
  };

  const getStageIcon = (status: StageStatus) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (status === 'in-progress') {
      return <Clock className="w-4 h-4 text-[var(--dm-accent)] animate-spin-slow" />;
    }
    return <Circle className="w-4 h-4 text-slate-600" />;
  };

  return (
    <HoloPanel
      title="PROJECT CORE"
      subtitle={currentProject.codename}
      headerRight={
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-[var(--dm-muted)] uppercase">
            COMPLETION:
          </span>
          <span className="font-mono text-xs font-bold text-[var(--dm-accent)]">
            {progressPercent}%
          </span>
        </div>
      }
      className="h-full flex flex-col justify-between"
    >
      {/* Project Identity & Mission Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase tracking-widest">
            // MISSION OBJECTIVE
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-[var(--dm-text-secondary)]">
            {currentProject.contentType}
          </span>
        </div>

        <h2 className="font-display text-base sm:text-lg font-bold text-[var(--dm-text)] tracking-wide">
          {currentProject.name}
        </h2>

        <p className="text-xs text-[var(--dm-text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
          {currentProject.missionObjective || currentProject.description}
        </p>

        {/* Global Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
            <span>PIPELINE VELOCITY</span>
            <span>{completedCount} OF {PIPELINE_STAGES.length} STAGES CLEAR</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--dm-surface-elevated)] rounded-full overflow-hidden border border-[var(--dm-border)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--dm-accent)] to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pipeline Stage Checklist (Interactive Mission Telemetry) */}
      <div className="space-y-1 my-2">
        <div className="text-[10px] font-mono text-[var(--dm-muted)] uppercase tracking-wider px-1 mb-1.5 flex justify-between items-center">
          <span>PIPELINE MILESTONES</span>
          <span className="text-[9px] text-[var(--dm-accent)]">CLICK TO ADVANCE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {PIPELINE_STAGES.map((stage) => {
            const status = currentProject.pipelineProgress[stage.key];

            return (
              <div
                key={stage.key}
                onClick={() => handleStageClick(stage)}
                className={`
                  flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer select-none
                  ${
                    status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                      : status === 'in-progress'
                      ? 'bg-[var(--dm-accent-soft)] border-[var(--dm-accent-border)] shadow-[0_0_8px_var(--dm-accent-soft)]'
                      : 'bg-[var(--dm-surface-elevated)] border-[var(--dm-border)] hover:border-[var(--dm-border-bright)]'
                  }
                `}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getStageIcon(status)}
                  <span className="font-display font-medium tracking-wide truncate text-[var(--dm-text)]">
                    {stage.label}
                  </span>
                </div>

                <span className="font-mono text-[9px] uppercase text-[var(--dm-muted)]">
                  {status === 'completed' ? 'CLEAR' : status === 'in-progress' ? 'ACTIVE' : 'READY'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Footer Meta & Jump to Script Studio */}
      <div className="pt-3 border-t border-[var(--dm-divider)] mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-[var(--dm-text-secondary)] uppercase">
            SYSTEM STATE: <strong className="text-white">{currentProject.systemState}</strong>
          </span>
        </div>

        <button
          onClick={() => {
            playCockpitBeep('engage');
            setActiveModule('script');
          }}
          className="flex items-center space-x-1.5 text-xs font-display text-[var(--dm-accent)] hover:underline uppercase tracking-wider cursor-pointer"
        >
          <span>OPEN SCRIPT STUDIO</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </HoloPanel>
  );
};
