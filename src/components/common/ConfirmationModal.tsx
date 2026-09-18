import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, Check, X } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM DIRECTIVE',
  cancelLabel = 'ABORT',
  isDanger = false,
  onConfirm,
  onCancel,
}) => {
  const { playCockpitBeep } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playCockpitBeep('click');
            onCancel();
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-md p-6 rounded-xl border bg-slate-950/95 shadow-2xl backdrop-blur-xl ${
            isDanger
              ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
              : 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
          }`}
        >
          {/* Cockpit corner deco */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/60" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-cyan-400/60" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-cyan-400/60" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-400/60" />

          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg border ${
                isDanger
                  ? 'border-red-500/40 bg-red-950/50 text-red-400'
                  : 'border-cyan-500/40 bg-cyan-950/50 text-cyan-400'
              }`}
            >
              {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300 font-sans">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                playCockpitBeep('click');
                onCancel();
              }}
              className="px-4 py-2 text-xs font-mono tracking-wider rounded border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                <span>{cancelLabel}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                playCockpitBeep(isDanger ? 'engage' : 'click');
                onConfirm();
              }}
              className={`px-4 py-2 text-xs font-mono font-semibold tracking-wider rounded border transition-all ${
                isDanger
                  ? 'border-red-500 bg-red-600/30 text-red-200 hover:bg-red-600/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'border-cyan-500 bg-cyan-600/30 text-cyan-200 hover:bg-cyan-600/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{confirmLabel}</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
