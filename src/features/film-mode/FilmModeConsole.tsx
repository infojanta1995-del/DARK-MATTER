import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { 
  Film, 
  Tv, 
  Clapperboard, 
  Upload, 
  Play, 
  Sliders, 
  Layers, 
  FileSearch, 
  Eye, 
  Flame,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const FilmModeConsole: React.FC = () => {
  const { currentProject, setActiveModule } = useApp();
  const { playCockpitBeep } = useTheme();

  const [filmFormat, setFilmFormat] = useState<'Movie' | 'Web Series' | 'Custom'>('Movie');
  const [activeAnalysisStage, setActiveAnalysisStage] = useState<number>(2);
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);

  const pipelineStages = [
    { label: 'SOURCE', desc: 'Raw master reels, camera logs, audio stems' },
    { label: 'ANALYSIS', desc: 'Spectral audio decoding & cadence breakdown' },
    { label: 'STORY UNDERSTANDING', desc: 'Three-act tension curve & thematic mapping' },
    { label: 'CHARACTERS', desc: 'Biometric voiceprints & character arcs' },
    { label: 'TIMELINE', desc: 'Non-linear relativistic timeline sequencing' },
    { label: 'SCENES', desc: 'Micro-beat breakdowns & lighting palettes' },
    { label: 'EXPLANATION SCRIPT', desc: 'Director narration & subtext notes' },
    { label: 'PRODUCTION', desc: 'Ready for full optical render pipeline' },
  ];

  const handleStartAnalysis = () => {
    playCockpitBeep('engage');
    setIsSimulatingAnalysis(true);
    setTimeout(() => {
      setActiveAnalysisStage(3);
      setIsSimulatingAnalysis(false);
      playCockpitBeep('pulse');
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase">
            <Flame className="w-4 h-4" />
            <span>// CINEMATIC FILM COMMAND CONSOLE</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            FILM PRODUCTION & ANALYSIS ENGINE
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Ingest feature-length screenplays, multi-cam reels, and generate automated shot lists.
          </p>
        </div>

        {/* Film Format Selector */}
        <div className="flex items-center space-x-2 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)]">
          {(['Movie', 'Web Series', 'Custom'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => {
                playCockpitBeep('click');
                setFilmFormat(fmt);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                filmFormat === fmt
                  ? 'bg-amber-500 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-[var(--dm-text-secondary)] hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILM MODE PIPELINE SEQUENCE */}
      {/* ========================================================================= */}
      <HoloPanel
        title="CINEMATIC DECONSTRUCTION PIPELINE"
        subtitle={`ACTIVE CONFIGURATION: ${filmFormat.toUpperCase()}`}
        className="border-amber-500/30"
      >
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[760px] space-x-2">
            {pipelineStages.map((stage, idx) => {
              const isPast = idx < activeAnalysisStage;
              const isCurrent = idx === activeAnalysisStage;

              return (
                <React.Fragment key={stage.label}>
                  <div
                    onClick={() => {
                      playCockpitBeep('click');
                      setActiveAnalysisStage(idx);
                    }}
                    className={`
                      flex-1 p-2.5 rounded-xl border text-center transition-all cursor-pointer
                      ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_14px_rgba(245,158,11,0.3)]'
                          : isPast
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                          : 'border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-muted)] opacity-60'
                      }
                    `}
                  >
                    <div className="font-mono text-[9px] mb-1">
                      {isPast ? 'STEP CLEAR' : isCurrent ? 'ACTIVE' : `PHASE 0${idx + 1}`}
                    </div>
                    <div className="font-display text-xs font-bold uppercase tracking-wider text-[var(--dm-text)] truncate">
                      {stage.label}
                    </div>
                    <div className="text-[9px] text-[var(--dm-muted)] mt-1 truncate">
                      {stage.desc}
                    </div>
                  </div>

                  {idx < pipelineStages.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--dm-border-bright)] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </HoloPanel>

      {/* ========================================================================= */}
      {/* CINEMATIC MEDIA-IMPORT & ANALYSIS WORKBENCH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Ingestion & Telemetry Monitors */}
        <div className="lg:col-span-2 space-y-4">
          {/* Drag & Drop Media Import Panel */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--dm-border-bright)] hover:border-amber-400 bg-[var(--dm-surface)] backdrop-blur-md text-center transition-all group">
            <div className="w-14 h-14 rounded-full border border-amber-500/50 bg-amber-950/30 text-amber-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--dm-text)] mb-1">
              INGEST SOURCE FOOTAGE / SCREENPLAY MANIFEST
            </h3>
            <p className="text-xs text-[var(--dm-text-secondary)] max-w-md mx-auto mb-4">
              Drag & drop master ProRes/RAW video clips, Fountain screenplay files, or multi-track audio stems for automated cognitive breakdown.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <GlowButton
                variant="primary"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                loading={isSimulatingAnalysis}
                onClick={handleStartAnalysis}
              >
                RUN CINEMATIC ANALYSIS
              </GlowButton>
              <span className="text-[10px] font-mono text-[var(--dm-muted)]">
                SUPPORTED: EXR, MP4, FOUNTAIN, WAV, FCPXML
              </span>
            </div>
          </div>

          {/* Analysis Viewport: 3-Act Tension Graph & Scene Cadence */}
          <HoloPanel title="NARRATIVE TENSION CURVE & CADENCE" subtitle="ASTRAEA CHRONOLOGY // ACT I - III">
            <div className="h-44 w-full bg-[var(--dm-surface-elevated)] rounded-xl border border-[var(--dm-border)] p-3 flex flex-col justify-between relative overflow-hidden">
              {/* SVG Waveform Curve */}
              <svg className="w-full h-28 overflow-visible">
                <defs>
                  <linearGradient id="tensionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 90 Q 80 85, 160 65 T 320 50 T 480 20 T 640 40 T 780 15"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                <path
                  d="M 10 90 Q 80 85, 160 65 T 320 50 T 480 20 T 640 40 T 780 15 L 780 110 L 10 110 Z"
                  fill="url(#tensionGrad)"
                />
                {/* Tension Keypoints */}
                <circle cx="160" cy="65" r="4" fill="#22d3ee" />
                <circle cx="320" cy="50" r="4" fill="#a855f7" />
                <circle cx="480" cy="20" r="5" fill="#ef4444" className="animate-ping" />
                <circle cx="780" cy="15" r="5" fill="#10b981" />
              </svg>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--dm-muted)] pt-2 border-t border-[var(--dm-divider)]">
                <span>ACT I: THE SIGNAL INTERCEPT</span>
                <span className="text-amber-400 font-semibold">ACT II: HORIZON DESCENT (CLIMAX)</span>
                <span>ACT III: TRANSMISSION CONVERGENCE</span>
              </div>
            </div>
          </HoloPanel>
        </div>

        {/* Right Col: Film Mode Intelligence Breakdown */}
        <div className="space-y-4">
          <HoloPanel title="FILM MODE METRICS" subtitle="CINEMATIC SPECIFICATIONS">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--dm-divider)]">
                <span className="text-[var(--dm-muted)] font-mono text-[10px]">ASPECT RATIO</span>
                <span className="font-display font-semibold text-[var(--dm-text)]">2.39:1 ANAMORPHIC</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--dm-divider)]">
                <span className="text-[var(--dm-muted)] font-mono text-[10px]">COLOR SPACE</span>
                <span className="font-display font-semibold text-cyan-400">ACEScg / DCI-P3</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--dm-divider)]">
                <span className="text-[var(--dm-muted)] font-mono text-[10px]">AUDIO MIX</span>
                <span className="font-display font-semibold text-purple-400">DOLBY ATMOS 7.1.4</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--dm-divider)]">
                <span className="text-[var(--dm-muted)] font-mono text-[10px]">FRAME RATE</span>
                <span className="font-display font-semibold text-[var(--dm-text)]">24.000 FPS</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--dm-divider)]">
              <GlowButton
                variant="outline"
                size="sm"
                className="w-full"
                icon={<Clapperboard className="w-3.5 h-3.5" />}
                onClick={() => setActiveModule('production')}
              >
                OPEN PRODUCTION PIPELINE
              </GlowButton>
            </div>
          </HoloPanel>

          {/* Quick Scene Breakdown Widget */}
          <HoloPanel title="INGESTED SCENES" subtitle={`${currentProject.scenes.length} SCENES REGISTERED`}>
            <div className="space-y-2">
              {currentProject.scenes.map((sc) => (
                <div key={sc.id} className="p-2 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] text-xs">
                  <div className="flex justify-between font-mono text-[9px] text-amber-400 mb-0.5">
                    <span>SCENE #{sc.sceneNumber}</span>
                    <span>{sc.status.toUpperCase()}</span>
                  </div>
                  <div className="font-display font-semibold text-[var(--dm-text)] truncate">
                    {sc.slugline}
                  </div>
                </div>
              ))}
            </div>
          </HoloPanel>
        </div>
      </div>
    </div>
  );
};
