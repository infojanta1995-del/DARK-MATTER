import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { GlowButton } from '../../components/common/GlowButton';
import { STORY_MODES } from '../../core/initialData';
import { Project } from '../../types';
import { X, Rocket, Cpu, Disc, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProjectCreationModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, initializeNewProject, creationStep } = useApp();
  const { playCockpitBeep } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<Project['contentType']>('Sci-Fi Short Film');
  const [primaryMode, setPrimaryMode] = useState('sci-fi');
  const [secondaryMode, setSecondaryMode] = useState('mystery');
  const [primaryLanguage, setPrimaryLanguage] = useState('English (Galactic Standard)');
  const [targetPlatform, setTargetPlatform] = useState<Project['targetPlatform']>('YouTube 4K');
  const [missionObjective, setMissionObjective] = useState('');

  if (!isCreateProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await initializeNewProject({
      name: name.trim(),
      description: description.trim(),
      contentType,
      primaryMode,
      secondaryMode,
      primaryLanguage,
      targetPlatform,
      missionObjective: missionObjective.trim(),
    });

    // Reset form
    setName('');
    setDescription('');
    setMissionObjective('');
  };

  const primaryModeObj = STORY_MODES.find(m => m.id === primaryMode) || STORY_MODES[0];
  const secondaryModeObj = STORY_MODES.find(m => m.id === secondaryMode) || STORY_MODES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-[var(--dm-border-bright)] bg-[var(--dm-surface-elevated)] shadow-2xl p-5 sm:p-7 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Edge Bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--dm-accent)] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--dm-divider)] pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg border border-[var(--dm-accent-border)] bg-[var(--dm-surface)] text-[var(--dm-accent)]">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[var(--dm-accent)] uppercase tracking-widest">
                // MISSION LAUNCH PROTOCOL
              </span>
              <h2 className="font-display text-lg font-bold text-[var(--dm-text)] uppercase tracking-wider">
                INITIALIZE NEW PROJECT
              </h2>
            </div>
          </div>

          {!creationStep && (
            <button
              onClick={() => {
                playCockpitBeep('click');
                setIsCreateProjectOpen(false);
              }}
              className="p-1.5 rounded-lg border border-[var(--dm-border)] text-[var(--dm-muted)] hover:text-white hover:bg-[var(--dm-surface-hover)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PROGRESS SEQUENCE VIEW (When creation is in progress) */}
        {/* ========================================================================= */}
        {creationStep ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            {/* Spinning Black Hole Gateway Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[var(--dm-accent)] animate-spin-slow flex items-center justify-center shadow-[0_0_30px_var(--dm-accent-soft)]">
                <div className="w-14 h-14 rounded-full border border-[var(--dm-border-bright)] bg-black animate-pulse-energy" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Disc className="w-6 h-6 text-[var(--dm-accent)] animate-spin" />
              </div>
            </div>

            <span className="font-mono text-xs text-[var(--dm-muted)] uppercase tracking-widest mb-2">
              COCKPIT SEQUENCE ACTIVE
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--dm-accent)] uppercase tracking-wider animate-pulse">
              {creationStep}
            </h3>

            {/* Sequence Steps Checklist */}
            <div className="mt-6 w-full max-w-sm space-y-2 text-left text-xs font-mono">
              {[
                'INITIALIZING PROJECT CORE',
                'CREATING PROJECT MEMORY',
                'INITIALIZING STORY SPACE',
                'PREPARING CONTENT PIPELINE',
                'PROJECT READY',
              ].map((step, idx) => {
                const isPassed = creationStep === step || idx < [
                  'INITIALIZING PROJECT CORE',
                  'CREATING PROJECT MEMORY',
                  'INITIALIZING STORY SPACE',
                  'PREPARING CONTENT PIPELINE',
                  'PROJECT READY',
                ].indexOf(creationStep);

                return (
                  <div 
                    key={step}
                    className={`flex items-center justify-between p-2 rounded border transition-all ${
                      creationStep === step
                        ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-white'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                        : 'border-[var(--dm-border)] text-slate-600'
                    }`}
                  >
                    <span>{step}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM VIEW */
          /* ========================================================================= */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                PROJECT / MISSION NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SOLITARY HORIZON, CYGNUS BEACON, VOID CHRONICLES"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] placeholder-slate-600 text-sm font-display focus:border-[var(--dm-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--dm-accent)]"
              />
            </div>

            {/* Description & Objective */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                  BRIEF LOG / PREMISE
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expedition premise and narrative seed..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] placeholder-slate-600 text-xs font-sans focus:border-[var(--dm-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--dm-accent)] resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                  CORE MISSION OBJECTIVE (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={missionObjective}
                  onChange={(e) => setMissionObjective(e.target.value)}
                  placeholder="Goal: Complete script breakdown and scene previsualization..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] placeholder-slate-600 text-xs font-sans focus:border-[var(--dm-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--dm-accent)] resize-none"
                />
              </div>
            </div>

            {/* Content Type & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                  CONTENT FORMAT
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as Project['contentType'])}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] text-xs font-display focus:border-[var(--dm-accent)] focus:outline-none cursor-pointer"
                >
                  <option value="Sci-Fi Short Film">Sci-Fi Short Film</option>
                  <option value="Deep Space Docu-series">Deep Space Docu-series</option>
                  <option value="Interactive Video Essay">Interactive Video Essay</option>
                  <option value="Worldbuilding Audio Drama">Worldbuilding Audio Drama</option>
                  <option value="Cinematic Explainer">Cinematic Explainer</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                  TARGET PLATFORM
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value as Project['targetPlatform'])}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] text-xs font-display focus:border-[var(--dm-accent)] focus:outline-none cursor-pointer"
                >
                  <option value="YouTube 4K">YouTube 4K Cinema</option>
                  <option value="Cinematic Web Stream">Cinematic Web Stream</option>
                  <option value="IMAX Format">IMAX High-Fidelity Aspect</option>
                  <option value="Interactive Engine">Interactive Engine / Game</option>
                  <option value="XR Headset">XR Spatial Audio & Video</option>
                </select>
              </div>
            </div>

            {/* Adaptive Story Mode & Secondary Mode (Mode Fusion) */}
            <div className="p-3.5 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-surface)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[var(--dm-accent)] uppercase tracking-wider font-semibold">
                  STORY MODE FUSION
                </span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[var(--dm-accent-soft)] text-[var(--dm-accent)]">
                  HARMONIC RESONANCE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                    PRIMARY MODE
                  </label>
                  <select
                    value={primaryMode}
                    onChange={(e) => setPrimaryMode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] text-[var(--dm-text)] text-xs font-display focus:border-[var(--dm-accent)] focus:outline-none cursor-pointer"
                  >
                    {STORY_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.name} ({mode.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                    SECONDARY MODE
                  </label>
                  <select
                    value={secondaryMode}
                    onChange={(e) => setSecondaryMode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] text-[var(--dm-text)] text-xs font-display focus:border-[var(--dm-accent)] focus:outline-none cursor-pointer"
                  >
                    {STORY_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.name} ({mode.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Fusion Live Preview Card */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-divider)] text-[11px] text-[var(--dm-text-secondary)]">
                <div className="flex items-center space-x-1.5 font-display text-xs text-[var(--dm-text)] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
                  <span>
                    FUSION: {primaryModeObj.name.toUpperCase()} + {secondaryModeObj.name.toUpperCase()}
                  </span>
                </div>
                <p className="line-clamp-2 text-[10px] text-[var(--dm-muted)]">
                  Atmosphere: {primaryModeObj.atmosphere} fused with {secondaryModeObj.atmosphere.toLowerCase()}.
                </p>
              </div>
            </div>

            {/* Primary Language */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider mb-1">
                SCRIPT & TELEMETRY LANGUAGE
              </label>
              <input
                type="text"
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                placeholder="English (Galactic Standard)"
                className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-[var(--dm-text)] text-xs font-mono focus:border-[var(--dm-accent)] focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-[var(--dm-divider)] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  playCockpitBeep('click');
                  setIsCreateProjectOpen(false);
                }}
                className="px-4 py-2 text-xs font-display uppercase tracking-wider text-[var(--dm-muted)] hover:text-white cursor-pointer"
              >
                CANCEL
              </button>

              <GlowButton
                type="submit"
                variant="primary"
                size="md"
                icon={<Rocket className="w-4 h-4" />}
              >
                INITIALIZE PROJECT
              </GlowButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
