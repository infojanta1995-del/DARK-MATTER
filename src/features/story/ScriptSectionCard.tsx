import React, { useState } from 'react';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { ScriptSection, AISectionAction } from '../../types';
import { AITaskRouter } from '../../core/ai/AITaskRouter';
import { useTheme } from '../../theme/ThemeContext';
import { 
  Wand2, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Eye, 
  Mic, 
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ScriptSectionCardProps {
  section: ScriptSection;
  index: number;
  totalSections: number;
  onUpdate: (updatedSection: ScriptSection) => void;
  onDelete: (sectionId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  context?: Record<string, any>;
}

const AI_ACTIONS: { id: AISectionAction; label: string; desc: string }[] = [
  { id: 'improve_hook', label: 'Hook Maximizer', desc: 'Sharpen opening words for 90%+ retention' },
  { id: 'shorten', label: 'Condense & Tighten', desc: 'Cut excess filler by 25%' },
  { id: 'expand', label: 'Elaborate & Deepen', desc: 'Add speculative depth and context' },
  { id: 'conversational', label: 'Conversational', desc: 'Make dialogue flow like natural human speech' },
  { id: 'energetic', label: 'Dynamic & Urgent', desc: 'Elevate pacing and tension' },
  { id: 'professional', label: 'Scientific Cadence', desc: 'Calibrate rigorous hard-science tone' },
  { id: 'simplify', label: 'Simplify Concepts', desc: 'Clarify dense astrophysics ideas' },
  { id: 'add_examples', label: 'Concrete Analogies', desc: 'Insert vivid mental images and metaphors' },
  { id: 'remove_repetition', label: 'Purge Redundancy', desc: 'Eliminate duplicate thoughts and tropes' },
  { id: 'improve_flow', label: 'Smooth Transitions', desc: 'Connect beats with natural narrative momentum' },
  { id: 'alternative_angle', label: 'Contrarian Flip', desc: 'Reframe section with unexpected perspective' },
  { id: 'rewrite', label: 'Fresh Rewrite', desc: 'Regenerate whole beat from scratch' },
];

export const ScriptSectionCard: React.FC<ScriptSectionCardProps> = ({
  section,
  index,
  totalSections,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  context,
}) => {
  const { playCockpitBeep } = useTheme();

  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AISectionAction>('improve_hook');
  const [showAiToolbar, setShowAiToolbar] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute word count
  const wordCount = (section.narration || section.content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // Approx reading speed: 140 words per min
  const estSeconds = Math.round((wordCount / 140) * 60);
  const estTimeFormatted = `${Math.floor(estSeconds / 60)}m ${estSeconds % 60}s`;

  const handleCopy = () => {
    playCockpitBeep('click');
    navigator.clipboard.writeText(section.narration || section.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteAiRewrite = async (action: AISectionAction) => {
    playCockpitBeep('engage');
    setIsRewriting(true);

    try {
      const currentText = section.narration || section.content;
      const rewritten = await AITaskRouter.rewriteSection(section.name, currentText, action, context);

      onUpdate({
        ...section,
        narration: rewritten,
        content: rewritten,
        wordCount: rewritten.trim().split(/\s+/).filter(Boolean).length,
      });

      playCockpitBeep('pulse');
    } catch (err) {
      console.error('Section rewrite error:', err);
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <HoloPanel glow={false} className="p-4 space-y-3 border-slate-800/80 bg-slate-950/70 hover:border-cyan-500/40 transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/40">
            ACT {index + 1}
          </span>
          <input
            type="text"
            value={section.name}
            onChange={(e) => onUpdate({ ...section, name: e.target.value })}
            className="font-mono text-xs font-bold text-slate-100 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none px-1"
          />
        </div>

        {/* Section Actions */}
        <div className="flex items-center gap-1.5">
          {/* Word Count / Duration Pill */}
          <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            {wordCount} words ({estTimeFormatted})
          </span>

          {/* AI Rewrite Quick Trigger */}
          <button
            onClick={() => setShowAiToolbar(!showAiToolbar)}
            className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-all ${
              showAiToolbar
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">AI REWRITE</span>
          </button>

          {/* Copy Narration */}
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
            title="Copy Spoken Narration"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Reordering */}
          <button
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
            title="Move Section Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={index === totalSections - 1}
            onClick={() => onMoveDown(index)}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
            title="Move Section Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Delete Section */}
          <button
            onClick={() => onDelete(section.id)}
            className="p-1 rounded text-slate-500 hover:text-rose-400"
            title="Delete Section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* AI Rewrite Toolbar (Collapsible) */}
      {showAiToolbar && (
        <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1 font-bold">
              <Wand2 className="w-3.5 h-3.5" /> AI SECTION SURGICAL REWRITER
            </span>
            <span className="text-[10px] text-slate-400">12 Precision Calibrations</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {AI_ACTIONS.map((act) => (
              <button
                key={act.id}
                disabled={isRewriting}
                onClick={() => handleExecuteAiRewrite(act.id)}
                className="text-left p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-cyan-400/60 hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 transition-all font-mono text-[11px] disabled:opacity-40"
                title={act.desc}
              >
                <div className="font-bold truncate">{act.label}</div>
                <div className="text-[9px] text-slate-400 truncate">{act.desc}</div>
              </button>
            ))}
          </div>

          {isRewriting && (
            <div className="text-center font-mono text-xs text-cyan-400 py-1 animate-pulse">
              AI ENGINE IS RECALIBRATING SECTION BEATS...
            </div>
          )}
        </div>
      )}

      {/* Grid: Left: Spoken Narration, Right: Visual & Director Cues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Spoken Narration */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-bold">
            <Mic className="w-3 h-3 text-cyan-400" />
            SPOKEN NARRATION / VOICEOVER SCRIPT
          </label>
          <textarea
            rows={5}
            value={section.narration || section.content}
            onChange={(e) => onUpdate({ ...section, narration: e.target.value, content: e.target.value })}
            placeholder="Type spoken dialogue or voiceover lines..."
            className="w-full p-2.5 rounded-lg border border-slate-800 bg-black/80 font-mono text-xs text-slate-100 leading-relaxed focus:border-cyan-400 focus:outline-none resize-y"
          />
        </div>

        {/* Visual Cues & Director Notes */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-mono text-indigo-300 flex items-center gap-1 font-bold">
              <Eye className="w-3 h-3 text-indigo-400" />
              VISUAL DESCRIPTION / B-ROLL DIRECTION
            </label>
            <textarea
              rows={2}
              value={section.visualDescription || ''}
              onChange={(e) => onUpdate({ ...section, visualDescription: e.target.value })}
              placeholder="Camera movement, holographic UI overlays, lighting atmosphere..."
              className="w-full p-2 rounded-lg border border-slate-800 bg-slate-950/70 font-mono text-xs text-slate-200 focus:border-indigo-400 focus:outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-0.5">
                DIRECTOR PACING
              </label>
              <input
                type="text"
                value={section.pacing || 'Moderate / Dramatic Building'}
                onChange={(e) => onUpdate({ ...section, pacing: e.target.value })}
                className="w-full px-2 py-1 rounded border border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-0.5">
                EST. TARGET DURATION
              </label>
              <input
                type="text"
                value={section.targetDuration || '1m 15s'}
                onChange={(e) => onUpdate({ ...section, targetDuration: e.target.value })}
                className="w-full px-2 py-1 rounded border border-slate-800 bg-slate-950 text-[11px] font-mono text-slate-300 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </HoloPanel>
  );
};
