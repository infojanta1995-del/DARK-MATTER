import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { 
  Rocket, 
  Target, 
  Repeat, 
  BarChart3, 
  Share2, 
  CheckCircle2, 
  ExternalLink,
  Youtube,
  Send,
  Sparkles
} from 'lucide-react';

export const PublishingDistributionView: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'publishing' }) => {
  const { currentProject } = useApp();
  const { playCockpitBeep } = useTheme();

  const [activeTab, setActiveTab] = useState<'publishing' | 'seo' | 'repurpose' | 'analytics'>(
    (initialSubModule as any) || 'publishing'
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<string | null>(null);

  const handlePublishTransmission = () => {
    playCockpitBeep('engage');
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedStatus('TRANSMISSION SUCCESSFUL // BROADCAST LIVE ACROSS ALL CHANNELS');
      playCockpitBeep('pulse');
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Rocket className="w-4 h-4" />
            <span>// TRANSMISSION & GROWTH STATION</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            PUBLISHING, SEO & OMNI-CHANNEL REPURPOSING
          </h1>
        </div>

        {/* Sub-module Switcher */}
        <div className="flex items-center space-x-1.5 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)]">
          {[
            { id: 'publishing', label: 'TRANSMIT', icon: Rocket },
            { id: 'seo', label: 'SEO COGNITION', icon: Target },
            { id: 'repurpose', label: 'REPURPOSE', icon: Repeat },
            { id: 'analytics', label: 'TELEMETRY', icon: BarChart3 },
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

      {publishedStatus && (
        <div className="p-3 rounded-xl border border-emerald-500/60 bg-emerald-950/40 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{publishedStatus}</span>
          </div>
          <button onClick={() => setPublishedStatus(null)} className="text-[10px] text-emerald-400 hover:underline">
            DISMISS
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PUBLISHING LAUNCHPAD */}
      {/* ========================================================================= */}
      {activeTab === 'publishing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <HoloPanel title="BROADCAST CHANNELS" subtitle="CONNECTED RECEPTORS">
              <div className="space-y-3">
                {[
                  { name: 'YouTube 4K Cinema Channel', status: 'ARMED', handle: '@DarkMatterSciFi', icon: Youtube },
                  { name: 'X / Twitter High-Gravity Feed', status: 'ARMED', handle: '@DarkMatterOS', icon: Send },
                  { name: 'Substack Transmission Logs', status: 'ARMED', handle: 'darkmatter.substack.com', icon: Share2 },
                ].map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div key={ch.name} className="p-3.5 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-[var(--dm-accent)]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-[var(--dm-text)]">{ch.name}</h4>
                          <span className="font-mono text-[10px] text-[var(--dm-muted)]">{ch.handle}</span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/40 font-bold">
                        {ch.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </HoloPanel>

            <HoloPanel title="DISPATCH SCHEDULE" subtitle="TIMED TRANSMISSION">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-[var(--dm-accent)] uppercase block mb-1">
                    OPTIMAL DISPATCH WINDOW
                  </span>
                  <p className="text-slate-300">
                    Highest cosmic engagement projected at <strong>18:30 UTC</strong> (Peak audience gravity).
                  </p>
                </div>
                <GlowButton
                  variant="primary"
                  size="md"
                  loading={isPublishing}
                  icon={<Rocket className="w-4 h-4" />}
                  onClick={handlePublishTransmission}
                >
                  BROADCAST NOW
                </GlowButton>
              </div>
            </HoloPanel>
          </div>

          <div>
            <HoloPanel title="PRE-FLIGHT CHECKLIST" subtitle="CONTENT INTEGRITY">
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>4K ProRes Master Render verified</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dolby Atmos stem mix balanced</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subtitles & timecodes synchronized</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Metadata & thumbnail calibrated</span>
                </li>
              </ul>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SEO & METADATA */}
      {/* ========================================================================= */}
      {activeTab === 'seo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HoloPanel title="ALGORITHMIC TITLE CANDIDATES" subtitle="HIGH-GRAVITY SEO">
            <div className="space-y-2 text-xs">
              {[
                { title: 'The Sound Inside Cygnus X-1 Will Break Your Mind', score: '98 / 100' },
                { title: 'We Finally Heard What Lies Behind the Event Horizon', score: '94 / 100' },
                { title: 'Why NASA Decoded the 1420 MHz Radio Ghost', score: '91 / 100' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] flex items-center justify-between">
                  <span className="font-display font-semibold text-white">{item.title}</span>
                  <span className="font-mono text-[10px] text-[var(--dm-accent)] font-bold">{item.score}</span>
                </div>
              ))}
            </div>
          </HoloPanel>

          <HoloPanel title="DISCOVERY KEYWORDS & SEMANTIC TAGS" subtitle="SEARCH VOLUME">
            <div className="flex flex-wrap gap-1.5">
              {[
                '#BlackHoleAcoustics',
                '#CygnusX1',
                '#HardSciFi',
                '#Astrophysics',
                '#EventHorizon',
                '#InterstellarTravel',
                '#DarkMatterOS',
                '#SciFiShortFilm',
                '#DeepSpaceAudio',
              ].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-xs font-mono text-cyan-300">
                  {tag}
                </span>
              ))}
            </div>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OMNI-CHANNEL REPURPOSE */}
      {/* ========================================================================= */}
      {activeTab === 'repurpose' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HoloPanel title="VERTICAL SHORTS / REELS" subtitle="9:16 TIMELINES">
            <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
              Automated 60-second cut focusing purely on the climax of Scene 2.
            </p>
            <GlowButton variant="outline" size="sm" className="w-full">
              GENERATE 3 REELS
            </GlowButton>
          </HoloPanel>

          <HoloPanel title="TWITTER / X THREAD" subtitle="VIRAL BREAKDOWN">
            <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
              10-part scientific deep dive behind the lore of Cygnus X-1.
            </p>
            <GlowButton variant="outline" size="sm" className="w-full">
              EXPORT THREAD FORMAT
            </GlowButton>
          </HoloPanel>

          <HoloPanel title="PODCAST / AUDIO DRAMA" subtitle="AUDIO ONLY">
            <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
              Direct master stems export mixed specifically for headphone spatial audio.
            </p>
            <GlowButton variant="outline" size="sm" className="w-full">
              EXPORT AUDIO DRAMA
            </GlowButton>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIENCE ANALYTICS TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HoloPanel title="TOTAL IMPRESSIONS" subtitle="COSMIC REACH">
            <div className="font-display text-2xl font-bold text-white">418,200</div>
            <span className="font-mono text-[10px] text-emerald-400">+24% VELOCITY</span>
          </HoloPanel>

          <HoloPanel title="AVG WATCH RETENTION" subtitle="GRAVITY METRIC">
            <div className="font-display text-2xl font-bold text-[var(--dm-accent)]">86.4%</div>
            <span className="font-mono text-[10px] text-cyan-400">BENCHMARK: 62%</span>
          </HoloPanel>

          <HoloPanel title="ENGAGEMENT INDEX" subtitle="AUDIENCE RESONANCE">
            <div className="font-display text-2xl font-bold text-purple-400">9.8 / 10</div>
            <span className="font-mono text-[10px] text-purple-300">EXCEPTIONAL</span>
          </HoloPanel>

          <HoloPanel title="SHARED VELOCITY" subtitle="VIRAL RATIO">
            <div className="font-display text-2xl font-bold text-amber-400">14.2%</div>
            <span className="font-mono text-[10px] text-amber-300">+6.1% VS SCI-FI AVG</span>
          </HoloPanel>
        </div>
      )}
    </div>
  );
};
