import React from 'react';

interface HoloPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  corners?: boolean;
  glow?: boolean;
  compact?: boolean;
  id?: string;
}

export const HoloPanel: React.FC<HoloPanelProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerRight,
  corners = true,
  glow = false,
  compact = false,
  id,
}) => {
  return (
    <div
      id={id}
      className={`
        relative rounded-xl border border-[var(--dm-border)] 
        bg-[var(--dm-surface)] backdrop-blur-md transition-all duration-200
        ${glow ? 'shadow-[0_0_24px_var(--dm-accent-soft)] border-[var(--dm-accent-border)]' : ''}
        ${corners ? 'hud-corner-tl hud-corner-br' : ''}
        ${className}
      `}
    >
      {/* Subtle top edge glow bar */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[var(--dm-border-bright)] to-transparent opacity-60 pointer-events-none" />

      {(title || headerRight) && (
        <div className={`flex items-center justify-between border-b border-[var(--dm-divider)] ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}>
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-accent)] shadow-[0_0_6px_var(--dm-accent)]" />
            <div>
              {title && (
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--dm-text)] flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-mono text-[10px] text-[var(--dm-muted)] uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerRight && <div className="flex items-center space-x-2">{headerRight}</div>}
        </div>
      )}

      <div className={compact ? 'p-3' : 'p-4'}>{children}</div>
    </div>
  );
};
