import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp?: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          const isSuccess = toast.type === 'success';

          const borderColor = isError
            ? 'border-red-500/60 bg-red-950/80 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : isWarning
            ? 'border-amber-500/60 bg-amber-950/80 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
            : isSuccess
            ? 'border-emerald-500/60 bg-emerald-950/80 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'border-cyan-500/60 bg-cyan-950/80 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.3)]';

          const iconColor = isError
            ? 'text-red-400'
            : isWarning
            ? 'text-amber-400'
            : isSuccess
            ? 'text-emerald-400'
            : 'text-cyan-400';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border backdrop-blur-md ${borderColor}`}
            >
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                {isError ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold font-mono tracking-wider uppercase">
                    {toast.title}
                  </h4>
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="p-1 -mr-1 text-slate-400 hover:text-white rounded transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words font-sans">
                  {toast.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
