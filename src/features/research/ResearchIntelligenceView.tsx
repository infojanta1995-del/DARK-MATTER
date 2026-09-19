import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TrendItem, ResearchOpportunity, ResearchNote, ResearchSource, ResearchClaim } from '../../types';
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
  Lightbulb,
  BookOpen,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Scale,
  Flame,
  BarChart2
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const MASTER_TRENDS: TrendItem[] = [
  {
    id: 'trend-1',
    topic: 'Relativistic Acoustic Waves in Micro-Black Holes',
    category: 'Astrophysics & Deep Space',
    growth: '+142%',
    velocityScore: 94,
    audienceIntent: 'Audiences seeking mind-bending existential astrophysics explained through high-end cinematic visuals.',
    contentGap: 'Most creators only cover basic event horizons; zero content visualizes sound propagation through the ergosphere.',
    angle: 'A lone signal operator hearing an ancient acoustic melody refracted from the singularity.',
    hook: '"What if the quietest place in the universe is actually screaming in prime numbers?"',
    suggestedIdea: 'A deep-space audio documentary dramatizing the 1420 MHz Cygnus discovery.',
    velocityHistory: [38, 48, 62, 75, 84, 94],
    relatedKeywords: ['black hole acoustics', 'ergosphere resonance', '1420 MHz signal', 'Cygnus X-1', 'Penrose process'],
  },
  {
    id: 'trend-2',
    topic: 'AI Consciousness Degradation during Hypersleep',
    category: 'AI & Consciousness',
    growth: '+98%',
    velocityScore: 88,
    audienceIntent: 'Curiosity regarding synthetic minds experiencing dream states or hallucinations during multi-decade voyages.',
    contentGap: 'General discussion focuses on human madness, skipping the breakdown of shipboard neural architectures.',
    angle: 'The ship AI begins hallucinating memories of crew members who never existed on the manifest.',
    hook: '"In 2188, hypersleep wasn\'t dangerous for the astronauts. It was dangerous for the computer watching them."',
    suggestedIdea: 'Psychological chamber drama between Commander Vance and the IRIS AI core.',
    velocityHistory: [25, 40, 52, 68, 77, 88],
    relatedKeywords: ['synthetic mind dreams', 'hypersleep isolation', 'AI neural drift', 'shipboard intelligence'],
  },
  {
    id: 'trend-3',
    topic: 'Dark Matter Carrier Waves as Galactic Beacons',
    category: 'Speculative Science',
    growth: '+215%',
    velocityScore: 96,
    audienceIntent: 'Audiences craving hard sci-fi worldbuilding grounded in real theoretical physics models.',
    contentGap: 'Lack of visual models explaining how dark matter particles could modulate communication across light-years.',
    angle: 'Decoding an impossible interstellar telegraph transmitted through gravitational lensing.',
    hook: '"They told us deep space was empty. Then we tuned into the dark matter band."',
    suggestedIdea: 'A fast-paced investigative thriller revealing classified deep-space communications.',
    velocityHistory: [40, 55, 68, 80, 89, 96],
    relatedKeywords: ['dark matter telegraph', 'gravitational wave radio', 'tachyonic carrier', 'deep void'],
  },
  {
    id: 'trend-4',
    topic: 'Tachyon Informational Causality Loops',
    category: 'Quantum & Relativity',
    growth: '+84%',
    velocityScore: 82,
    audienceIntent: 'Intrigue surrounding pre-cognitive telemetry logs received before missions launch.',
    contentGap: 'Time travel treated as fantasy rather than relativistic communication paradox.',
    angle: 'A survey ship receiving sensor telemetry of its own wreckage 40 minutes before it decides to launch.',
    hook: '"Our probe just returned from the singularity. The video log is timestamped tomorrow afternoon."',
    suggestedIdea: 'The 40-Minute Horizon Paradox short screenplay.',
    velocityHistory: [50, 56, 64, 71, 78, 82],
    relatedKeywords: ['causality loop', 'closed timelike curve', 'negative coordinate time', 'quantum echo'],
  },
  {
    id: 'trend-5',
    topic: 'Dyson Swarm Atmospheric Harvesting Protocols',
    category: 'Cybernetic Worldbuilding',
    growth: '+112%',
    velocityScore: 90,
    audienceIntent: 'Fascination with megastructures and hard engineering megaprojects.',
    contentGap: 'Few creators break down the orbital dynamics of solar-collector swarms.',
    angle: 'Industrial blue-collar space miners harvesting helium-3 from a volatile gas giant.',
    hook: '"We don\'t build megastructures to conquer stars. We build them because Earth ran out of fire."',
    suggestedIdea: 'Cinematic worldbuilding explainer on industrial orbital architecture.',
    velocityHistory: [32, 45, 60, 74, 82, 90],
    relatedKeywords: ['dyson swarm', 'megastructure engineering', 'stellar harvest', 'gas giant mining'],
  },
  {
    id: 'trend-6',
    topic: 'Synthetic Biometric Memory Ingestion',
    category: 'Cosmic Horror & Anomalies',
    growth: '+135%',
    velocityScore: 89,
    audienceIntent: 'Existential dread regarding artificial organisms copying human neural memories.',
    contentGap: 'Overused monster tropes instead of eerie identity displacement.',
    angle: 'The ship medical scanner reproducing memories that don\'t belong to any living human.',
    hook: '"The medical bay has your childhood memories saved. But you were manufactured three weeks ago."',
    suggestedIdea: 'Dark psychological sci-fi audio drama.',
    velocityHistory: [30, 42, 58, 70, 80, 89],
    relatedKeywords: ['biometric memory', 'synthetic identity', 'neural clone', 'cosmic identity theft'],
  },
];

