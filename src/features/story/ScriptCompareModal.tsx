import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Script, ScriptVersion } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import {
  GitCompare,
  X,
  RotateCcw,
  Calendar,
  Bookmark,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface ScriptCompareModalProps {
  isOpen: boolean;
  script: Script;
  onClose: () => void;
  onRestoreVersion?: (versionNumber: number) => void;
}

export const ScriptCompareModal: React.FC<ScriptCompareModalProps> = ({
  isOpen,
  script,
  onClose,
  onRestoreVersion,
}) => {
  const { playCockpitBeep } = useTheme();

  const versions = script.versions || [];
  const [baseVerNum, setBaseVerNum] = useState<number>(
    versions.length > 1 ? versions[versions.length - 2].versionNumber : versions[0]?.versionNumber || 1
  );
  const [targetVerNum, setTargetVerNum] = useState<number>(
    versions.length > 0 ? versions[versions.length - 1].versionNumber : 1
  );

  if (!isOpen) return null;

  const baseVersion = versions.find((v) => v.versionNumber === baseVerNum) || versions[0];
  const targetVersion = versions.find((v) => v.versionNumber === targetVerNum) || versions[versions.length - 1];

  const handleRollback = (verNum: number) => {
    playCockpitBeep('engage');
    onRestoreVersion?.(verNum);
    onClose();
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
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <HoloPanel glow={true} className="flex flex-col h-full overflow-hidden p-6 border border-cyan-500/40">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-cyan-500/30 bg-cyan-950/40 rounded-lg text-cyan-400">
                <GitCompare className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 tracking-wider">
                    SCRIPT VERSION DIFFERENTIAL AUDIT
                  </span>
                  <StatusBadge status="Ready" />
                </div>
                <h3 className="font-mono text-lg font-bold text-slate-100 tracking-wide mt-0.5">
                  COMPARING: {script.title}
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

          {/* Version Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            {/* Base Version */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">BASELINE:</span>
                <select
                  value={baseVerNum}
                  onChange={(e) => setBaseVerNum(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      v{v.versionNumber} — {v.note || 'Snapshot'} ({new Date(v.timestamp).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {baseVersion?.sections?.length || 0} SECTIONS
              </span>
            </div>

            {/* Target Version */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">COMPARISON:</span>
                <select
                  value={targetVerNum}
                  onChange={(e) => setTargetVerNum(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      v{v.versionNumber} — {v.note || 'Snapshot'} ({new Date(v.timestamp).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {targetVersion?.sections?.length || 0} SECTIONS
              </span>
            </div>
          </div>

          {/* Side-by-Side Content Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
            {/* Left: Base Version */}
            <div className="flex flex-col h-full overflow-hidden p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    VERSION {baseVersion?.versionNumber}: {baseVersion?.note}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500">
                    {baseVersion?.timestamp ? new Date(baseVersion.timestamp).toLocaleString() : 'Baseline'}
                  </div>
                </div>
                {onRestoreVersion && (
                  <GlowButton
                    size="sm"
                    variant="outline"
                    icon={<RotateCcw className="w-3 h-3" />}
                    onClick={() => handleRollback(baseVersion?.versionNumber || 1)}
                  >
                    ROLLBACK TO v{baseVersion?.versionNumber}
                  </GlowButton>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {baseVersion?.sections?.map((sec, idx) => (
                  <div key={sec.id || idx} className="p-3 rounded-lg bg-black/40 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-cyan-300">
                        {sec.sequence}. {sec.heading || sec.title || 'SECTION'}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500">{sec.type || 'Beat'}</span>
                    </div>
                    <p className="font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Target Version */}
            <div className="flex flex-col h-full overflow-hidden p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    VERSION {targetVersion?.versionNumber}: {targetVersion?.note}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500">
                    {targetVersion?.timestamp ? new Date(targetVersion.timestamp).toLocaleString() : 'Target'}
                  </div>
                </div>
                {onRestoreVersion && (
                  <GlowButton
                    size="sm"
                    variant="primary"
                    icon={<RotateCcw className="w-3 h-3" />}
                    onClick={() => handleRollback(targetVersion?.versionNumber || 1)}
                  >
                    RESTORE v{targetVersion?.versionNumber}
                  </GlowButton>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {targetVersion?.sections?.map((sec, idx) => {
                  const baseSec = baseVersion?.sections?.find((s) => s.sequence === sec.sequence);
                  const isModified = !baseSec || baseSec.content !== sec.content;
                  return (
                    <div
                      key={sec.id || idx}
                      className={`p-3 rounded-lg text-xs transition-colors ${
                        isModified
                          ? 'bg-amber-950/30 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                          : 'bg-black/40 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                          {sec.sequence}. {sec.heading || sec.title || 'SECTION'}
                          {isModified && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 py-0.2 rounded font-mono font-bold">
                              DIFF DETECTED
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">{sec.type || 'Beat'}</span>
                      </div>
                      <p className="font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>COMPARING v{baseVerNum} AGAINST v{targetVerNum}</span>
            <GlowButton variant="outline" size="sm" onClick={onClose}>
              CLOSE AUDIT
            </GlowButton>
          </div>
        </HoloPanel>
      </motion.div>
    </div>
  );
};
