import React from 'react';
import { GlowButton } from './GlowButton';
import { AlertCircle, Disc, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'project' | 'story' | 'media' | 'generic';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'NO ACTIVE PROJECT',
  description = 'The Project Core is waiting for mission initialization.',
  actionLabel = 'CREATE PROJECT',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-[var(--dm-border)] rounded-2xl bg-[var(--dm-surface)] backdrop-blur-sm max-w-lg mx-auto my-8">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full border border-[var(--dm-accent-border)] bg-[var(--dm-surface-elevated)] flex items-center justify-center shadow-[0_0_20px_var(--dm-accent-soft)]">
          <Disc className="w-8 h-8 text-[var(--dm-accent)] animate-spin-slow" />
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--dm-accent)] animate-pulse" />
      </div>

      <span className="font-mono text-[10px] tracking-widest text-[var(--dm-accent)] mb-1 uppercase">
        // TELEMETRY: STANDBY
      </span>
      <h3 className="font-display text-lg font-bold tracking-wider text-[var(--dm-text)] mb-2 uppercase">
        {title}
      </h3>
      <p className="text-sm text-[var(--dm-text-secondary)] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <GlowButton
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onAction}
        >
          {actionLabel}
        </GlowButton>
      )}
    </div>
  );
};

export const ErrorNotice: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = 'This module could not be initialized. Sensor connection timeout.',
  onRetry,
}) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-200">
      <div className="p-2 rounded-lg bg-rose-900/30 border border-rose-500/50 shrink-0 text-rose-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs tracking-wider uppercase font-bold text-rose-300">
            SYSTEM NOTICE
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-rose-900/50 text-rose-300">
            STATUS: ERROR
          </span>
        </div>
        <p className="text-xs text-rose-200/80 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-xs font-mono tracking-wider uppercase underline underline-offset-4 text-rose-300 hover:text-white"
          >
            [ RETRY INITIALIZATION ]
          </button>
        )}
      </div>
    </div>
  );
};
