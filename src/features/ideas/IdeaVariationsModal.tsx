import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Layers, 
  Sparkles, 
  BookmarkPlus, 
  Check, 
  HelpCircle, 
  Wrench, 
  BookOpen, 
  Flame, 
  GraduationCap 
} from 'lucide-react';
import { Idea, IdeaVariation } from '../../types';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTheme } from '../../theme/ThemeContext';

interface IdeaVariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  variations: IdeaVariation[];
  isLoading: boolean;
  onSaveVariationAsIdea: (variation: IdeaVariation) => void;
}

export const IdeaVariationsModal: React.FC<IdeaVariationsModalProps> = ({
  isOpen,
  onClose,
  idea,
  variations,
  isLoading,
  onSaveVariationAsIdea,
}) => {
  const { playCockpitBeep } = useTheme();
  const [savedAngles, setSavedAngles] = React.useState<Record<string, boolean>>({});

  if (!isOpen || !idea) return null;

  const handleSave = (variation: IdeaVariation) => {
    playCockpitBeep('engage');
    onSaveVariationAsIdea(variation);
    setSavedAngles((prev) => ({ ...prev, [variation.angleType]: true }));
  };

  const getAngleIcon = (type: IdeaVariation['angleType']) => {
    switch (type) {
      case 'Curiosity':
        return <HelpCircle className="w-4 h-4 text-cyan-400" />;
      case 'Problem/Solution':
        return <Wrench className="w-4 h-4 text-emerald-400" />;
      case 'Story':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Contrarian':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Educational':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getAngleColor = (type: IdeaVariation['angleType']) => {
    switch (type) {
      case 'Curiosity':
        return 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400';
      case 'Problem/Solution':
        return 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
      case 'Story':
        return 'border-amber-500/30 bg-amber-950/20 text-amber-400';
      case 'Contrarian':
        return 'border-rose-500/30 bg-rose-950/20 text-rose-400';
      case 'Educational':
        return 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400';
      default:
        return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="idea-variations-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="idea-variations-modal-content"
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
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 tracking-wider">CREATIVE MULTIPLIER MATRIX</span>
                    <StatusBadge status="Ready" />
                  </div>
                  <h3 className="font-mono text-lg font-bold text-slate-100 tracking-wide mt-0.5 line-clamp-1">
                    Multiplied Angles for: {idea.title}
                  </h3>
                </div>
              </div>
              <button
                id="close-variations-modal-btn"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                  <p className="font-mono text-sm text-cyan-400 tracking-widest animate-pulse">
                    CALIBRATING 5 DISTINCT ANGLE VECTORS...
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    Synthesizing Curiosity, Problem/Solution, Narrative, Contrarian, and Educational trajectories...
                  </p>
                </div>
              ) : (
                variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-semibold ${getAngleColor(v.angleType)}`}>
                          {getAngleIcon(v.angleType)}
                          <span>{v.angleType.toUpperCase()} ANGLE</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSave(v)}
                        disabled={savedAngles[v.angleType]}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-colors ${
                          savedAngles[v.angleType]
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60'
                        }`}
                      >
                        {savedAngles[v.angleType] ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>VAULTED AS NEW IDEA</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>VAULT AS SEPARATE IDEA</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <h4 className="font-mono text-sm font-bold text-slate-100">{v.title}</h4>
                      <p className="font-mono text-xs text-cyan-300 italic mt-1">"{v.hook}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-mono text-slate-400 block mb-1">CONCEPT EXECUTION:</span>
                        <p className="text-slate-300 font-sans">{v.concept}</p>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-mono text-slate-400 block mb-1">STRATEGIC RATIONALE:</span>
                        <p className="text-slate-300 font-sans">{v.rationale}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-cyan-500/20">
              <span className="font-mono text-xs text-slate-400">
                TOTAL ANGLE VARIATIONS: 5 MATRICES GENERATED
              </span>
              <GlowButton variant="secondary" onClick={onClose}>
                DISMISS
              </GlowButton>
            </div>
          </HoloPanel>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
