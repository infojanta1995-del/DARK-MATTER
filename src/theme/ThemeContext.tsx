import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor, PerformanceLevel, ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  accent: AccentColor;
  performance: PerformanceLevel;
  soundEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setPerformance: (level: PerformanceLevel) => void;
  setSoundEnabled: (enabled: boolean) => void;
  playCockpitBeep: (type?: 'click' | 'pulse' | 'alert' | 'engage') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('dm_theme') as ThemeMode) || 'dark';
  });

  const [accent, setAccent] = useState<AccentColor>(() => {
    return (localStorage.getItem('dm_accent') as AccentColor) || 'cyan';
  });

  const [performance, setPerformance] = useState<PerformanceLevel>(() => {
    return (localStorage.getItem('dm_perf') as PerformanceLevel) || 'high';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('dm_sound') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dm_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('dm_accent', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('dm_perf', performance);
  }, [performance]);

  useEffect(() => {
    localStorage.setItem('dm_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Subtle web audio synthesizer for futuristic mission control audio feedback (optional, pleasant, minimal)
  const playCockpitBeep = (type: 'click' | 'pulse' | 'alert' | 'engage' = 'click') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'pulse') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'engage') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.18);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accent,
        performance,
        soundEnabled,
        setTheme,
        setAccent,
        setPerformance,
        setSoundEnabled,
        playCockpitBeep,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
