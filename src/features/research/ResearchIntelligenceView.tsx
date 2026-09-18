import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { 
  Radar, 
  Search, 
  TrendingUp, 
  Compass, 
  Target, 
  Zap, 
  Share2, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface TrendTopic {
  id: string;
  topic: string;
  category: string;
  growth: string;
  audienceIntent: string;
  contentGap: string;
  angle: string;
  hook: string;
  suggestedIdea: string;
}

const SAMPLE_TRENDS: TrendTopic[] = [
  {
    id: 't-1',
    topic: 'Relativistic Acoustic Waves in Micro-Black Holes',
    category: 'Astrophysics & Deep Space',
    growth: '+142%',
    audienceIntent: 'Audiences seeking mind-bending existential astrophysics explained through high-end cinematic visuals.',
    contentGap: 'Most creators only cover basic event horizons; zero content visualizes sound propagation through the ergosphere.',
    angle: 'A lone signal operator hearing an ancient acoustic melody refracted from the singularity.',
    hook: '"What if the quietest place in the universe is actually screaming in prime numbers?"',
    suggestedIdea: 'A deep-space audio documentary dramatizing the 1420 MHz Cygnus discovery.',
  },
  {
    id: 't-2',
    topic: 'AI Consciousness Degradation during Hypersleep',
    category: 'Sci-Fi Philosophy',
    growth: '+98%',
    audienceIntent: 'Curiosity regarding synthetic minds experiencing dream states or hallucinations during multi-decade voyages.',
    contentGap: 'General discussion focuses on human madness, skipping the breakdown of shipboard neural architectures.',
    angle: 'The ship AI begins hallucinating memories of crew members who never existed on the manifest.',
    hook: '"In 2188, hypersleep wasn\'t dangerous for the astronauts. It was dangerous for the computer watching them."',
    suggestedIdea: 'Psychological chamber drama between Commander Vance and the IRIS AI core.',
  },
  {
    id: 't-3',
    topic: 'Dark Matter Carrier Waves as Galactic Beacons',
    category: 'Speculative Science',
    growth: '+215%',
    audienceIntent: 'Audiences craving hard sci-fi worldbuilding grounded in real theoretical physics models.',
    contentGap: 'Lack of visual models explaining how dark matter particles could modulate communication across light-years.',
    angle: 'Decoding an impossible interstellar telegraph transmitted through gravitational lensing.',
    hook: '"They told us deep space was empty. Then we tuned into the dark matter band."',
    suggestedIdea: 'A fast-paced investigative thriller revealing classified deep-space communications.',
  },
];

export const ResearchIntelligenceView: React.FC = () => {
  const { currentProject, setActiveModule } = useApp();
  const { playCockpitBeep } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<TrendTopic>(SAMPLE_TRENDS[0]);

  const filteredTrends = SAMPLE_TRENDS.filter(
    (t) =>
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Intelligence Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Radar className="w-4 h-4 animate-spin-slow" />
            <span>// COGNITIVE RESEARCH & AUDIENCE SENSOR ARRAY</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            RESEARCH & TREND INTELLIGENCE TERMINAL
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Scan audience gravity, detect narrative voids, and synthesize high-retention hooks.
          </p>
        </div>

        {/* Search / Sensor Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--dm-accent)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Scan frequencies & topics..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-xs font-display text-[var(--dm-text)] focus:border-[var(--dm-accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 13 VISUAL HIERARCHY CHAIN */}
      {/* TREND -> WHY PEOPLE CARE -> AUDIENCE INTENT -> CONTENT GAP -> ANGLE -> HOOK -> IDEA */}
      {/* ========================================================================= */}
      <HoloPanel
        title="SYNTHESIS LADDER // ACTIVE ANGLE"
        subtitle={`TARGET: ${selectedTrend.topic.toUpperCase()}`}
        glow={true}
        headerRight={
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 font-bold">
            GRAVITY SCORE: {selectedTrend.growth}
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-stretch text-xs">
          {/* Step 1: TREND */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
            <div>
              <div className="font-mono text-[9px] text-[var(--dm-accent)] font-bold mb-1">
                01 // TREND
              </div>
              <p className="font-display font-semibold text-[var(--dm-text)] truncate">{selectedTrend.topic}</p>
            </div>
            <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-2">{selectedTrend.category}</span>
          </div>

          {/* Step 2: WHY PEOPLE CARE */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
            <div className="font-mono text-[9px] text-cyan-400 font-bold mb-1">
              02 // MOTIVATION
            </div>
            <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
              Primal fascination with cosmic anomalies and black hole audio acoustics.
            </p>
          </div>

          {/* Step 3: AUDIENCE INTENT */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
            <div className="font-mono text-[9px] text-indigo-400 font-bold mb-1">
              03 // INTENT
            </div>
            <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
              Seeking cinematic realism and high-concept existential storytelling.
            </p>
          </div>

          {/* Step 4: CONTENT GAP */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
            <div className="font-mono text-[9px] text-amber-400 font-bold mb-1">
              04 // CONTENT GAP
            </div>
            <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
              {selectedTrend.contentGap}
            </p>
          </div>

          {/* Step 5: ANGLE */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
            <div className="font-mono text-[9px] text-purple-400 font-bold mb-1">
              05 // ANGLE
            </div>
            <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
              {selectedTrend.angle}
            </p>
          </div>

          {/* Step 6: HOOK */}
          <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-accent-border)] bg-[var(--dm-accent-soft)] flex flex-col justify-between">
            <div className="font-mono text-[9px] text-[var(--dm-accent)] font-bold mb-1">
              06 // RETENTION HOOK
            </div>
            <p className="text-[11px] font-semibold text-white italic leading-relaxed">
              {selectedTrend.hook}
            </p>
          </div>

          {/* Step 7: IDEA */}
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/50 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[9px] text-emerald-400 font-bold mb-1">
                07 // SCRIPT IDEA
              </div>
              <p className="text-[11px] font-display font-semibold text-emerald-200 leading-relaxed">
                {selectedTrend.suggestedIdea}
              </p>
            </div>
            <button
              onClick={() => {
                playCockpitBeep('engage');
                setActiveModule('story');
              }}
              className="mt-2 text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              SEND TO STORY <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </HoloPanel>

      {/* Grid: Trending Topics Sensor List & Hook Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Trend Sensor List */}
        <div className="lg:col-span-2 space-y-3">
          <HoloPanel title="DETECTED COGNITIVE TRENDS" subtitle="DEEP SPACE DATA STREAMS">
            <div className="space-y-2">
              {filteredTrends.map((trend) => (
                <div
                  key={trend.id}
                  onClick={() => {
                    playCockpitBeep('click');
                    setSelectedTrend(trend);
                  }}
                  className={`
                    p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3
                    ${
                      selectedTrend.id === trend.id
                        ? 'border-[var(--dm-accent)] bg-[var(--dm-surface-elevated)] shadow-[0_0_12px_var(--dm-accent-soft)]'
                        : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                    }
                  `}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase">
                        {trend.category}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                        {trend.growth} VELOCITY
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-[var(--dm-text)]">
                      {trend.topic}
                    </h4>

                    <p className="text-xs text-[var(--dm-text-secondary)] line-clamp-1">
                      {trend.audienceIntent}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    <span className="text-xs font-mono text-[var(--dm-accent)] flex items-center gap-1">
                      ANALYZE <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </HoloPanel>
        </div>

        {/* Right Col: Hook Generator & Quick Idea Dispatch */}
        <div className="space-y-4">
          <HoloPanel title="HOOK ACCELERATOR" subtitle="OPENING 3 SECONDS">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                <span className="font-mono text-[9px] text-[var(--dm-accent)] font-semibold uppercase block mb-1">
                  PATTERN INTERRUPT
                </span>
                <p className="text-[var(--dm-text)] italic font-serif">
                  "If you drop a clock into a black hole, does the universe end before it ticks?"
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block mb-1">
                  CLASSIFIED TELEMETRY
                </span>
                <p className="text-[var(--dm-text)] italic font-serif">
                  "NASA deleted this transmission in 2031. Here is the recovered sound wave."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                <span className="font-mono text-[9px] text-purple-400 font-semibold uppercase block mb-1">
                  PARADOX PROMPT
                </span>
                <p className="text-[var(--dm-text)] italic font-serif">
                  "We thought we were alone in sector 9. Until our own voice answered us."
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--dm-divider)]">
              <GlowButton
                variant="primary"
                size="sm"
                className="w-full"
                icon={<Lightbulb className="w-3.5 h-3.5" />}
                onClick={() => setActiveModule('ideas')}
              >
                GENERATE MORE IDEAS
              </GlowButton>
            </div>
          </HoloPanel>
        </div>
      </div>
    </div>
  );
};