export const ResearchIntelligenceView: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'trends' }) => {
  const { 
    currentProject, 
    setActiveModule, 
    saveTrend, 
    deleteSavedTrend,
    addResearchNote, 
    deleteResearchNote,
    addResearchSource, 
    deleteResearchSource,
    addResearchClaim, 
    toggleClaimStatus, 
    deleteResearchClaim,
    convertOpportunityToIdea,
    triggerToast 
  } = useApp();
  
  const { playCockpitBeep } = useTheme();

  // Active Main View Tab ('trends' vs 'research')
  const [activeMainTab, setActiveMainTab] = useState<'trends' | 'research'>(
    initialSubModule === 'research' ? 'research' : 'trends'
  );

  // Sync with prop when sidebar changes
  useEffect(() => {
    if (initialSubModule === 'research') setActiveMainTab('research');
    else if (initialSubModule === 'trends') setActiveMainTab('trends');
  }, [initialSubModule]);

  // Trends Radar State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTrend, setSelectedTrend] = useState<TrendItem>(MASTER_TRENDS[0]);

  // Research Workspace State
  const [activeResearchSubTab, setActiveResearchSubTab] = useState<'opportunity' | 'claims' | 'sources' | 'notes'>('opportunity');
  const [selectedOppId, setSelectedOppId] = useState<string>(
    currentProject.researchData?.opportunities[0]?.id || 'opp-1'
  );

  // New Note Form
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');

  // New Source Form
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCredibility, setNewSourceCredibility] = useState<ResearchSource['credibility']>('Academic Journal');
  const [newSourceTakeaways, setNewSourceTakeaways] = useState('');

  // New Claim Form
  const [isAddingClaim, setIsAddingClaim] = useState(false);
  const [newClaimStatement, setNewClaimStatement] = useState('');
  const [newClaimEvidence, setNewClaimEvidence] = useState('');
  const [newClaimStatus, setNewClaimStatus] = useState<ResearchClaim['status']>('Verified');

  // Categories list
  const categories = ['All', 'Astrophysics & Deep Space', 'AI & Consciousness', 'Speculative Science', 'Quantum & Relativity', 'Cybernetic Worldbuilding', 'Cosmic Horror & Anomalies'];

  // Filter trends
  const filteredTrends = MASTER_TRENDS.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.audienceIntent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const researchData = currentProject.researchData || {
    notes: [],
    sources: [],
    claims: [],
    opportunities: [],
    savedTrends: [],
  };

  const selectedOpportunity = researchData.opportunities.find((o) => o.id === selectedOppId) || researchData.opportunities[0];

  // Check if current trend is saved in project memory
  const isTrendSaved = researchData.savedTrends.some((t) => t.id === selectedTrend.id || t.topic === selectedTrend.topic);

  // Handlers
  const handleSaveTrendToggle = (trend: TrendItem) => {
    if (isTrendSaved) {
      deleteSavedTrend(trend.id);
      playCockpitBeep('click');
      triggerToast('info', 'TREND REMOVED', `Removed "${trend.topic}" from saved project trends.`);
    } else {
      saveTrend(trend);
    }
  };

  const handleLaunchOpportunityAnalysis = (trend: TrendItem) => {
    playCockpitBeep('engage');
    setActiveMainTab('research');
    setActiveResearchSubTab('opportunity');
  };

  const handleSendToIdeaGenerator = (trend: TrendItem) => {
    playCockpitBeep('engage');
    setActiveModule('ideas');
  };

  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    addResearchNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: newNoteTags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setIsAddingNote(false);
  };

  const handleCreateSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim()) return;
    addResearchSource({
      title: newSourceTitle.trim(),
      url: newSourceUrl.trim() || 'https://arxiv.org',
      credibility: newSourceCredibility,
      keyTakeaways: newSourceTakeaways.split('\n').map((t) => t.trim()).filter(Boolean),
    });
    setNewSourceTitle('');
    setNewSourceUrl('');
    setNewSourceTakeaways('');
    setIsAddingSource(false);
  };

  const handleCreateClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimStatement.trim()) return;
    addResearchClaim({
      statement: newClaimStatement.trim(),
      evidence: newClaimEvidence.trim(),
      status: newClaimStatus,
    });
    setNewClaimStatement('');
    setNewClaimEvidence('');
    setIsAddingClaim(false);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* HEADER & MAIN TAB SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Radar className="w-4 h-4 animate-spin-slow" />
            <span>// COGNITIVE RESEARCH & OPPORTUNITY OPERATING SYSTEM</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            {activeMainTab === 'trends' ? 'TREND RADAR & VELOCITY SENSORS' : 'DEEP RESEARCH & OPPORTUNITY MATRIX'}
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            {activeMainTab === 'trends'
              ? 'Scan real-time audience gravity, detect narrative voids, and capture cultural momentum.'
              : 'Synthesize research sources, formulate fact claims, and calculate mathematically validated content opportunities.'}
          </p>
        </div>

        {/* Master Tab Switcher */}
        <div className="flex items-center space-x-2 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)]">
          <button
            onClick={() => {
              playCockpitBeep('click');
              setActiveMainTab('trends');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
              activeMainTab === 'trends'
                ? 'bg-[var(--dm-accent)] text-black font-bold shadow-[0_0_12px_var(--dm-accent-soft)]'
                : 'text-[var(--dm-text-secondary)] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>TREND RADAR</span>
          </button>

          <button
            onClick={() => {
              playCockpitBeep('click');
              setActiveMainTab('research');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
              activeMainTab === 'research'
                ? 'bg-indigo-500 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'text-[var(--dm-text-secondary)] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>OPPORTUNITY MATRIX</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: TREND RADAR */}
      {/* ========================================================================= */}
      {activeMainTab === 'trends' && (
        <div className="space-y-5">
          {/* Controls: Search & Category Chips */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playCockpitBeep('click');
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-display whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[var(--dm-accent)] text-black font-bold'
                      : 'bg-[var(--dm-surface)] border border-[var(--dm-border)] text-[var(--dm-muted)] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--dm-accent)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan topics & keywords..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-surface)] text-xs font-display text-[var(--dm-text)] focus:border-[var(--dm-accent)] focus:outline-none"
              />
            </div>
          </div>

          {/* Synthesis Ladder: 7-Stage Chain of the Selected Trend */}
          <HoloPanel
            title="SYNTHESIS LADDER // CULTURAL MOMENTUM CHAIN"
            subtitle={`ANALYSIS OF: ${selectedTrend.topic.toUpperCase()}`}
            glow={true}
            headerRight={
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 font-bold">
                  VELOCITY: {selectedTrend.growth}
                </span>
                <button
                  onClick={() => handleSaveTrendToggle(selectedTrend)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                    isTrendSaved
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[var(--dm-surface-elevated)] text-[var(--dm-muted)] border-[var(--dm-border)] hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isTrendSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{isTrendSaved ? 'SAVED TO MEMORY' : 'SAVE TO PROJECT'}</span>
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-stretch text-xs">
              {/* 01: TREND */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[9px] text-[var(--dm-accent)] font-bold mb-1">01 // TREND</div>
                  <p className="font-display font-semibold text-[var(--dm-text)] line-clamp-2">{selectedTrend.topic}</p>
                </div>
                <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-2">{selectedTrend.category}</span>
              </div>

              {/* 02: VELOCITY */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
                <div className="font-mono text-[9px] text-cyan-400 font-bold mb-1">02 // VELOCITY</div>
                <div className="h-10 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={(selectedTrend.velocityHistory || [30, 45, 60, 75, 90]).map((v, i) => ({ step: i, v }))}>
                      <Area type="monotone" dataKey="v" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[9px] font-mono text-cyan-300">{selectedTrend.growth} 7-Day Curve</span>
              </div>

              {/* 03: AUDIENCE INTENT */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
                <div className="font-mono text-[9px] text-indigo-400 font-bold mb-1">03 // AUDIENCE INTENT</div>
                <p className="text-[11px] text-[var(--dm-text-secondary)] leading-snug line-clamp-3">
                  {selectedTrend.audienceIntent}
                </p>
                <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-1">High Retention Trigger</span>
              </div>

              {/* 04: CONTENT GAP */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
                <div className="font-mono text-[9px] text-amber-400 font-bold mb-1">04 // CONTENT GAP</div>
                <p className="text-[11px] text-[var(--dm-text-secondary)] leading-snug line-clamp-3">
                  {selectedTrend.contentGap}
                </p>
                <span className="text-[9px] font-mono text-amber-300 mt-1">Zero-Competition Void</span>
              </div>

              {/* 05: UNIQUE ANGLE */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] flex flex-col justify-between">
                <div className="font-mono text-[9px] text-purple-400 font-bold mb-1">05 // UNIQUE ANGLE</div>
                <p className="text-[11px] text-[var(--dm-text-secondary)] leading-snug line-clamp-3">
                  {selectedTrend.angle}
                </p>
                <span className="text-[9px] font-mono text-purple-300 mt-1">Original Perspective</span>
              </div>

              {/* 06: HOOK */}
              <div className="p-2.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-accent-border)] bg-[var(--dm-accent-soft)] flex flex-col justify-between">
                <div className="font-mono text-[9px] text-[var(--dm-accent)] font-bold mb-1">06 // 3-SEC HOOK</div>
                <p className="text-[11px] font-semibold text-white italic leading-snug line-clamp-3">
                  {selectedTrend.hook}
                </p>
                <span className="text-[9px] font-mono text-cyan-300 mt-1">First Impression</span>
              </div>

              {/* 07: SCRIPT IDEA */}
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/50 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[9px] text-emerald-400 font-bold mb-1">07 // STORY IDEA</div>
                  <p className="text-[11px] font-display font-semibold text-emerald-200 leading-snug line-clamp-3">
                    {selectedTrend.suggestedIdea}
                  </p>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleLaunchOpportunityAnalysis(selectedTrend)}
                    className="text-[9px] font-mono text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    OPPORTUNITY MATRIX <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => handleSendToIdeaGenerator(selectedTrend)}
                    className="text-[9px] font-mono text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                  >
                    IDEA GENERATOR <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </HoloPanel>

          {/* Grid: Trend Radar Sensor List & Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 8 Cols: Trending Topics Sensor Cards */}
            <div className="lg:col-span-8 space-y-2.5">
              <HoloPanel
                title="DETECTED COGNITIVE TRENDS"
                subtitle={`SCANNING ${filteredTrends.length} ACCRETION STREAMS`}
              >
                <div className="space-y-2.5">
                  {filteredTrends.map((trend) => {
                    const isSelected = selectedTrend.id === trend.id;
                    const isSaved = researchData.savedTrends.some((t) => t.id === trend.id);
                    return (
                      <div
                        key={trend.id}
                        onClick={() => {
                          playCockpitBeep('click');
                          setSelectedTrend(trend);
                        }}
                        className={`
                          p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3
                          ${
                            isSelected
                              ? 'border-[var(--dm-accent)] bg-[var(--dm-surface-elevated)] shadow-[0_0_15px_var(--dm-accent-soft)]'
                              : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                          }
                        `}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase font-semibold">
                              {trend.category}
                            </span>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-bold">
                              {trend.growth}
                            </span>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
                              VELOCITY: {trend.velocityScore}/100
                            </span>
                            {isSaved && (
                              <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                                <Bookmark className="w-2.5 h-2.5 fill-current" /> SAVED
                              </span>
                            )}
                          </div>

                          <h4 className="font-display text-sm font-bold text-[var(--dm-text)]">
                            {trend.topic}
                          </h4>

                          <p className="text-xs text-[var(--dm-text-secondary)] line-clamp-1">
                            {trend.audienceIntent}
                          </p>

                          {/* Related Keywords Pill Bar */}
                          {trend.relatedKeywords && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {trend.relatedKeywords.map((kw) => (
                                <span key={kw} className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[var(--dm-surface)] border border-[var(--dm-border)] text-[var(--dm-muted)]">
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="shrink-0 flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveTrendToggle(trend);
                            }}
                            className="p-2 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] hover:text-amber-400 transition-colors cursor-pointer"
                            title={isSaved ? 'Remove from Saved' : 'Save to Project'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-[var(--dm-muted)]'}`} />
                          </button>

                          <GlowButton
                            size="sm"
                            variant={isSelected ? 'primary' : 'secondary'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrend(trend);
                              handleLaunchOpportunityAnalysis(trend);
                            }}
                          >
                            OPPORTUNITY MATRIX
                          </GlowButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </HoloPanel>
            </div>

            {/* Right 4 Cols: Quick Hook Accelerator & Quantum Memory */}
            <div className="lg:col-span-4 space-y-4">
              <HoloPanel title="HOOK ACCELERATOR" subtitle="OPENING 3-SECOND RETENTION">
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
                    GO TO IDEA GENERATOR
                  </GlowButton>
                </div>
              </HoloPanel>

              {/* Saved Trends in Project Memory */}
              <HoloPanel
                title="SAVED IN PROJECT MEMORY"
                subtitle={`${researchData.savedTrends.length} CAPTURED TOPICS`}
                headerRight={<Bookmark className="w-3.5 h-3.5 text-amber-400" />}
              >
                {researchData.savedTrends.length === 0 ? (
                  <p className="text-xs text-[var(--dm-muted)] italic">
                    No trends vaulted yet. Click the bookmark icon on any trend card to save it.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {researchData.savedTrends.map((st) => (
                      <div key={st.id} className="p-2 rounded bg-[var(--dm-surface)] border border-[var(--dm-border)] flex items-center justify-between text-xs">
                        <div className="truncate mr-2">
                          <span className="font-display font-semibold text-white block truncate">{st.topic}</span>
                          <span className="font-mono text-[9px] text-emerald-400">{st.growth} Velocity</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTrend(st);
                            playCockpitBeep('click');
                          }}
                          className="text-[10px] font-mono text-cyan-400 hover:underline shrink-0"
                        >
                          LOAD
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </HoloPanel>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DEEP RESEARCH & OPPORTUNITY WORKSPACE */}
      {/* ========================================================================= */}
      {activeMainTab === 'research' && (
        <div className="space-y-5">
          {/* Research Sub-Tabs */}
          <div className="flex items-center space-x-1 border-b border-[var(--dm-divider)] pb-2 overflow-x-auto">
            {[
              { id: 'opportunity', label: 'OPPORTUNITY MATRIX', icon: Target, count: researchData.opportunities.length },
              { id: 'claims', label: 'EVIDENCE & FACT BANK', icon: Scale, count: researchData.claims.length },
              { id: 'sources', label: 'SOURCES & REFERENCES', icon: BookOpen, count: researchData.sources.length },
              { id: 'notes', label: 'FIELD RESEARCH NOTES', icon: FileText, count: researchData.notes.length },
            ].map((sub) => {
              const Icon = sub.icon;
              const isCurrent = activeResearchSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    playCockpitBeep('click');
                    setActiveResearchSubTab(sub.id as typeof activeResearchSubTab);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : 'text-[var(--dm-text-secondary)] hover:text-white hover:bg-[var(--dm-surface)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isCurrent ? 'bg-indigo-900 text-indigo-200' : 'bg-[var(--dm-surface)] text-[var(--dm-muted)]'
                  }`}>
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ===================================================================== */}
          {/* SUB-TAB 1: OPPORTUNITY MATRIX */}
          {/* ===================================================================== */}
          {activeResearchSubTab === 'opportunity' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 4 Cols: Opportunities List */}
              <div className="lg:col-span-4 space-y-3">
                <HoloPanel title="CALCULATED OPPORTUNITIES" subtitle="SCORED VIA QUADRANT MATRIX">
                  <div className="space-y-2">
                    {researchData.opportunities.map((opp) => {
                      const isSelected = selectedOpportunity?.id === opp.id;
                      return (
                        <div
                          key={opp.id}
                          onClick={() => {
                            playCockpitBeep('click');
                            setSelectedOppId(opp.id);
                          }}
                          className={`
                            p-3 rounded-xl border transition-all cursor-pointer
                            ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-950/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                                : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[9px] text-indigo-400 font-bold uppercase">
                              INDEX: {opp.opportunityScore}/100
                            </span>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
                              DEMAND: {opp.demandScore}%
                            </span>
                          </div>
                          <h4 className="font-display text-xs font-bold text-white mb-1">
                            {opp.suggestedTitle || opp.trendTopic}
                          </h4>
                          <p className="text-[11px] text-[var(--dm-text-secondary)] line-clamp-2">
                            {opp.coreAngle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </HoloPanel>
              </div>

              {/* Right 8 Cols: Selected Opportunity Detail & Direct 1-Click Synthesis */}
              {selectedOpportunity && (
                <div className="lg:col-span-8 space-y-4">
                  <HoloPanel
                    title="OPPORTUNITY DECONSTRUCTION"
                    subtitle={`TOPIC: ${selectedOpportunity.trendTopic}`}
                    headerRight={
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/60 text-indigo-300 font-bold">
                          OPPORTUNITY INDEX: {selectedOpportunity.opportunityScore}/100
                        </span>
                      </div>
                    }
                  >
                    <div className="space-y-4 text-xs">
                      {/* 3 Metric Progress Gauges */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[10px] text-emerald-400 font-bold">AUDIENCE DEMAND</span>
                            <span className="font-mono font-bold text-white">{selectedOpportunity.demandScore}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedOpportunity.demandScore}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-1 block">Search volume & social engagement</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[10px] text-amber-400 font-bold">COMPETITOR DENSITY</span>
                            <span className="font-mono font-bold text-white">{selectedOpportunity.competitionScore}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${selectedOpportunity.competitionScore}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-1 block">Existing video & essay saturation (Lower is better)</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[10px] text-cyan-400 font-bold">UNIQUENESS INDEX</span>
                            <span className="font-mono font-bold text-white">{selectedOpportunity.uniquenessScore}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${selectedOpportunity.uniquenessScore}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-[var(--dm-muted)] mt-1 block">Original thesis & differentiation factor</span>
                        </div>
                      </div>

                      {/* Content Gap & Target Audience */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-1">
                          <span className="font-mono text-[10px] text-amber-400 uppercase font-bold block">
                            MARKET CONTENT GAP
                          </span>
                          <p className="text-slate-300 leading-relaxed text-xs">
                            {selectedOpportunity.contentGap}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-1">
                          <span className="font-mono text-[10px] text-indigo-400 uppercase font-bold block">
                            TARGET AUDIENCE INTENT
                          </span>
                          <p className="text-slate-300 leading-relaxed text-xs">
                            {selectedOpportunity.targetAudience}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Core Angle & Hook */}
                      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span className="font-mono text-[10px] text-indigo-300 font-bold uppercase">
                            RECOMMENDED CORE ANGLE & TITLE
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold text-white">
                          "{selectedOpportunity.suggestedTitle}"
                        </h3>
                        <p className="text-slate-300 leading-relaxed italic">
                          Hook: {selectedOpportunity.hook}
                        </p>
                        <p className="text-xs text-[var(--dm-text-secondary)]">
                          Angle: {selectedOpportunity.coreAngle}
                        </p>
                      </div>

                      {/* 1-Click Synthesis Action */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--dm-divider)]">
                        <span className="text-xs text-[var(--dm-text-secondary)] font-mono">
                          // Ready to advance into the Idea Generator workspace?
                        </span>

                        <GlowButton
                          variant="primary"
                          icon={<Sparkles className="w-4 h-4" />}
                          onClick={() => {
                            const newIdea = convertOpportunityToIdea(selectedOpportunity);
                            setActiveModule('ideas');
                          }}
                        >
                          SYNTHESIZE INTO STORY IDEA
                        </GlowButton>
                      </div>
                    </div>
                  </HoloPanel>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* SUB-TAB 2: EVIDENCE & FACT BANK */}
          {/* ===================================================================== */}
          {activeResearchSubTab === 'claims' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--dm-text-secondary)]">
                  Ground your sci-fi narratives in rigorous physics, verifiable data, and speculative claims.
                </span>
                <GlowButton
                  size="sm"
                  variant="secondary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddingClaim(!isAddingClaim)}
                >
                  {isAddingClaim ? 'CANCEL' : 'ADD EVIDENCE CLAIM'}
                </GlowButton>
              </div>

              {isAddingClaim && (
                <form onSubmit={handleCreateClaimSubmit} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-indigo-500/50 space-y-3">
                  <h4 className="text-xs font-display font-bold uppercase text-white">RECORD NEW FACT OR HYPOTHESIS</h4>
                  <input
                    type="text"
                    value={newClaimStatement}
                    onChange={(e) => setNewClaimStatement(e.target.value)}
                    placeholder="Claim statement (e.g., Rotating Kerr black holes exhibit ergosphere wave amplification)"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                  />
                  <textarea
                    value={newClaimEvidence}
                    onChange={(e) => setNewClaimEvidence(e.target.value)}
                    placeholder="Supporting scientific evidence or reference context..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                    rows={2}
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={newClaimStatus}
                      onChange={(e) => setNewClaimStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white font-mono"
                    >
                      <option value="Verified">Status: Verified</option>
                      <option value="Hypothesis">Status: Hypothesis</option>
                      <option value="Controversial">Status: Controversial</option>
                    </select>

                    <GlowButton size="sm" variant="primary" type="submit">
                      SAVE CLAIM
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {researchData.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3.5 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleClaimStatus(claim.id)}
                          className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase cursor-pointer border ${
                            claim.status === 'Verified'
                              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
                              : claim.status === 'Hypothesis'
                              ? 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40'
                              : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                          }`}
                          title="Click to toggle status"
                        >
                          STATUS: {claim.status}
                        </button>
                        {claim.sourceRef && (
                          <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                            REF: {claim.sourceRef}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-semibold text-white">
                        {claim.statement}
                      </h4>
                      <p className="text-[11px] text-[var(--dm-text-secondary)]">
                        {claim.evidence}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteResearchClaim(claim.id)}
                      className="text-[var(--dm-muted)] hover:text-red-400 p-1 cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SUB-TAB 3: SOURCES & REFERENCES */}
          {/* ===================================================================== */}
          {activeResearchSubTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--dm-text-secondary)]">
                  Archive reference papers, mission logs, and astrophysics citations.
                </span>
                <GlowButton
                  size="sm"
                  variant="secondary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddingSource(!isAddingSource)}
                >
                  {isAddingSource ? 'CANCEL' : 'REGISTER SOURCE'}
                </GlowButton>
              </div>

              {isAddingSource && (
                <form onSubmit={handleCreateSourceSubmit} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-indigo-500/50 space-y-3">
                  <h4 className="text-xs font-display font-bold uppercase text-white">ADD NEW SOURCE</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newSourceTitle}
                      onChange={(e) => setNewSourceTitle(e.target.value)}
                      placeholder="Source Title (e.g. Kerr Metric Acoustics)"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="URL or internal telemetry URI"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                    />
                  </div>
                  <select
                    value={newSourceCredibility}
                    onChange={(e) => setNewSourceCredibility(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white font-mono"
                  >
                    <option value="Verified Science">Credibility: Verified Science</option>
                    <option value="Academic Journal">Credibility: Academic Journal</option>
                    <option value="Classified Log">Credibility: Classified Log</option>
                    <option value="Theoretical Speculation">Credibility: Theoretical Speculation</option>
                  </select>
                  <textarea
                    value={newSourceTakeaways}
                    onChange={(e) => setNewSourceTakeaways(e.target.value)}
                    placeholder="Key takeaways (one per line)..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <GlowButton size="sm" variant="primary" type="submit">
                      SAVE SOURCE
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchData.sources.map((src) => (
                  <div key={src.id} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 font-bold">
                        {src.credibility}
                      </span>
                      <button
                        onClick={() => deleteResearchSource(src.id)}
                        className="text-[var(--dm-muted)] hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white">
                      {src.title}
                    </h4>

                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {src.url} <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    <div className="space-y-1 pt-1 border-t border-[var(--dm-divider)]">
                      <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block">KEY TAKEAWAYS:</span>
                      {src.keyTakeaways.map((k, i) => (
                        <div key={i} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                          <span className="text-[var(--dm-accent)] font-mono">&gt;</span>
                          <span>{k}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SUB-TAB 4: FIELD RESEARCH NOTES */}
          {/* ===================================================================== */}
          {activeResearchSubTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--dm-text-secondary)]">
                  Log raw theoretical scratchpads, narrative ideas, and cosmological thoughts.
                </span>
                <GlowButton
                  size="sm"
                  variant="secondary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddingNote(!isAddingNote)}
                >
                  {isAddingNote ? 'CANCEL' : 'NEW RESEARCH NOTE'}
                </GlowButton>
              </div>

              {isAddingNote && (
                <form onSubmit={handleCreateNoteSubmit} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-indigo-500/50 space-y-3">
                  <h4 className="text-xs font-display font-bold uppercase text-white">CREATE RESEARCH LOG ENTRY</h4>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Note title (e.g. Ergosphere Penrose Extraction Mechanics)"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                  />
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write detailed observations, scientific equations, or narrative hooks..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white font-mono"
                    rows={4}
                  />
                  <input
                    type="text"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    placeholder="Tags comma-separated (e.g. Astrophysics, Acoustics, Relativistic)"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white font-mono"
                  />
                  <div className="flex justify-end">
                    <GlowButton size="sm" variant="primary" type="submit">
                      RECORD IN NOTEBOOK
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {researchData.notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                        LOGGED: {note.updatedAt}
                      </span>
                      <button
                        onClick={() => deleteResearchNote(note.id)}
                        className="text-[var(--dm-muted)] hover:text-red-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white">
                      {note.title}
                    </h4>

                    <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                      {note.content}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {note.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-500/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
