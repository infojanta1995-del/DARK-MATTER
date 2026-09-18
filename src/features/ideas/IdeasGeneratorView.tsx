import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AITaskRouter } from '../../core/ai/AITaskRouter';
import { ContextEngine } from '../../core/context/ContextEngine';
import { Idea, IdeaAnalysis, IdeaVariation, IdeaGenerationInputs } from '../../types';
import { IdeaAnalysisModal } from './IdeaAnalysisModal';
import { IdeaVariationsModal } from './IdeaVariationsModal';
import { EditIdeaModal } from './EditIdeaModal';
import { 
  Sparkles, 
  Zap, 
  Bookmark, 
  BookmarkCheck, 
  Film, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Radio, 
  Compass, 
  Lightbulb, 
  Database,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

const PRESET_TOPICS = [
  {
    name: 'Quantum Horizon Anomaly',
    topic: 'Anomalous radio broadcast originating from inside a black hole event horizon',
    audience: 'Sci-fi fans, astronomy enthusiasts, space mystery explorers',
    tone: 'Cinematic & Ominous',
  },
  {
    name: 'Cybernetic Memory Decay',
    topic: 'An interstellar android slowly replacing human mission logs with impossible alien poetry',
    audience: 'Philosophical sci-fi viewers, cyberpunk story lovers',
    tone: 'Atmospheric & Intellectual',
  },
  {
    name: 'Relativistic Derelict Salvage',
    topic: 'Salvage crew board a research ship where time moves 10,000 times slower inside the bridge',
    audience: 'High-tension sci-fi and survival thriller fans',
    tone: 'Suspenseful & Urgent',
  },
  {
    name: 'Sub-Surface Europa Cryo-Ruins',
    topic: 'Submarine exploratory drill breaks into an illuminated biome beneath Europa icy crust',
    audience: 'Deep space exploration enthusiasts, speculative science followers',
    tone: 'Wonder & Cosmic Dread',
  },
];

export const IdeasGeneratorView: React.FC = () => {
  const { 
    currentProject, 
    setActiveModule, 
    saveIdea, 
    updateIdea, 
    deleteIdea, 
    duplicateIdea, 
    createScriptFromIdea, 
    triggerToast 
  } = useApp();
  const { playCockpitBeep } = useTheme();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'synthesizer' | 'vault'>('synthesizer');

  // Generator Form State
  const [topic, setTopic] = useState(currentProject.name || 'Cosmic Singularity Encounter');
  const [targetAudience, setTargetAudience] = useState('Sci-Fi fans, cinema enthusiasts, speculative fiction followers');
  const [tone, setTone] = useState('Cinematic, Dramatic, Thought-Provoking');
  const [format, setFormat] = useState<string>(currentProject.targetPlatform || 'YouTube Longform');
  const [count, setCount] = useState<number>(3);
  const [language, setLanguage] = useState(currentProject.language || 'English');

  // Advanced Directives (collapsible drawer)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creatorDirectives, setCreatorDirectives] = useState('');
  const [competitorReference, setCompetitorReference] = useState('');
  const [referenceLore, setReferenceLore] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('hard sci-fi, cosmic mystery, singularity, deep space');

  // Generator Execution State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Modals & Analysis State
  const [activeAnalysisIdea, setActiveAnalysisIdea] = useState<Idea | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<IdeaAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [activeVariationsIdea, setActiveVariationsIdea] = useState<Idea | null>(null);
  const [variationsList, setVariationsList] = useState<IdeaVariation[]>([]);
  const [isVarying, setIsVarying] = useState(false);

  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  // Vault Filtering State
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultStatusFilter, setVaultStatusFilter] = useState<'all' | 'saved' | 'scripted' | 'draft'>('all');

  // Copied hook feedback
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  const vaultedIdeas = currentProject.ideas || [];

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  const handleApplyPreset = (preset: typeof PRESET_TOPICS[0]) => {
    playCockpitBeep('click');
    setTopic(preset.topic);
    setTargetAudience(preset.audience);
    setTone(preset.tone);
    triggerToast('info', 'PRESET APPLIED', `Loaded configuration for "${preset.name}".`);
  };

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    playCockpitBeep('engage');
    setIsSynthesizing(true);
    setGenerationProgress(15);

    const progressTimer = setInterval(() => {
      setGenerationProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 180);

    try {
      const inputs: IdeaGenerationInputs = {
        niche: currentProject.primaryMode,
        topic,
        targetAudience,
        platform: format,
        contentType: 'Sci-Fi Narrative',
        language,
        tone,
        videoDuration: '10-15 min',
        goal: 'Viral Reach & Intrigue',
        userNotes: creatorDirectives,
        competitorReference,
        referenceContext: referenceLore,
        keywords: targetKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        count,
        primaryMode: currentProject.primaryMode,
        secondaryModes: [currentProject.secondaryMode],
      };
      const context = ContextEngine.buildIdeaContext(currentProject, inputs);
      const ideas = await AITaskRouter.generateIdeas(inputs, context);

      clearInterval(progressTimer);
      setGenerationProgress(100);
      setGeneratedIdeas(ideas);
      playCockpitBeep('pulse');
      triggerToast('success', 'CONCEPTS SYNTHESIZED', `Generated ${ideas.length} narrative vectors.`);
    } catch (err: any) {
      clearInterval(progressTimer);
      triggerToast('error', 'SYNTHESIS ERROR', err.message || 'Failed to synthesize ideas.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleVaultIdea = (idea: Idea) => {
    playCockpitBeep('engage');
    saveIdea(idea);
    // Mark in generated stream
    setGeneratedIdeas((prev) =>
      prev.map((i) => (i.id === idea.id ? { ...i, status: 'saved' } : i))
    );
  };

  const handleExpandToScript = (idea: Idea) => {
    playCockpitBeep('engage');
    createScriptFromIdea(idea);
    setActiveModule('story');
  };

  const handleRunAnalysis = async (idea: Idea) => {
    playCockpitBeep('engage');
    setActiveAnalysisIdea(idea);
    setIsAnalyzing(true);
    setActiveAnalysis(null);

    try {
      const context = ContextEngine.buildIdeaContext(currentProject, { idea });
      const result = await AITaskRouter.analyzeIdea(idea, context);
      setActiveAnalysis(result);
      playCockpitBeep('pulse');
    } catch (err: any) {
      triggerToast('error', 'AUDIT FAILED', err.message || 'Strategic audit encountered an anomaly.');
      setActiveAnalysisIdea(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariations = async (idea: Idea) => {
    playCockpitBeep('engage');
    setActiveVariationsIdea(idea);
    setIsVarying(true);
    setVariationsList([]);

    try {
      const context = ContextEngine.buildIdeaContext(currentProject, { idea });
      const results = await AITaskRouter.generateVariations(idea, context);
      setVariationsList(results);
      playCockpitBeep('pulse');
    } catch (err: any) {
      triggerToast('error', 'MULTIPLIER FAILED', err.message || 'Angle generation encountered an error.');
      setActiveVariationsIdea(null);
    } finally {
      setIsVarying(false);
    }
  };

  const handleSaveVariationAsIdea = (v: IdeaVariation) => {
    const newIdea: Idea = {
      id: `idea-var-${Date.now()}`,
      projectId: currentProject.id,
      title: v.title,
      hook: v.hook,
      concept: v.concept,
      coreConcept: v.concept,
      uniqueAngle: `${v.angleType} Angle: ${v.rationale}`,
      angle: `${v.angleType} Angle: ${v.rationale}`,
      targetAudience,
      contentType: 'Sci-Fi Narrative',
      estimatedDuration: '8-12 min',
      recommendedPlatform: format,
      opportunityScore: 88,
      trendRelevance: 85,
      trendScore: 92,
      competitionScore: 50,
      status: 'saved',
      primaryMode: currentProject.primaryMode,
      secondaryModes: [currentProject.secondaryMode],
      keywords: [v.angleType, 'angle'],
      hashtags: ['#scifi', '#concept'],
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    saveIdea(newIdea);
  };

  const handleCopyHook = (ideaId: string, hook: string) => {
    playCockpitBeep('click');
    navigator.clipboard.writeText(hook);
    setCopiedHookId(ideaId);
    setTimeout(() => setCopiedHookId(null), 2000);
  };

  // Filtered Vault Ideas
  const filteredVaultIdeas = vaultedIdeas.filter((idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      idea.hook.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      (idea.concept && idea.concept.toLowerCase().includes(vaultSearch.toLowerCase()));
    
    const matchesStatus = 
      vaultStatusFilter === 'all' || 
      idea.status === vaultStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="ideas-generator-container" className="space-y-6">
      {/* Top Cockpit Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>NARRATIVE CONCEPT ENGINE // MIGRATED MINT-MIND SUITE</span>
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-slate-100 mt-1">
            IDEA GENERATOR & STRATEGIC VAULT
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Mode: <span className="text-cyan-300 font-mono">{currentProject.primaryMode}</span> +{' '}
            <span className="text-indigo-300 font-mono">{currentProject.secondaryMode}</span>. High-gravity hook synthesis & audience retention analytics.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
          <button
            id="tab-synthesizer-btn"
            onClick={() => {
              playCockpitBeep('click');
              setActiveTab('synthesizer');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'synthesizer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SYNTHESIZER DECK</span>
          </button>
          <button
            id="tab-vault-btn"
            onClick={() => {
              playCockpitBeep('click');
              setActiveTab('vault');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'vault'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PROJECT VAULT ({vaultedIdeas.length})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: SYNTHESIZER DECK                                              */}
      {/* ===================================================================== */}
      {activeTab === 'synthesizer' && (
        <div className="space-y-6">
          {/* Quick Presets Bar */}
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>RAPID INSPIRATION PRESETS</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">1-CLICK CONTEXT INJECTION</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="text-left p-2 rounded bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all text-xs group"
                >
                  <div className="font-mono text-cyan-300 group-hover:text-cyan-200 font-semibold truncate">
                    {p.name}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate mt-0.5">{p.topic}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSynthesize} className="space-y-4">
            <HoloPanel glow={true} className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                    IDEA SYNTHESIS PARAMETERS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>ADVANCED DIRECTIVES</span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    TOPIC, PREMISE SEED, OR TRANSMISSION THEME
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    placeholder="e.g. Signal detected inside the event horizon..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950/90 border border-slate-700/80 rounded-lg font-mono text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    TARGET PLATFORM / MEDIUM
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950/90 border border-slate-700/80 rounded-lg font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="YouTube Longform">YouTube Longform (8-15 min)</option>
                    <option value="Cinematic Short">Cinematic Short (0-60 sec)</option>
                    <option value="Episodic Series">Episodic Series Pilot</option>
                    <option value="Podcast / Audio Drama">Podcast / Audio Drama</option>
                    <option value="Feature Screenplay">Feature Screenplay Act I</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    TARGET AUDIENCE PSYCHOLOGY
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded-lg font-sans text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    NARRATIVE TONE & ATMOSPHERE
                  </label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded-lg font-sans text-slate-200 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    SYNTHESIS BATCH COUNT
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded-lg font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={3}>3 Concepts (Focused)</option>
                    <option value={5}>5 Concepts (Deep Sweep)</option>
                    <option value={8}>8 Concepts (Wide Exploration)</option>
                  </select>
                </div>
              </div>

              {/* Collapsible Advanced Directives */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-slate-800/80 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-cyan-400 mb-1">
                          CREATOR DIRECTIVES & MANDATES
                        </label>
                        <textarea
                          value={creatorDirectives}
                          onChange={(e) => setCreatorDirectives(e.target.value)}
                          placeholder="e.g. Must end on a mind-bending cliffhanger, prioritize hard physics over soft fantasy..."
                          rows={2}
                          className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded font-sans text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-emerald-400 mb-1">
                          STORY BIBLE & WORLD RULES LORE
                        </label>
                        <textarea
                          value={referenceLore}
                          onChange={(e) => setReferenceLore(e.target.value)}
                          placeholder="e.g. FTL travel relies on negative mass rings, ship AI IRIS has strict preservation protocols..."
                          rows={2}
                          className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded font-sans text-slate-200 focus:border-cyan-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-amber-400 mb-1">
                          COMPETITOR REFERENCE OR MARKET BENCHMARK
                        </label>
                        <input
                          type="text"
                          value={competitorReference}
                          onChange={(e) => setCompetitorReference(e.target.value)}
                          placeholder="e.g. Like Interstellar meets 2001, but with modern YouTube pacing"
                          className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded font-sans text-slate-200 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-indigo-400 mb-1">
                          TARGET KEYWORDS & SEARCH ANCHORS
                        </label>
                        <input
                          type="text"
                          value={targetKeywords}
                          onChange={(e) => setTargetKeywords(e.target.value)}
                          placeholder="comma separated keywords"
                          className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700/80 rounded font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button & Progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>SYNTHESIS AI: LOCAL HIGH-EFFICIENCY ROUTER</span>
                </div>

                <GlowButton
                  variant="primary"
                  type="submit"
                  loading={isSynthesizing}
                  icon={<Zap className="w-4 h-4" />}
                >
                  SYNTHESIZE CONCEPT MATRIX
                </GlowButton>
              </div>

              {/* Progress Bar */}
              {isSynthesizing && (
                <div className="w-full space-y-1 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                    <span>CALIBRATING MULTI-VECTOR IDEATION MATRIX...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </HoloPanel>
          </form>

          {/* Generated Ideas Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-sm font-bold text-slate-200 tracking-wider">
                  GENERATED CONCEPT STREAM ({generatedIdeas.length})
                </h3>
              </div>
              {generatedIdeas.length > 0 && (
                <span className="font-mono text-xs text-slate-400">
                  Click 'EXPAND INTO SCRIPT' to auto-generate screenplay acts & scenes
                </span>
              )}
            </div>

            {generatedIdeas.length === 0 && !isSynthesizing && (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 p-6 space-y-3">
                <Lightbulb className="w-10 h-10 text-cyan-500/40 mx-auto" />
                <h4 className="font-mono text-sm font-bold text-slate-300">
                  SYNTHESIZER STANDING BY
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select a topic preset above or enter your premise seed, then click
                  'SYNTHESIZE CONCEPT MATRIX' to generate high-retention hooks and story concepts.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {generatedIdeas.map((idea) => {
                const isVaulted = vaultedIdeas.some((v) => v.id === idea.id || v.title === idea.title);

                return (
                  <HoloPanel
                    key={idea.id}
                    glow={true}
                    className="p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                              {idea.recommendedPlatform || format}
                            </span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                              {idea.estimatedDuration || '10 min'}
                            </span>
                          </div>
                          <h4 className="font-mono text-base font-bold text-slate-100 tracking-wide leading-snug">
                            {idea.title}
                          </h4>
                        </div>

                        {/* Metric Badge */}
                        <div className="text-right shrink-0">
                          <div className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{idea.trendScore || 92}% RET</span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 block">
                            OPP SCORE: {idea.opportunityScore || 88}/100
                          </span>
                        </div>
                      </div>

                      {/* Spoken Hook Box */}
                      <div className="p-3.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 space-y-1.5 relative group">
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                          <span>SPOKEN RETENTION HOOK (FIRST 5 SECONDS)</span>
                          <button
                            onClick={() => handleCopyHook(idea.id, idea.hook)}
                            className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                          >
                            {copiedHookId === idea.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-xs text-cyan-200 italic leading-relaxed">
                          "{idea.hook}"
                        </p>
                      </div>

                      {/* Concept Narrative */}
                      <div className="space-y-1 text-xs">
                        <span className="font-mono text-[10px] text-slate-400 block uppercase">
                          CORE NARRATIVE CONCEPT
                        </span>
                        <p className="text-slate-300 font-sans leading-relaxed">
                          {idea.concept || idea.coreConcept}
                        </p>
                      </div>

                      {/* Unique Angle */}
                      {idea.uniqueAngle && (
                        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs">
                          <span className="font-mono text-[10px] text-amber-400 block mb-0.5">
                            UNIQUE ANGLE & DIFFERENTIATION
                          </span>
                          <p className="text-slate-300 font-sans text-xs">
                            {idea.uniqueAngle}
                          </p>
                        </div>
                      )}

                      {/* Keywords / Tags */}
                      {idea.keywords && idea.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {idea.keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="font-mono text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRunAnalysis(idea)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 transition-colors"
                          title="Run Strategic Audit"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AUDIT</span>
                        </button>

                        <button
                          onClick={() => handleGenerateVariations(idea)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                          title="Generate 5 Distinct Angles"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>5 ANGLES</span>
                        </button>

                        <button
                          onClick={() => setEditingIdea(idea)}
                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-900 transition-colors"
                          title="Edit Parameters"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVaultIdea(idea)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                            isVaulted
                              ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300'
                          }`}
                        >
                          {isVaulted ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>VAULTED</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>VAULT</span>
                            </>
                          )}
                        </button>

                        <GlowButton
                          variant="primary"
                          size="sm"
                          icon={<Film className="w-3.5 h-3.5" />}
                          onClick={() => handleExpandToScript(idea)}
                        >
                          EXPAND INTO SCRIPT
                        </GlowButton>
                      </div>
                    </div>
                  </HoloPanel>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PROJECT VAULT (SAVED IDEAS)                                   */}
      {/* ===================================================================== */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                placeholder="Search vaulted concepts, hooks, tags..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded font-mono text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">STATUS:</span>
              <div className="flex items-center gap-1">
                {(['all', 'saved', 'scripted', 'draft'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      playCockpitBeep('click');
                      setVaultStatusFilter(st);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                      vaultStatusFilter === st
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vault List */}
          {filteredVaultIdeas.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 p-6 space-y-3">
              <Database className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-mono text-sm font-bold text-slate-300">
                PROJECT VAULT IS EMPTY
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No ideas match your current filter. Switch to the SYNTHESIZER DECK to generate
                concepts and click 'VAULT' to persist them to project memory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVaultIdeas.map((idea) => (
                <HoloPanel
                  key={idea.id}
                  glow={true}
                  className="p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase ${
                        idea.status === 'scripted'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {idea.status || 'SAVED'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {idea.createdAt || 'Recent'}
                      </span>
                    </div>

                    <h4 className="font-mono text-sm font-bold text-slate-100 line-clamp-2">
                      {idea.title}
                    </h4>

                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-xs">
                      <p className="font-mono text-xs text-cyan-300 italic line-clamp-2">
                        "{idea.hook}"
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 font-sans line-clamp-3">
                      {idea.concept || idea.coreConcept}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateIdea(idea.id)}
                        className="p-1.5 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-900 transition-colors"
                        title="Duplicate Concept"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900 transition-colors"
                        title="Purge from Vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <GlowButton
                      variant={idea.status === 'scripted' ? 'secondary' : 'primary'}
                      size="sm"
                      icon={<Film className="w-3.5 h-3.5" />}
                      onClick={() => handleExpandToScript(idea)}
                    >
                      {idea.status === 'scripted' ? 'VIEW SCRIPT' : 'EXPAND TO SCRIPT'}
                    </GlowButton>
                  </div>
                </HoloPanel>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODALS                                                                */}
      {/* ===================================================================== */}
      <IdeaAnalysisModal
        isOpen={!!activeAnalysisIdea}
        onClose={() => setActiveAnalysisIdea(null)}
        idea={activeAnalysisIdea}
        analysis={activeAnalysis}
        isLoading={isAnalyzing}
        onExpandToScript={handleExpandToScript}
      />

      <IdeaVariationsModal
        isOpen={!!activeVariationsIdea}
        onClose={() => setActiveVariationsIdea(null)}
        idea={activeVariationsIdea}
        variations={variationsList}
        isLoading={isVarying}
        onSaveVariationAsIdea={handleSaveVariationAsIdea}
      />

      <EditIdeaModal
        isOpen={!!editingIdea}
        onClose={() => setEditingIdea(null)}
        idea={editingIdea}
        onSave={(updates) => {
          if (editingIdea) {
            updateIdea(editingIdea.id, updates);
            setGeneratedIdeas((prev) =>
              prev.map((i) => (i.id === editingIdea.id ? { ...i, ...updates } : i))
            );
            triggerToast('success', 'IDEA UPDATED', 'Concept modified successfully.');
          }
        }}
      />
    </div>
  );
};
