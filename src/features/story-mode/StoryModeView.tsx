import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { STORY_MODES } from '../../core/initialData';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { Sparkles, SlidersHorizontal, Check, Zap, Layers, Compass } from 'lucide-react';

export const StoryModeView: React.FC = () => {
  const { currentProject, setStoryModes } = useApp();
  const { playCockpitBeep } = useTheme();

  const [selectedPrimary, setSelectedPrimary] = useState(currentProject.primaryMode);
  const [selectedSecondary, setSelectedSecondary] = useState(currentProject.secondaryMode);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Genre', 'Narrative', 'Informational', 'Cinematic'];

  const filteredModes = filterCategory === 'ALL'
    ? STORY_MODES
    : STORY_MODES.filter((m) => m.category === filterCategory);

  const primaryObj = STORY_MODES.find((m) => m.id === selectedPrimary) || STORY_MODES[0];
  const secondaryObj = STORY_MODES.find((m) => m.id === selectedSecondary) || STORY_MODES[1];

  const handleApplyFusion = () => {
    playCockpitBeep('engage');
    setStoryModes(selectedPrimary, selectedSecondary);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <SlidersHorizontal className="w-4 h-4" />
            <span>// ADAPTIVE STORY MATRIX</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            STORY MODE & MULTI-HARMONIC FUSION
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Calibrate the emotional gravity, narrative pacing, and cosmic tone for <strong className="text-white">{currentProject.name}</strong>.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="md"
          icon={<Zap className="w-4 h-4" />}
          onClick={handleApplyFusion}
        >
          APPLY MODE FUSION
        </GlowButton>
      </div>

      {/* ========================================================================= */}
      {/* MODE FUSION RADAR / SUMMARY BAR */}
      {/* ========================================================================= */}
      <HoloPanel
        title="MODE FUSION ENGINE"
        subtitle="DYNAMIC RECOMBINANT NARRATIVE"
        glow={true}
        headerRight={
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[var(--dm-accent-soft)] text-[var(--dm-accent)] border border-[var(--dm-accent-border)] font-bold">
            FUSION SYNERGY: 96%
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Primary Pillar */}
          <div className="p-3.5 rounded-xl border border-[var(--dm-accent-border)] bg-[var(--dm-surface-elevated)] space-y-1">
            <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase tracking-wider font-semibold">
              PRIMARY MODE (60% WEIGHT)
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--dm-text)] uppercase">
              {primaryObj.name}
            </h3>
            <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed">
              {primaryObj.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-1">
              {primaryObj.tags.map((t: string) => (
                <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--dm-surface)] text-[var(--dm-muted)] border border-[var(--dm-border)]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Fusion Bridge Metaphor */}
          <div className="text-center p-3 rounded-xl border border-dashed border-[var(--dm-border-bright)] bg-[var(--dm-surface)] space-y-2">
            <div className="flex items-center justify-center space-x-2 text-[var(--dm-accent)]">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-display text-sm font-bold uppercase tracking-wider">
                SYNTHESIS MATRIX
              </span>
            </div>
            <p className="text-xs text-[var(--dm-text)] font-semibold">
              {primaryObj.name.toUpperCase()} × {secondaryObj.name.toUpperCase()}
            </p>
            <div className="text-[11px] text-[var(--dm-text-secondary)] space-y-1 leading-snug">
              <div><strong className="text-[var(--dm-muted)] font-mono text-[10px]">PACING:</strong> {primaryObj.pacing}</div>
              <div><strong className="text-[var(--dm-muted)] font-mono text-[10px]">TONE:</strong> {primaryObj.targetTone} + {secondaryObj.targetTone}</div>
            </div>
          </div>

          {/* Secondary Pillar */}
          <div className="p-3.5 rounded-xl border border-purple-500/40 bg-[var(--dm-surface-elevated)] space-y-1">
            <span className="font-mono text-[9px] text-purple-400 uppercase tracking-wider font-semibold">
              SECONDARY MODE (40% WEIGHT)
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--dm-text)] uppercase">
              {secondaryObj.name}
            </h3>
            <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed">
              {secondaryObj.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-1">
              {secondaryObj.tags.map((t: string) => (
                <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--dm-surface)] text-[var(--dm-muted)] border border-[var(--dm-border)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </HoloPanel>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="font-mono text-[10px] text-[var(--dm-muted)] uppercase shrink-0">
          FILTER ARCHETYPE:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 text-xs font-display uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              filterCategory === cat
                ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-white font-semibold'
                : 'border-[var(--dm-border)] text-[var(--dm-text-secondary)] hover:text-white hover:bg-[var(--dm-surface-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 28+ MODES GRID SELECTOR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredModes.map((mode) => {
          const isPrimary = selectedPrimary === mode.id;
          const isSecondary = selectedSecondary === mode.id;

          return (
            <div
              key={mode.id}
              className={`
                relative p-4 rounded-xl border transition-all flex flex-col justify-between select-none
                ${
                  isPrimary
                    ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] shadow-[0_0_16px_var(--dm-accent-soft)]'
                    : isSecondary
                    ? 'border-purple-500/60 bg-purple-950/20 shadow-[0_0_14px_rgba(168,85,247,0.25)]'
                    : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:border-[var(--dm-border-bright)] hover:bg-[var(--dm-surface-elevated)]'
                }
              `}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--dm-surface-elevated)] border border-[var(--dm-divider)] text-[var(--dm-muted)] uppercase">
                    {mode.category}
                  </span>

                  <div className="flex items-center space-x-1">
                    {isPrimary && (
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[var(--dm-accent)] text-black font-bold uppercase">
                        PRIMARY
                      </span>
                    )}
                    {isSecondary && (
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-purple-500 text-black font-bold uppercase">
                        SECONDARY
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-display text-sm font-bold text-[var(--dm-text)] uppercase tracking-wide">
                  {mode.name}
                </h4>

                <p className="text-xs text-[var(--dm-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  {mode.description}
                </p>

                <div className="mt-2 text-[10px] text-[var(--dm-muted)] font-mono">
                  <span>ATMOSPHERE: </span>
                  <span className="text-slate-300">{mode.atmosphere}</span>
                </div>
              </div>

              {/* Selection Control Buttons */}
              <div className="pt-3 border-t border-[var(--dm-divider)] mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    playCockpitBeep('click');
                    setSelectedPrimary(mode.id);
                  }}
                  className={`flex-1 py-1 px-2 text-[10px] font-display uppercase tracking-wider rounded border transition-all cursor-pointer ${
                    isPrimary
                      ? 'border-[var(--dm-accent)] bg-[var(--dm-accent)] text-black font-bold'
                      : 'border-[var(--dm-border)] text-[var(--dm-text-secondary)] hover:text-white hover:border-[var(--dm-accent-border)]'
                  }`}
                >
                  SET PRIMARY
                </button>

                <button
                  onClick={() => {
                    playCockpitBeep('click');
                    setSelectedSecondary(mode.id);
                  }}
                  className={`flex-1 py-1 px-2 text-[10px] font-display uppercase tracking-wider rounded border transition-all cursor-pointer ${
                    isSecondary
                      ? 'border-purple-400 bg-purple-500 text-black font-bold'
                      : 'border-[var(--dm-border)] text-[var(--dm-text-secondary)] hover:text-white hover:border-purple-400'
                  }`}
                >
                  SET SECONDARY
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
