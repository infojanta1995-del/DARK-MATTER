import React from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { ModuleId } from '../../types';
import { 
  PlusCircle, 
  TrendingUp, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Clapperboard, 
  Film,
  ArrowUpRight
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetModule?: ModuleId;
  isCreateAction?: boolean;
  icon: React.ElementType;
  badge?: string;
}

const ACTIONS: QuickAction[] = [
  {
    id: 'new-project',
    title: 'NEW PROJECT',
    subtitle: 'MISSION INITIALIZATION',
    description: 'Launch an interstellar content production workspace from scratch.',
    isCreateAction: true,
    icon: PlusCircle,
    badge: 'CREATE',
  },
  {
    id: 'trend-scan',
    title: 'TREND SCAN',
    subtitle: 'COGNITIVE SENSOR ARRAY',
    description: 'Discover relevant topics, audience gravity, and content voids.',
    targetModule: 'trends',
    icon: TrendingUp,
    badge: 'RADAR',
  },
  {
    id: 'idea-gen',
    title: 'IDEA GENERATOR',
    subtitle: 'QUANTUM SYNTHESIS',
    description: 'Synthesize high-gravity hooks and multi-angle narrative concepts.',
    targetModule: 'ideas',
    icon: Sparkles,
  },
  {
    id: 'story-engine',
    title: 'STORY ENGINE',
    subtitle: 'NARRATIVE ARCHITECTURE',
    description: 'Develop multi-act story arcs, world lore, and character memory.',
    targetModule: 'story',
    icon: BookOpen,
  },
  {
    id: 'script-studio',
    title: 'SCRIPT STUDIO',
    subtitle: 'HOLOGRAPHIC WRITING',
    description: 'Construct industry-standard screenplay scenes with live telemetry.',
    targetModule: 'script',
    icon: FileText,
  },
  {
    id: 'production',
    title: 'PRODUCTION',
    subtitle: 'CINEMATIC PIPELINE',
    description: 'Convert scripts into camera angles, lens data, and scene breakdowns.',
    targetModule: 'production',
    icon: Clapperboard,
  },
  {
    id: 'media-vault',
    title: 'MEDIA LIBRARY',
    subtitle: 'ASSET VAULT',
    description: 'Manage audio stems, 4K plates, video renders, and captions.',
    targetModule: 'media',
    icon: Film,
  },
];

export const QuickActionCards: React.FC = () => {
  const { setActiveModule, setIsCreateProjectOpen } = useApp();
  const { playCockpitBeep } = useTheme();

  const handleAction = (act: QuickAction) => {
    playCockpitBeep('engage');
    if (act.isCreateAction) {
      setIsCreateProjectOpen(true);
    } else if (act.targetModule) {
      setActiveModule(act.targetModule);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-accent)]" />
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--dm-text)]">
            COMMAND MODULE ACTIONS
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[var(--dm-muted)] uppercase">
          7 SUBSYSTEMS ARMED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {ACTIONS.map((act) => {
          const Icon = act.icon;

          return (
            <button
              key={act.id}
              onClick={() => handleAction(act)}
              className="
                group relative text-left p-3.5 rounded-xl border border-[var(--dm-border)]
                bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-elevated)]
                hover:border-[var(--dm-accent-border)] hover:shadow-[0_0_16px_var(--dm-accent-soft)]
                transition-all duration-200 cursor-pointer flex flex-col justify-between
                min-h-[120px] select-none
              "
            >
              {/* Corner Accent Highlight */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--dm-border-bright)] rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-[var(--dm-accent)] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--dm-muted)] group-hover:text-[var(--dm-accent)] transition-colors" />
                </div>

                <h4 className="font-display text-xs font-bold text-[var(--dm-text)] uppercase tracking-wider group-hover:text-[var(--dm-accent)] transition-colors">
                  {act.title}
                </h4>

                <p className="font-mono text-[9px] text-[var(--dm-muted)] uppercase tracking-wider mt-0.5">
                  {act.subtitle}
                </p>
              </div>

              <p className="text-[10px] text-[var(--dm-text-secondary)] mt-2 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
                {act.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
