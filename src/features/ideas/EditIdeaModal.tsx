import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit3, Save } from 'lucide-react';
import { Idea } from '../../types';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { useTheme } from '../../theme/ThemeContext';

interface EditIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: Idea | null;
  onSave: (updated: Partial<Idea>) => void;
}

export const EditIdeaModal: React.FC<EditIdeaModalProps> = ({
  isOpen,
  onClose,
  idea,
  onSave,
}) => {
  const { playCockpitBeep } = useTheme();

  const [title, setTitle] = useState(idea?.title || '');
  const [hook, setHook] = useState(idea?.hook || '');
  const [concept, setConcept] = useState(idea?.concept || '');
  const [uniqueAngle, setUniqueAngle] = useState(idea?.uniqueAngle || '');
  const [thumbnailConcept, setThumbnailConcept] = useState(idea?.thumbnailConcept || '');
  const [keywords, setKeywords] = useState((idea?.keywords || []).join(', '));

  React.useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setHook(idea.hook);
      setConcept(idea.concept || idea.coreConcept || '');
      setUniqueAngle(idea.uniqueAngle || idea.angle || '');
      setThumbnailConcept(idea.thumbnailConcept || '');
      setKeywords((idea.keywords || []).join(', '));
    }
  }, [idea]);

  if (!isOpen || !idea) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playCockpitBeep('engage');
    onSave({
      title,
      hook,
      concept,
      coreConcept: concept,
      uniqueAngle,
      angle: uniqueAngle,
      thumbnailConcept,
      keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="edit-idea-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="edit-idea-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <HoloPanel glow={true} className="flex flex-col h-full overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-cyan-500/30 bg-cyan-950/40 rounded-lg text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs text-cyan-400 tracking-wider">MANUAL REFINEMENT</span>
                  <h3 className="font-mono text-base font-bold text-slate-100 tracking-wide">
                    Edit Concept Parameters
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">CONCEPT TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">SPOKEN HOOK (0-5s RETENTION TRIGGER)</label>
                <textarea
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">CORE CONCEPT & SYNOPSIS</label>
                <textarea
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-sans text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">UNIQUE ANGLE / DIFFERENTIATION</label>
                <textarea
                  value={uniqueAngle}
                  onChange={(e) => setUniqueAngle(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-sans text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">THUMBNAIL VISUAL CONCEPT</label>
                <input
                  type="text"
                  value={thumbnailConcept}
                  onChange={(e) => setThumbnailConcept(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-mono text-slate-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">KEYWORDS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded font-mono text-slate-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
                <GlowButton variant="secondary" onClick={onClose} type="button">
                  CANCEL
                </GlowButton>
                <GlowButton variant="primary" type="submit">
                  <Save className="w-4 h-4 mr-1.5" />
                  SAVE CHANGES
                </GlowButton>
              </div>
            </form>
          </HoloPanel>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
