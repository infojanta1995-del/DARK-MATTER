import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  sound?: 'click' | 'pulse' | 'engage' | 'alert';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  sound = 'click',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const { playCockpitBeep } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    playCockpitBeep(sound);
    onClick?.(e);
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-xs px-4 py-2 h-9 gap-2',
    lg: 'text-sm px-6 py-2.5 h-11 gap-2.5 font-medium',
  };

  const variantStyles = {
    primary: `
      bg-[var(--dm-accent)] text-black font-semibold
      shadow-[0_0_15px_var(--dm-accent-soft)]
      hover:shadow-[0_0_22px_var(--dm-accent-glow)] hover:brightness-110
      active:scale-[0.98] border border-[var(--dm-accent)]
    `,
    secondary: `
      bg-[var(--dm-surface-elevated)] text-[var(--dm-text)]
      border border-[var(--dm-border)]
      hover:border-[var(--dm-accent-border)] hover:bg-[var(--dm-surface-hover)]
      hover:shadow-[0_0_14px_var(--dm-accent-soft)]
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent text-[var(--dm-accent)]
      border border-[var(--dm-accent-border)]
      hover:bg-[var(--dm-accent-soft)] hover:shadow-[0_0_16px_var(--dm-accent-soft)]
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-[var(--dm-text-secondary)]
      hover:text-[var(--dm-text)] hover:bg-[var(--dm-surface-hover)]
      active:scale-[0.98]
    `,
    danger: `
      bg-red-950/40 text-red-300 border border-red-500/50
      hover:bg-red-900/60 hover:shadow-[0_0_16px_rgba(239,68,68,0.4)]
      active:scale-[0.98]
    `,
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center rounded-lg font-display tracking-wider uppercase
        transition-all duration-150 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed
        focus:outline-none focus:ring-1 focus:ring-[var(--dm-accent)]
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
