import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { AnalyticsData } from '../../types';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar
} from 'recharts';
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
  Sparkles,
  Copy,
  Check,
  Download,
  Flame,
  Globe,
  Radio
} from 'lucide-react';

export const PublishingDistributionView: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'publishing' }) => {
  const { currentProject, triggerToast, addAsset } = useApp();
  const { playCockpitBeep } = useTheme();

  const [activeTab, setActiveTab] = useState<'publishing' | 'seo' | 'repurpose' | 'analytics'>(
    (initialSubModule as any) || 'publishing'
  );

  useEffect(() => {
    if (initialSubModule) {
      setActiveTab(initialSubModule as any);
    }
  }, [initialSubModule]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<string | null>(null);

  // Repurpose generation state
  const [repurposedFormat, setRepurposedFormat] = useState<'reels' | 'thread' | 'podcast' | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handlePublishTransmission = () => {
    playCockpitBeep('engage');
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishedStatus('TRANSMISSION SUCCESSFUL // BROADCAST LIVE TO YOUTUBE, X & SUBSTACK');
      playCockpitBeep('pulse');
      triggerToast('success', 'TRANSMISSION LIVE', 'Content package dispatched to all connected distribution receptors.');
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    playCockpitBeep('click');
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    triggerToast('success', 'COPIED TO CLIPBOARD', `${label} formatted text ready to paste.`);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const analytics = {
    impressions: currentProject.analytics?.impressions || 418200,
    views: currentProject.analytics?.estimatedViews || '182,400',
    retentionRate: currentProject.analytics?.projectedRetention || '86.4%',
    engagementScore: currentProject.analytics?.audienceEngagementScore || 9.8,
    ctr: currentProject.analytics?.ctr || '11.8%',
    averageWatchTimeSec: 104,
    retentionCurve: currentProject.analytics?.retentionCurve || [
      { second: 0, percentage: 100 },
      { second: 15, percentage: 94 },
      { second: 30, percentage: 91 },
      { second: 45, percentage: 88 },
      { second: 60, percentage: 86 },
      { second: 75, percentage: 85 },
      { second: 90, percentage: 89 }, // Hook spike at climax
      { second: 105, percentage: 84 },
      { second: 120, percentage: 82 },
    ],
    platformBreakdown: currentProject.analytics?.platformBreakdown || [
      { platform: 'YouTube 4K', views: 98500, share: 54 },
      { platform: 'X Video', views: 54200, share: 30 },
      { platform: 'Substack', views: 29700, share: 16 },
    ],
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Rocket className="w-4 h-4" />
            <span>// TRANSMISSION, SEO & AUDIENCE TELEMETRY</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            PUBLISHING & OMNI-CHANNEL DISTRIBUTION
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Broadcast multi-platform master packages, optimize SEO gravity scores, repurpose into micro-content, and analyze retention curves.
          </p>
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
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrent
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
          <button onClick={() => setPublishedStatus(null)} className="text-[10px] text-emerald-400 hover:underline cursor-pointer">
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
                  { name: 'YouTube 4K Cinema Channel', status: 'ARMED', handle: '@DarkMatterSciFi', icon: Youtube, audience: '142K Subscribed' },
                  { name: 'X / Twitter High-Gravity Feed', status: 'ARMED', handle: '@DarkMatterOS', icon: Send, audience: '89K Followers' },
                  { name: 'Substack Transmission Logs', status: 'ARMED', handle: 'darkmatter.substack.com', icon: Share2, audience: '24K Readers' },
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
                          <span className="font-mono text-[10px] text-[var(--dm-muted)]">{ch.handle} // {ch.audience}</span>
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
                    Highest cosmic engagement projected at <strong>18:30 UTC</strong> (Peak global audience gravity).
                  </p>
                </div>
                <GlowButton
                  variant="primary"
                  size="md"
                  loading={isPublishing}
                  icon={<Rocket className="w-4 h-4" />}
                  onClick={handlePublishTransmission}
                >
                  BROADCAST MASTER PACKAGE NOW
                </GlowButton>
              </div>
            </HoloPanel>
          </div>

          <div>
            <HoloPanel title="PRE-FLIGHT CHECKLIST" subtitle="CONTENT INTEGRITY">
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>4K ProRes Master Render verified</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Stem mix & audio frequency aligned</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Subtitles & timecodes (.SRT) packaged</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>A/B high-gravity thumbnail selected</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Search engine semantic tags calibrated</span>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HoloPanel title="ALGORITHMIC TITLE CANDIDATES" subtitle="HIGH-GRAVITY SEO">
              <div className="space-y-2 text-xs">
                {[
                  { title: 'The Sound Inside Cygnus X-1 Will Break Your Mind', score: '98 / 100', estCtr: '12.4%' },
                  { title: 'We Finally Decoded What Lies Behind the Event Horizon', score: '94 / 100', estCtr: '11.1%' },
                  { title: 'Why NASA Logged the 1420 MHz Radio Ghost in Silence', score: '91 / 100', estCtr: '10.5%' },
                  { title: 'The Relativistic Acoustic Anomaly: Solved', score: '88 / 100', estCtr: '9.2%' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] flex items-center justify-between hover:border-cyan-500/50 transition-colors"
                  >
                    <div>
                      <span className="font-display font-semibold text-white block">{item.title}</span>
                      <span className="font-mono text-[9px] text-[var(--dm-muted)]">EST. CTR: {item.estCtr}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-[var(--dm-accent)] font-bold">{item.score}</span>
                      <button
                        onClick={() => copyToClipboard(item.title, `Title candidate ${idx + 1}`)}
                        className="p-1 hover:text-white text-slate-400 cursor-pointer"
                        title="Copy Title"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </HoloPanel>

            <HoloPanel title="DISCOVERY KEYWORDS & SEMANTIC TAGS" subtitle="SEARCH VOLUME & COGNITION">
              <div className="space-y-3">
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
                    '#QuantumSingularity',
                  ].map((tag) => (
                    <span
                      key={tag}
                      onClick={() => copyToClipboard(tag, tag)}
                      className="px-2.5 py-1 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-xs font-mono text-cyan-300 hover:border-cyan-400 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-[var(--dm-divider)] flex justify-end">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        '#BlackHoleAcoustics #CygnusX1 #HardSciFi #Astrophysics #EventHorizon #InterstellarTravel #DarkMatterOS #DeepSpaceAudio',
                        'All Hashtags'
                      )
                    }
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> COPY ALL 10 METADATA TAGS
                  </button>
                </div>
              </div>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OMNI-CHANNEL REPURPOSE */}
      {/* ========================================================================= */}
      {activeTab === 'repurpose' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <HoloPanel title="VERTICAL SHORTS / REELS" subtitle="9:16 TIMELINES">
              <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
                Automated 60-second vertical cut emphasizing the high-tension event horizon dive in Scene 2.
              </p>
              <GlowButton
                variant={repurposedFormat === 'reels' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => {
                  playCockpitBeep('click');
                  setRepurposedFormat('reels');
                }}
              >
                {repurposedFormat === 'reels' ? 'REEL SCRIPT LOADED' : 'VIEW REELS CUT'}
              </GlowButton>
            </HoloPanel>

            <HoloPanel title="TWITTER / X THREAD" subtitle="VIRAL BREAKDOWN">
              <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
                8-part astrophysics narrative detailing the acoustic signal decoded from Cygnus X-1.
              </p>
              <GlowButton
                variant={repurposedFormat === 'thread' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => {
                  playCockpitBeep('click');
                  setRepurposedFormat('thread');
                }}
              >
                {repurposedFormat === 'thread' ? 'THREAD LOADED' : 'VIEW THREAD SCRIPT'}
              </GlowButton>
            </HoloPanel>

            <HoloPanel title="PODCAST / AUDIO DRAMA" subtitle="BINAURAL AUDIO FORMAT">
              <p className="text-xs text-[var(--dm-text-secondary)] mb-3">
                Isolated vocal stems with spatial audio cues formatted specifically for episodic RSS distribution.
              </p>
              <GlowButton
                variant={repurposedFormat === 'podcast' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => {
                  playCockpitBeep('click');
                  setRepurposedFormat('podcast');
                }}
              >
                {repurposedFormat === 'podcast' ? 'PODCAST LOADED' : 'VIEW AUDIO DRAMA'}
              </GlowButton>
            </HoloPanel>
          </div>

          {/* Expanded Repurposed Content Viewer */}
          {repurposedFormat === 'reels' && (
            <HoloPanel
              title="VERTICAL REEL SCRIPT (60s FAST PACING)"
              subtitle="HOOK + RETENTION SPIKE + CALL TO ACTION"
              headerRight={
                <GlowButton
                  size="sm"
                  variant="primary"
                  icon={<Copy className="w-3 h-3" />}
                  onClick={() =>
                    copyToClipboard(
                      '[0-3s HOOK]: What you are hearing right now is an acoustic sound wave from Cygnus X-1.\n[3-15s SETUP]: At 1420 MHz, black holes do not emit sound—matter does.\n[15-45s CLIMAX]: Commander Vance crossed the ergosphere protocol. The frequency repeated in primes.\n[45-60s OUTRO]: Watch the full 4K film on DARK MATTER now.',
                      'Reels Script'
                    )
                  }
                >
                  COPY REEL SCRIPT
                </GlowButton>
              }
            >
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40 font-mono text-xs text-slate-200 space-y-2">
                <p><span className="text-cyan-400 font-bold">[0-3s HOOK]:</span> What you are hearing right now is an acoustic sound wave from Cygnus X-1.</p>
                <p><span className="text-cyan-400 font-bold">[3-15s SETUP]:</span> At 1420 MHz, space is supposedly silent. But within the ergosphere, tidal compression produces resonance.</p>
                <p><span className="text-cyan-400 font-bold">[15-45s CLIMAX]:</span> Commander Vance crossed the boundary. The ship's AI hallucinated memories. And the wave wasn't noise—it was prime numbers.</p>
                <p><span className="text-cyan-400 font-bold">[45-60s OUTRO]:</span> The full master cut is live on Dark Matter. Link in bio.</p>
              </div>
            </HoloPanel>
          )}

          {repurposedFormat === 'thread' && (
            <HoloPanel
              title="X / TWITTER VIRAL THREAD DRAFT"
              subtitle="8 POSTS OPTIMIZED FOR RETWEET VELOCITY"
              headerRight={
                <GlowButton
                  size="sm"
                  variant="primary"
                  icon={<Copy className="w-3 h-3" />}
                  onClick={() =>
                    copyToClipboard(
                      '1/8 We spent 6 months building a hard sci-fi film around one terrifying premise: what if a black hole broadcasted prime numbers?\n\n2/8 Cygnus X-1 was discovered in 1964. It is 6,000 light-years away.\n\n3/8 In our script, the research vessel Aethelgard enters the ergosphere—the region where spacetime itself is dragged.\n\n4/8 All sound effects in our film were synthesized from real mathematical wave equations.',
                      'Twitter Thread'
                    )
                  }
                >
                  COPY THREAD
                </GlowButton>
              }
            >
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40 font-mono text-xs text-slate-200 space-y-2">
                <p><span className="text-cyan-400 font-bold">1/8:</span> We spent 6 months building a hard sci-fi film around one terrifying premise: what if a black hole broadcasted prime numbers?</p>
                <p><span className="text-cyan-400 font-bold">2/8:</span> Cygnus X-1 was discovered in 1964. It is 6,000 light-years away. But its relativistic jet travels at 98% of light speed.</p>
                <p><span className="text-cyan-400 font-bold">3/8:</span> In our screenplay, the research vessel Aethelgard enters the ergosphere—the region where spacetime itself is dragged.</p>
                <p><span className="text-cyan-400 font-bold">4/8:</span> Full 4K film and multi-track audio now streaming on the DARK MATTER Command Station.</p>
              </div>
            </HoloPanel>
          )}

          {repurposedFormat === 'podcast' && (
            <HoloPanel
              title="AUDIO DRAMA SYNOPSIS & SHOWNOTES"
              subtitle="RSS FEED XML METADATA & CHAPTER TIMESTAMPS"
              headerRight={
                <GlowButton
                  size="sm"
                  variant="primary"
                  icon={<Copy className="w-3 h-3" />}
                  onClick={() =>
                    copyToClipboard(
                      'EPISODE 01: THE FREQUENCY AT CYGNUS X-1\nRuntime: 18:24\nAudio: Binaural 3D Master\n\nChapter Markers:\n00:00 - Introduction & Telemetry Log\n04:15 - Crossing the Ergosphere\n12:30 - The Prime Anomaly\n16:45 - Singularity Communion',
                      'Audio Drama Shownotes'
                    )
                  }
                >
                  COPY SHOWNOTES
                </GlowButton>
              }
            >
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40 font-mono text-xs text-slate-200 space-y-2">
                <p className="text-cyan-400 font-bold">EPISODE 01: THE FREQUENCY AT CYGNUS X-1</p>
                <p className="text-slate-300">Format: Binaural 3D Headphone Experience</p>
                <p className="text-slate-400">Chapters: 00:00 Introduction // 04:15 Ergosphere // 12:30 The Prime Anomaly // 16:45 Climax</p>
              </div>
            </HoloPanel>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIENCE ANALYTICS TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <HoloPanel title="TOTAL IMPRESSIONS" subtitle="COSMIC REACH">
              <div className="font-display text-2xl font-bold text-white">
                {analytics.impressions.toLocaleString()}
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">+24% VELOCITY</span>
            </HoloPanel>

            <HoloPanel title="AVG WATCH RETENTION" subtitle="GRAVITY METRIC">
              <div className="font-display text-2xl font-bold text-[var(--dm-accent)]">
                {analytics.retentionRate.toString().includes('%') ? analytics.retentionRate : `${analytics.retentionRate}%`}
              </div>
              <span className="font-mono text-[10px] text-cyan-400">BENCHMARK: 62%</span>
            </HoloPanel>

            <HoloPanel title="CLICK-THROUGH (CTR)" subtitle="THUMBNAIL GRAVITY">
              <div className="font-display text-2xl font-bold text-purple-400">
                {analytics.ctr.toString().includes('%') ? analytics.ctr : `${analytics.ctr}%`}
              </div>
              <span className="font-mono text-[10px] text-purple-300 font-bold">+4.2% ABOVE AVG</span>
            </HoloPanel>

            <HoloPanel title="ENGAGEMENT INDEX" subtitle="AUDIENCE RESONANCE">
              <div className="font-display text-2xl font-bold text-amber-400">
                {analytics.engagementScore} / 10
              </div>
              <span className="font-mono text-[10px] text-amber-300">OUTSTANDING</span>
            </HoloPanel>
          </div>

          {/* Retention Curve Chart */}
          <HoloPanel
            title="AUDIENCE RETENTION PROFILE (0 - 120 SECONDS)"
            subtitle="SECOND-BY-SECOND DROP-OFF AND ENGAGEMENT RESURGENCE"
            headerRight={
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                HOOK RETENTION: 94% AT 15s
              </span>
            }
          >
            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.retentionCurve}>
                  <defs>
                    <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="second" stroke="#475569" fontSize={10} tickLine={false} unit="s" />
                  <YAxis stroke="#475569" fontSize={10} domain={[60, 100]} tickLine={false} unit="%" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#10b981', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}% Viewers`, 'Retention']}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#retentionGrad)"
                    dot={{ r: 4, fill: '#10b981', stroke: '#020617', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </HoloPanel>
        </div>
      )}
    </div>
  );
};
