import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AITaskRouter } from '../../core/ai/AITaskRouter';
import { ContextEngine } from '../../core/context/ContextEngine';
import { Project, Idea, Script, ScriptSettings } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { 
  Sparkles, 
  X, 
  Film, 
  Sliders, 
  FileText, 
  Clock, 
  Lightbulb, 
  Radio, 
  Zap,
  Check
} from 'lucide-react';

interface ScriptSynthesizerModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onScriptGenerated: (script: Script) => void;
  initialIdea?: Idea | null;
}

export const ScriptSynthesizerModal: React.FC<ScriptSynthesizerModalProps> = ({
  isOpen,
  project,
  onClose,
  onScriptGenerated,
  initialIdea = null,
}) => {
  const { playCockpitBeep } = useTheme();

  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(initialIdea?.id || '');
  const [topic, setTopic] = useState<string>(initialIdea?.title || project.name || '');
  const [ideaText, setIdeaText] = useState<string>(initialIdea?.concept || '');
  const [audience, setAudience] = useState<string>(
    initialIdea?.targetAudience || 'Sci-fi enthusiasts, curious learners, cinema narrative fans'
  );
  const [platform, setPlatform] = useState<string>(
    initialIdea?.recommendedPlatform || project.targetPlatform || 'YouTube 4K'
  );
  const [duration, setDuration] = useState<string>(initialIdea?.estimatedDuration || '8–12 minutes');
  const [tone, setTone] = useState<string>('Cinematic, Dramatic, Immersive');
  const [narrationStyle, setNarrationStyle] = useState<string>('Authoritative Voiceover / First-Person Investigator');
  const [ctaStyle, setCtaStyle] = useState<string>('Subtle Curiosity Hook / Join the Research Fleet');
  const [language, setLanguage] = useState<string>(project.language || 'English');

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('READY TO SYNTHESIZE');

  if (!isOpen) return null;

  const handleIdeaSelect = (id: string) => {
    playCockpitBeep('click');
    setSelectedIdeaId(id);
    const idea = (project.ideas || []).find((i) => i.id === id);
    if (idea) {
      setTopic(idea.title);
      setIdeaText(idea.concept || idea.coreConcept || '');
      setAudience(idea.targetAudience || audience);
      setPlatform(idea.recommendedPlatform || platform);
      setDuration(idea.estimatedDuration || duration);
    } else {
      setSelectedIdeaId('');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    playCockpitBeep('engage');
    setIsGenerating(true);
    setProgressPercent(15);
    setStatusText('COMPUTING STORY MODE FUSION MATRIX...');

    const stepInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 40) {
          setStatusText('SYNTHESIZING SCREENPLAY ACTS & SPOKEN NARRATION...');
          return prev + 15;
        } else if (prev < 75) {
          setStatusText('CALIBRATING VISUAL TELEMETRY & DIRECTOR CUES...');
          return prev + 15;
        } else if (prev < 90) {
          setStatusText('GENERATING SCENE BREAKDOWNS & SHOT LISTS...');
          return prev + 10;
        }
        return prev;
      });
    }, 250);

    try {
      const selectedIdea = (project.ideas || []).find((i) => i.id === selectedIdeaId);
      const settings: ScriptSettings = {
        topic: topic.trim(),
        ideaText: ideaText.trim() || undefined,
        audience,
        platform,
        duration,
        language,
        tone,
        narrationStyle,
        ctaStyle,
        primaryMode: project.primaryMode,
        secondaryModes: [project.secondaryMode],
      };

      const context = ContextEngine.buildScriptContext(project, settings, selectedIdea);
      const script = await AITaskRouter.generateScript(settings, context, selectedIdea);

      clearInterval(stepInterval);
      setProgressPercent(100);
      setStatusText('SYNTHESIS COMPLETE');
      playCockpitBeep('pulse');

      setTimeout(() => {
        onScriptGenerated(script);
        onClose();
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setStatusText(`SYNTHESIS FAILED: ${err.message || 'Unknown anomaly'}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <HoloPanel glow={true} className="flex flex-col h-full overflow-hidden p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-cyan-500/30 bg-cyan-950/40 rounded-lg text-cyan-400">
                <Film className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 tracking-wider">AUTONOMOUS SCRIPT SYNTHESIZER</span>
                  <StatusBadge status={isGenerating ? 'Processing' : 'Ready'} />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 tracking-wide mt-0.5">
                  GENERATE PRODUCTION SCREENPLAY
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isGenerating}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors disabled:opacity-40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* Quick Idea Picker */}
            {project.ideas && project.ideas.length > 0 && (
              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cyan-300 flex items-center gap-1.5 font-bold">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                    LINK TO SAVED VAULT IDEA (OPTIONAL)
                  </span>
                  {selectedIdeaId && (
                    <button
                      type="button"
                      onClick={() => handleIdeaSelect('')}
                      className="font-mono text-[10px] text-cyan-400 hover:underline"
                    >
                      CLEAR LINK
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {project.ideas.map((idea) => {
                    const isSelected = idea.id === selectedIdeaId;
                    return (
                      <button
                        key={idea.id}
                        type="button"
                        onClick={() => handleIdeaSelect(idea.id)}
                        className={`shrink-0 max-w-[260px] text-left p-2 rounded-lg border font-mono text-xs transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-100 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                          <span>{idea.recommendedPlatform || 'YouTube'}</span>
                          <span>{idea.estimatedDuration || '10 min'}</span>
                        </div>
                        <p className="font-bold truncate text-[11px]">{idea.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Core Script Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-mono text-xs text-slate-300 mb-1 font-bold">
                  SCRIPT TITLE OR LOGLINE PREMISE
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Signal Inside The Event Horizon"
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  CORE CONCEPT / SYNOPSIS SEED (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Additional context or dramatic turn..."
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  TARGET PLATFORM / MEDIUM
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="YouTube 4K">YouTube 4K Longform (8–15 min)</option>
                  <option value="Cinematic Short">Cinematic Short (0–60 sec)</option>
                  <option value="Documentary Episode">Documentary Episode (15–25 min)</option>
                  <option value="Audio Drama / Podcast">Audio Drama / Podcast (20–40 min)</option>
                  <option value="Feature Act I">Feature Screenplay Act I</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  TARGET DURATION
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="3–5 minutes">3–5 minutes (Brisk, Punchy)</option>
                  <option value="8–12 minutes">8–12 minutes (Standard Deep Dive)</option>
                  <option value="15–20 minutes">15–20 minutes (Comprehensive Investigation)</option>
                  <option value="30+ minutes">30+ minutes (Feature / Speculative Masterclass)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  NARRATION VOICE CADENCE
                </label>
                <input
                  type="text"
                  value={narrationStyle}
                  onChange={(e) => setNarrationStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  DRAMATIC TONE
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  TARGET AUDIENCE
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-xs text-slate-300 mb-1">
                  CALL TO ACTION STYLE
                </label>
                <input
                  type="text"
                  value={ctaStyle}
                  onChange={(e) => setCtaStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950/90 border border-slate-700 rounded-lg font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Progress Bar when generating */}
            {isGenerating && (
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 flex items-center gap-2">
                    <Radio className="w-4 h-4 animate-spin text-cyan-400" />
                    {statusText}
                  </span>
                  <span className="text-cyan-300 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">
                Story Mode Fusion: <strong className="text-cyan-400">{project.primaryMode} + {project.secondaryMode}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white"
                >
                  CANCEL
                </button>
                <GlowButton
                  type="submit"
                  size="md"
                  variant="primary"
                  disabled={isGenerating || !topic.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>{isGenerating ? 'SYNTHESIZING SCRIPT...' : 'ENGAGE AI SCRIPT SYNTHESIS'}</span>
                </GlowButton>
              </div>
            </div>
          </form>
        </HoloPanel>
      </motion.div>
    </div>
  );
};
