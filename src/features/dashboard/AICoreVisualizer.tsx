import React from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { ModuleId, PipelineStage } from '../../types';

interface CoreNode {
  id: ModuleId;
  label: string;
  stageKey?: PipelineStage;
  angleDeg: number; // orbital angle
  distance: number; // orbital radius
}

const NODES: CoreNode[] = [
  { id: 'trends', label: 'TREND', angleDeg: 270, distance: 165 },
  { id: 'research', label: 'RESEARCH', stageKey: 'research', angleDeg: 225, distance: 165 },
  { id: 'story', label: 'STORY', stageKey: 'story', angleDeg: 315, distance: 165 },
  { id: 'ideas', label: 'IDEAS', stageKey: 'ideas', angleDeg: 180, distance: 165 },
  { id: 'script', label: 'SCRIPT', stageKey: 'script', angleDeg: 0, distance: 165 },
  { id: 'production', label: 'PRODUCTION', stageKey: 'production', angleDeg: 45, distance: 165 },
  { id: 'media', label: 'MEDIA', stageKey: 'media', angleDeg: 135, distance: 165 },
  { id: 'video', label: 'VIDEO', stageKey: 'video', angleDeg: 90, distance: 165 },
  { id: 'seo', label: 'SEO', stageKey: 'seo', angleDeg: 110, distance: 195 },
  { id: 'publishing', label: 'PUBLISHING', stageKey: 'publishing', angleDeg: 70, distance: 195 },
];

export const AICoreVisualizer: React.FC = () => {
  const { currentProject, telemetry, setActiveModule, updatePipelineStage } = useApp();
  const { performance, playCockpitBeep } = useTheme();

  const isProcessing = telemetry.aiCoreStatus === 'PROCESSING';

  const getNodeColor = (node: CoreNode) => {
    if (!node.stageKey) return 'border-[var(--dm-border)] text-[var(--dm-text-secondary)]';
    const status = currentProject.pipelineProgress[node.stageKey];
    if (status === 'completed') return 'border-emerald-500/60 bg-emerald-950/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    if (status === 'in-progress') return 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-[var(--dm-accent)] shadow-[0_0_12px_var(--dm-accent-soft)]';
    return 'border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] text-[var(--dm-muted)]';
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl border border-[var(--dm-border)] bg-[var(--dm-surface)] backdrop-blur-xl overflow-hidden flex items-center justify-center p-4">
      {/* Background Radial Space Distortion Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, transparent 40px, rgba(40, 60, 95, 0.2) 41px, transparent 42px),
            radial-gradient(circle at center, transparent 95px, rgba(40, 60, 95, 0.2) 96px, transparent 97px),
            radial-gradient(circle at center, transparent 155px, rgba(40, 60, 95, 0.2) 156px, transparent 157px),
            radial-gradient(circle at center, transparent 210px, rgba(40, 60, 95, 0.15) 211px, transparent 212px)
          `,
        }}
      />

      {/* Cockpit HUD Coordinates Watermark */}
      <div className="absolute top-3 left-4 font-mono text-[9px] text-[var(--dm-muted)] tracking-widest uppercase pointer-events-none">
        GRAVITATIONAL CORE // SINGULARITY SENSOR
      </div>
      <div className="absolute top-3 right-4 font-mono text-[9px] text-[var(--dm-accent)] tracking-widest uppercase pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-accent)] animate-ping" />
        AI CORE // {telemetry.aiCoreStatus}
      </div>

      {/* SVG Connected Energy Vector Lines to Nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <linearGradient id="coreLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--dm-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--dm-accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Subtle coordinate crosshair in the center */}
        <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="var(--dm-border)" strokeDasharray="3 3" opacity="0.4" />
        <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="var(--dm-border)" strokeDasharray="3 3" opacity="0.4" />
      </svg>

      {/* ========================================================================= */}
      {/* CENTRAL BLACK HOLE / AI CORE VISUALIZATION */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Outer Gravitational Horizon Ring (Rotating) */}
        <div 
          className={`
            relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center
            ${performance !== 'low' ? 'animate-spin-slow' : ''}
          `}
        >
          {/* Glowing Event Horizon Border */}
          <div 
            className="absolute inset-0 rounded-full border border-dashed border-[var(--dm-accent-border)] opacity-60"
            style={{
              boxShadow: isProcessing 
                ? '0 0 35px var(--dm-accent-glow), inset 0 0 25px var(--dm-accent-soft)'
                : '0 0 20px var(--dm-accent-soft), inset 0 0 15px var(--dm-accent-soft)',
            }}
          />

          {/* Reverse Orbiting Particle Ring */}
          <div 
            className={`
              absolute inset-3 rounded-full border border-[var(--dm-border-bright)] opacity-40
              ${performance !== 'low' ? 'animate-spin-reverse' : ''}
            `}
          >
            {/* Satellite photon bead */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--dm-accent)] shadow-[0_0_8px_var(--dm-accent)]" />
            <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
          </div>

          {/* Innermost Dark Core (The Singularity) */}
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black border border-[var(--dm-border-bright)] flex flex-col items-center justify-center relative shadow-[inset_0_0_30px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {/* Central Dark Matter Pulse Halo */}
            <div 
              className="absolute inset-0 rounded-full opacity-40 bg-gradient-to-tr from-[var(--dm-accent-soft)] via-transparent to-purple-900/30 animate-pulse-energy" 
            />

            {/* Core Brand Text */}
            <div className="relative z-10 text-center px-2 select-none pointer-events-none">
              <span className="block font-display text-[10px] sm:text-xs font-bold tracking-widest text-[var(--dm-text)]">
                DARK MATTER
              </span>
              <div className="w-8 h-[1px] bg-[var(--dm-accent)] mx-auto my-1 shadow-[0_0_4px_var(--dm-accent)]" />
              <span className="block font-mono text-[8px] sm:text-[9px] text-[var(--dm-accent)] tracking-wider uppercase font-semibold">
                AI CORE
              </span>
            </div>
          </div>
        </div>

        {/* State Label Below Core */}
        <div className="mt-3 text-center">
          <span className="font-mono text-[10px] tracking-widest text-[var(--dm-text-secondary)] uppercase bg-[var(--dm-surface-elevated)] px-3 py-1 rounded-full border border-[var(--dm-border)] shadow-sm">
            AI CONTENT CORE // {telemetry.aiCoreStatus}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONNECTED CONTENT-PRODUCTION SATELLITE NODES */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {NODES.map((node) => {
          const rad = (node.angleDeg * Math.PI) / 180;
          // Responsive orbital radius scaling
          const distanceScale = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.78 : 1;
          const x = Math.cos(rad) * (node.distance * distanceScale);
          const y = Math.sin(rad) * (node.distance * distanceScale);

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute pointer-events-auto"
            >
              <button
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveModule(node.id);
                }}
                className={`
                  group relative px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-[10px] sm:text-[11px]
                  font-display uppercase tracking-wider backdrop-blur-md transition-all duration-200 cursor-pointer
                  hover:scale-105 active:scale-95 flex items-center gap-1.5
                  ${getNodeColor(node)}
                `}
                title={`Access ${node.label} Module`}
              >
                {/* Node micro-dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                <span className="font-semibold">{node.label}</span>

                {/* Energy connector line indicator */}
                <div 
                  className="absolute -z-10 w-8 h-[1px] bg-gradient-to-r from-[var(--dm-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
