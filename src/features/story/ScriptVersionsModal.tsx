import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Script } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { 
  History, 
  X, 
  RotateCcw, 
  Plus, 
  Bookmark, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';

interface ScriptVersionsModalProps {
  isOpen: boolean;
  script: Script;
  onClose: () => void;
  onSaveVersion: (note: string) => void;
  onRestoreVersion: (versionNumber: number) => void;
}

export const ScriptVersionsModal: React.FC<ScriptVersionsModalProps> = ({
  isOpen,
  script,
  onClose,
  onSaveVersion,
  onRestoreVersion,
}) => {
  const { playCockpitBeep } = useTheme();

  const [newVersionNote, setNewVersionNote] = useState('');
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | null>(
    script.currentVersionNumber || null
  );

  if (!isOpen) return null;

  const handleTakeSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionNote.trim()) return;
    playCockpitBeep('engage');
    onSaveVersion(newVersionNote.trim());
    setNewVersionNote('');
    setIsSnapshotting(false);
  };

  const handleRestore = (verNum: number) => {
    playCockpitBeep('pulse');
    onRestoreVersion(verNum);
    onClose();
  };

  const selectedVersion = script.versions.find((v) => v.versionNumber === selectedVersionNumber);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <HoloPanel glow={true} className="flex flex-col h-full overflow-hidden p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-cyan-500/30 bg-cyan-950/40 rounded-lg text-cyan-400">
                <History className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 tracking-wider">VERSION CHRONOLOGY & ROLLBACK</span>
                  <StatusBadge status="Ready" />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 tracking-wide mt-0.5">
                  VERSIONS FOR: {script.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Left side list of versions, Right side preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Version List */}
            <div className="md:col-span-1 space-y-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300 font-bold">SNAPSHOT LOG</span>
                <button
                  onClick={() => setIsSnapshotting(!isSnapshotting)}
                  className="font-mono text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> SNAPSHOT
                </button>
              </div>

              {isSnapshotting && (
                <form onSubmit={handleTakeSnapshot} className="p-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Version summary note (e.g. Cut 30s off hook)..."
                    value={newVersionNote}
                    onChange={(e) => setNewVersionNote(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-700 bg-slate-950 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSnapshotting(false)}
                      className="px-2 py-0.5 text-[10px] text-slate-400 font-mono"
                    >
                      CANCEL
                    </button>
                    <GlowButton type="submit" size="sm" variant="primary">
                      SAVE
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {script.versions && script.versions.length > 0 ? (
                  script.versions.map((ver) => {
                    const isSelected = ver.versionNumber === selectedVersionNumber;
                    const isCurrent = ver.versionNumber === script.currentVersionNumber;

                    return (
                      <div
                        key={ver.versionNumber}
                        onClick={() => {
                          playCockpitBeep('click');
                          setSelectedVersionNumber(ver.versionNumber);
                        }}
                        className={`p-3 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-cyan-300">
                            v{ver.versionNumber}.0
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-200 line-clamp-2 mb-1">
                          {ver.summaryNote || 'Autonomous snapshot'}
                        </p>
                        <div className="flex items-center justify-between text-[9px] text-slate-400">
                          <span>{ver.sections?.length || 0} sections</span>
                          <span>{ver.timestamp?.slice(0, 10)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No prior snapshots recorded. Click "SNAPSHOT" to freeze this version.
                  </div>
                )}
              </div>
            </div>

            {/* Version Preview */}
            <div className="md:col-span-2 flex flex-col border border-slate-800 rounded-xl bg-slate-950/60 p-4 overflow-hidden">
              {selectedVersion ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>VERSION {selectedVersion.versionNumber}.0</span>
                        <span className="text-xs font-normal text-slate-400">({selectedVersion.timestamp})</span>
                      </h4>
                      <p className="text-xs text-cyan-400/90 font-mono mt-0.5">
                        Note: {selectedVersion.summaryNote || 'Initial generation draft'}
                      </p>
                    </div>

                    {selectedVersion.versionNumber !== script.currentVersionNumber && (
                      <GlowButton
                        size="sm"
                        variant="primary"
                        onClick={() => handleRestore(selectedVersion.versionNumber)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        RESTORE THIS VERSION
                      </GlowButton>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
                    {selectedVersion.sections?.map((sec, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-1.5">
                        <div className="flex justify-between text-[11px] text-cyan-400 font-bold border-b border-slate-800 pb-1">
                          <span>{sec.name}</span>
                          <span className="text-slate-400">{sec.targetDuration}</span>
                        </div>
                        {sec.narration && (
                          <p className="text-slate-200 text-xs leading-relaxed font-sans">
                            {sec.narration}
                          </p>
                        )}
                        {sec.visualDescription && (
                          <p className="text-[11px] text-indigo-300 italic">
                            Cue: {sec.visualDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-mono text-slate-500">
                  Select a version on the left to preview content and roll back.
                </div>
              )}
            </div>
          </div>
        </HoloPanel>
      </motion.div>
    </div>
  );
};
