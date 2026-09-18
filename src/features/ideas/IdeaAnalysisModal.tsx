import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Compass, 
  Layers, 
  Film 
} from 'lucide-react';
import { Idea, IdeaAnalysis } from '../../types';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTheme } from '../../theme/ThemeContext';

interface IdeaAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  analysis: IdeaAnalysis | null;
  isLoading: boolean;
  onExpandToScript: (idea: Idea) => void;
}

export const IdeaAnalysisModal: React.FC<IdeaAnalysisModalProps> = ({
  isOpen,
  onClose,
  idea,
  analysis,
  isLoading,
  onExpandToScript,
}) => {
  const { playCockpitBeep } = useTheme();
  const [copiedTitle, setCopiedTitle] = React.useState<string | null>(null);

  if (!isOpen || !idea) return null;

  const handleCopyTitle = (title: string) => {
    playCockpitBeep('click');
    navigator.clipboard.writeText(title);
    setCopiedTitle(title);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  return (
    <AnimatePresence>
      <div 
        id="idea-analysis-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="idea-analysis-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <HoloPanel glow={true} className="flex flex-col h-full overflow-hidden p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-cyan-500/30 bg-cyan-950/40 rounded-lg text-cyan-400">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 tracking-wider">EXECUTIVE STRATEGIC AUDIT</span>
                    <StatusBadge status="Ready" />
                  </div>
                  <h3 className="font-mono text-lg font-bold text-slate-100 tracking-wide mt-0.5 line-clamp-1">
                    {idea.title}
                  </h3>
                </div>
              </div>
              <button
                id="close-analysis-modal-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  <p className="font-mono text-sm text-cyan-400 tracking-widest animate-pulse">
                    RUNNING STRATEGIC AUDIT & ALGORITHMIC DIAGNOSTICS...
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    Evaluating retention probability, competitive positioning, and viewer psychology...
                  </p>
                </div>
              ) : analysis ? (
                <>
                  {/* Executive Overview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Why It Works */}
                    <div className="p-4 rounded-lg bg-slate-900/60 border border-cyan-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>WHY THIS HOOK & PREMISE WORKS</span>
                      </div>
                      <p className="font-sans text-sm text-slate-200 leading-relaxed">
                        {analysis.whyItWorks}
                      </p>
                    </div>

                    {/* Target Viewer & Psychology */}
                    <div className="p-4 rounded-lg bg-slate-900/60 border border-cyan-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-wider">
                        <Target className="w-4 h-4" />
                        <span>TARGET AUDIENCE PSYCHOLOGY</span>
                      </div>
                      <p className="font-sans text-sm text-slate-200 leading-relaxed">
                        {analysis.targetAudienceAnalysis || analysis.targetViewer}
                      </p>
                    </div>
                  </div>

                  {/* Strongest Angle & Differentiation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider">
                        <Compass className="w-4 h-4" />
                        <span>STRONGEST NARRATIVE ANGLE</span>
                      </div>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {analysis.strongestAngle}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider">
                        <Layers className="w-4 h-4" />
                        <span>MARKET DIFFERENTIATION</span>
                      </div>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed">
                        {analysis.differentiation}
                      </p>
                    </div>
                  </div>

                  {/* Potential Weaknesses & Fixes */}
                  {analysis.potentialWeaknesses && analysis.potentialWeaknesses.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        <span>ALGORITHMIC VULNERABILITIES & RETENTION RISKS</span>
                      </div>
                      <ul className="space-y-1.5 font-sans text-sm text-slate-300">
                        {analysis.potentialWeaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-mono text-xs mt-0.5">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimized Hook & Angle Upgrades */}
                  <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                    <div className="text-cyan-400 font-mono text-xs tracking-wider flex items-center justify-between">
                      <span>HIGH-RETENTION SPOKEN HOOK UPGRADE</span>
                      <span className="text-slate-400 text-[11px]">Recommended Length: {analysis.recommendedDuration}</span>
                    </div>
                    <blockquote className="p-3 bg-slate-950/60 border-l-2 border-cyan-400 font-mono text-sm text-cyan-200 italic">
                      {analysis.betterHook}
                    </blockquote>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-cyan-400 font-mono">ANGLE PIVOT:</span>
                      <span>{analysis.betterAngle}</span>
                    </div>
                  </div>

                  {/* Suggested Alternative Titles */}
                  {analysis.suggestedTitles && analysis.suggestedTitles.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-slate-400 font-mono text-xs tracking-wider">
                        HIGH-CTR TITLE CANDIDATES
                      </div>
                      <div className="space-y-2">
                        {analysis.suggestedTitles.map((t, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-3 rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                          >
                            <span className="font-mono text-sm text-slate-200">{t}</span>
                            <button
                              onClick={() => handleCopyTitle(t)}
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-cyan-400 hover:bg-cyan-950/50 rounded transition-colors"
                            >
                              {copiedTitle === t ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">COPIED</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>COPY</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thumbnail & SEO Direction */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <span className="font-mono text-cyan-400 tracking-wider">THUMBNAIL CREATIVE DIRECTION</span>
                      <p className="text-slate-300 font-sans mt-1">{analysis.thumbnailDirection}</p>
                    </div>
                    <div className="p-3.5 rounded bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <span className="font-mono text-emerald-400 tracking-wider">SEARCH & ALGORITHMIC POSITIONING</span>
                      <p className="text-slate-300 font-sans mt-1">{analysis.seoDirection}</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-cyan-500/20">
              <span className="font-mono text-xs text-slate-400">
                AUDIT ENGINE: DARK MATTER TELEMETRY V2.4
              </span>
              <div className="flex items-center gap-3">
                <GlowButton variant="secondary" onClick={onClose}>
                  CLOSE AUDIT
                </GlowButton>
                <GlowButton 
                  variant="primary" 
                  onClick={() => {
                    onClose();
                    onExpandToScript(idea);
                  }}
                >
                  <Film className="w-4 h-4 mr-1.5" />
                  EXPAND INTO SCRIPT
                </GlowButton>
              </div>
            </div>
          </HoloPanel>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
