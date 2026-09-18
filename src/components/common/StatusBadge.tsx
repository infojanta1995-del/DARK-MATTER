import React from 'react';
import { StageStatus } from '../../types';

interface StatusBadgeProps {
  status: StageStatus | 'Draft' | 'Approved' | 'In Production' | 'Rendered' | 'Ready' | 'Saved' | 'Queued' | 'Processing' | 'Failed' | 'Required';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'completed':
      case 'Ready':
      case 'Saved':
      case 'Approved':
      case 'Rendered':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]',
          pulse: false,
        };
      case 'in-progress':
      case 'Processing':
      case 'In Production':
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500/50',
          text: 'text-cyan-400',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
          pulse: true,
        };
      case 'Queued':
      case 'pending':
      case 'Required':
      case 'Draft':
        return {
          bg: 'bg-slate-900/60',
          border: 'border-slate-700/60',
          text: 'text-slate-400',
          dot: 'bg-slate-500',
          pulse: false,
        };
      case 'blocked':
      case 'Failed':
        return {
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/50',
          text: 'text-rose-400',
          dot: 'bg-rose-400 shadow-[0_0_6px_#f43f5e]',
          pulse: false,
        };
      default:
        return {
          bg: 'bg-slate-900/60',
          border: 'border-slate-700/60',
          text: 'text-slate-400',
          dot: 'bg-slate-500',
          pulse: false,
        };
    }
  };

  const style = getBadgeStyle();
  const formatLabel = (val: string) => {
    if (val === 'in-progress') return 'IN PROGRESS';
    return val.toUpperCase();
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border font-mono uppercase tracking-wider
        ${size === 'sm' ? 'px-1.5 py-0.5 text-[9px] gap-1' : 'px-2.5 py-1 text-[10px] gap-1.5'}
        ${style.bg} ${style.border} ${style.text}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${style.pulse ? 'animate-ping' : ''}`}
      />
      <span>{formatLabel(status)}</span>
    </span>
  );
};
