import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { 
  Mic, 
  Headphones, 
  Subtitles, 
  MonitorPlay, 
  Image as ImageIcon, 
  Play, 
  Volume2, 
  Sliders, 
  Sparkles,
  Layers,
  Download
} from 'lucide-react';

export const VoiceAudioStudio: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'voice' }) => {
  const { currentProject } = useApp();
  const { playCockpitBeep } = useTheme();

  const [activeTab, setActiveTab] = useState<'voice' | 'audio' | 'captions' | 'video' | 'thumbnail'>(
    (initialSubModule as any) || 'voice'
  );

  // Synthesizer State
  const [pitch, setPitch] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [reverb, setReverb] = useState(65);
  const [selectedVoice, setSelectedVoice] = useState('Elena Vance (Calm Operator)');
  const [testSpeechText, setTestSpeechText] = useState(
    'Station Log 4120. All telemetry indicates we have stabilized orbital decay around Cygnus X-1.'
  );

  return (
    <div className="space-y-5">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Headphones className="w-4 h-4" />
            <span>// ACOUSTIC & OPTICAL SYNTHESIZER</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            VOICE, SOUNDTRACK & OPTICAL ENGINE
          </h1>
        </div>

        {/* Sub-module Switcher */}
        <div className="flex items-center space-x-1.5 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)]">
          {[
            { id: 'voice', label: 'VOICE SYNTH', icon: Mic },
            { id: 'audio', label: 'SOUNDTRACK', icon: Headphones },
            { id: 'captions', label: 'CAPTIONS', icon: Subtitles },
            { id: 'video', label: 'RENDER', icon: MonitorPlay },
            { id: 'thumbnail', label: 'THUMBNAIL', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--dm-accent)] text-black font-bold shadow-[0_0_12px_var(--dm-accent-soft)]'
                    : 'text-[var(--dm-text-secondary)] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VOICE SYNTHESIZER */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <HoloPanel title="SPEECH GENERATOR" subtitle="NEURAL TIMBRE ENGINE">
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={testSpeechText}
                  onChange={(e) => setTestSpeechText(e.target.value)}
                  placeholder="Dialogue script to synthesize into character voiceprint..."
                  className="w-full p-3.5 rounded-xl border border-[var(--dm-border)] bg-black/60 text-slate-100 font-mono text-xs leading-relaxed focus:border-[var(--dm-accent)] focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-[var(--dm-accent)]" />
                    <span className="font-mono text-xs text-[var(--dm-muted)]">
                      PREVIEW SAMPLE // 00:04.2s
                    </span>
                  </div>

                  <GlowButton
                    variant="primary"
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    onClick={() => playCockpitBeep('engage')}
                  >
                    SYNTHESIZE VOICEPRINT
                  </GlowButton>
                </div>
              </div>
            </HoloPanel>

            {/* Simulated Live Audio Spectrum Monitor */}
            <HoloPanel title="SPECTRAL ACOUSTIC FREQUENCY" subtitle="FORMANT FILTERING">
              <div className="h-28 bg-black rounded-xl border border-[var(--dm-border)] p-3 flex items-end justify-between gap-1">
                {[30, 45, 60, 85, 95, 75, 50, 65, 80, 40, 30, 60, 90, 100, 70, 55, 45, 80, 65, 40, 25].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${val}%` }}
                      className="flex-1 bg-gradient-to-t from-[var(--dm-accent)] to-cyan-400 rounded-t-sm opacity-80"
                    />
                  )
                )}
              </div>
            </HoloPanel>
          </div>

          {/* Voice Controls Column */}
          <div className="space-y-4">
            <HoloPanel title="BIOMETRIC PROFILES" subtitle="CHARACTER TIMBRE">
              <div className="space-y-2">
                {['Elena Vance (Calm Operator)', 'IRIS Synthetic AI Core', 'Dr. Aris Thorne (Exo-physicist)'].map(
                  (voice) => (
                    <button
                      key={voice}
                      onClick={() => {
                        playCockpitBeep('click');
                        setSelectedVoice(voice);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedVoice === voice
                          ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-white font-semibold'
                          : 'border-[var(--dm-border)] bg-[var(--dm-surface)] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-display truncate">{voice}</div>
                    </button>
                  )
                )}
              </div>

              {/* Parametric Sliders */}
              <div className="mt-4 pt-3 border-t border-[var(--dm-divider)] space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                    <span>PITCH MODULATION</span>
                    <span>{pitch} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full accent-[var(--dm-accent)] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                    <span>CADENCE VELOCITY</span>
                    <span>{speed} WPM</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-[var(--dm-accent)] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                    <span>COCKPIT REVERB</span>
                    <span>{reverb}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverb}
                    onChange={(e) => setReverb(Number(e.target.value))}
                    className="w-full accent-[var(--dm-accent)] cursor-pointer"
                  />
                </div>
              </div>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOUNDTRACK GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HoloPanel title="COSMIC ATMOSPHERE SUITE" subtitle="AMBIENT STEMS">
            <div className="space-y-3 text-xs">
              {[
                { name: 'Singularity Sub-Bass Pulse', key: 'D Minor', bpm: '60 BPM', mood: 'Existential' },
                { name: 'Ergosphere Shimmer Drone', key: 'A Minor', bpm: 'Ambient', mood: 'Mysterious' },
                { name: 'Cryogenic Chamber Chimes', key: 'F# Major', bpm: '72 BPM', mood: 'Ethereal' },
              ].map((stem) => (
                <div key={stem.name} className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-[var(--dm-text)]">{stem.name}</h4>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                      {stem.key} // {stem.bpm} // {stem.mood}
                    </span>
                  </div>
                  <GlowButton size="sm" variant="secondary" icon={<Play className="w-3 h-3 fill-current" />}>
                    AUDITION
                  </GlowButton>
                </div>
              ))}
            </div>
          </HoloPanel>

          <HoloPanel title="DYNAMIC CUE COMPOSER" subtitle="TENSION ALIGNED WITH SCENES">
            <div className="p-4 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-3 text-xs">
              <p className="text-[var(--dm-text-secondary)] leading-relaxed">
                Soundtrack tension automatically locks to the Scene 1 & 2 screenplay tension curve.
              </p>
              <div className="p-3 rounded-lg bg-black font-mono text-[10px] text-cyan-400 border border-[var(--dm-border)]">
                &gt; TENSION CADENCE: SCENE #01 INTRO (LOW) -&gt; SCENE #02 DESCENT (CLIMAX 94 dB)
              </div>
              <GlowButton variant="primary" size="sm" className="w-full">
                GENERATE SCENE-ALIGNED SCORE
              </GlowButton>
            </div>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAPTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'captions' && (
        <HoloPanel title="KINETIC SUBTITLE & TIMECODE EDITOR" subtitle="SYNCHRONIZATION MATRIX">
          <div className="space-y-3 text-xs font-mono">
            {[
              { tc: '00:00:02.100 --> 00:00:05.400', speaker: 'ELENA', text: 'Telemetry stabilized. We are riding the edge of the ergosphere.' },
              { tc: '00:00:05.800 --> 00:00:09.120', speaker: 'IRIS', text: 'Radiation pressure exceeding standard tolerances by 14 percent.' },
              { tc: '00:00:09.600 --> 00:00:13.200', speaker: 'THORNE', text: 'Listen to the frequency modulation. That is not background cosmic noise.' },
            ].map((cap, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-amber-400 font-bold mr-2">[{cap.speaker}]</span>
                  <span className="text-slate-200">{cap.text}</span>
                </div>
                <span className="text-[10px] text-[var(--dm-muted)] shrink-0">{cap.tc}</span>
              </div>
            ))}
          </div>
        </HoloPanel>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VIDEO RENDER MONITOR */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <HoloPanel title="MASTER RENDER MONITOR" subtitle="4K PRORES 4444 XQ">
              <div className="relative aspect-video w-full rounded-xl bg-black border border-[var(--dm-border)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-black to-purple-950/40" />
                <div className="relative z-10 text-center space-y-2">
                  <MonitorPlay className="w-12 h-12 text-[var(--dm-accent)] mx-auto opacity-70 animate-pulse" />
                  <span className="font-mono text-xs text-white block uppercase tracking-widest">
                    OPTICAL PREVIEW // READY FOR RENDER
                  </span>
                  <span className="font-mono text-[10px] text-[var(--dm-muted)]">
                    3840 × 2160 // 24 FPS // ACEScg
                  </span>
                </div>
              </div>
            </HoloPanel>
          </div>

          <div>
            <HoloPanel title="EXPORT MANIFEST" subtitle="RENDER PARAMETERS">
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                  <span className="text-[var(--dm-muted)]">CODEC</span>
                  <span className="text-white">ProRes 4444 XQ</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                  <span className="text-[var(--dm-muted)]">BITRATE</span>
                  <span className="text-white">High (Lossless)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                  <span className="text-[var(--dm-muted)]">EST. SIZE</span>
                  <span className="text-cyan-400">1.82 GB</span>
                </div>
                <GlowButton variant="primary" size="md" className="w-full mt-4" icon={<Download className="w-4 h-4" />}>
                  COMMENCE RENDER
                </GlowButton>
              </div>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: THUMBNAIL COMPOSITOR */}
      {/* ========================================================================= */}
      {activeTab === 'thumbnail' && (
        <HoloPanel title="HIGH-GRAVITY THUMBNAIL COMPOSITOR" subtitle="YOUTUBE 4K / STREAM HERO">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="aspect-video w-full rounded-xl bg-black border-2 border-[var(--dm-accent)] relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-black to-cyan-900/60" />
              <div className="relative z-10 text-center">
                <h2 className="font-display text-2xl font-extrabold text-white tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  DO NOT ENTER THE HORIZON
                </h2>
                <div className="mt-2 inline-block font-mono text-xs px-2.5 py-1 rounded bg-red-600 text-white font-bold uppercase tracking-widest shadow-lg">
                  CYGNUS X-1 CLASSIFIED
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-mono text-[10px] text-[var(--dm-accent)] uppercase font-bold block">
                CLICK-THROUGH RATE PREDICTION
              </span>
              <p className="text-[var(--dm-text-secondary)] leading-relaxed">
                Contrast score passes 98.4%. Focal black hole halo maximizes mobile thumbnail legibility.
              </p>
              <GlowButton variant="secondary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                GENERATE ALTERNATIVE A/B VARIANT
              </GlowButton>
            </div>
          </div>
        </HoloPanel>
      )}
    </div>
  );
};
