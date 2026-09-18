import React from 'react';
import { useApp } from '../../core/AppContext';
import { ModuleId } from '../../types';
import { MODULE_GROUPS } from '../../core/modules/moduleRegistry';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Radar, 
  Sparkles, 
  BookOpen, 
  Library, 
  Users, 
  Compass, 
  FileText, 
  Clapperboard, 
  Layers, 
  Camera, 
  Film, 
  Mic, 
  Headphones, 
  Subtitles, 
  MonitorPlay, 
  Image as ImageIcon, 
  Target, 
  Repeat, 
  Rocket, 
  BarChart3,
  SlidersHorizontal,
  Flame,
  ChevronRight
} from 'lucide-react';

const ICON_MAP: Record<ModuleId, React.ElementType> = {
  dashboard: LayoutDashboard,
  trends: TrendingUp,
  research: Radar,
  ideas: Sparkles,
  story: BookOpen,
  bible: Library,
  characters: Users,
  locations: Compass,
  script: FileText,
  production: Clapperboard,
  scenes: Layers,
  shots: Camera,
  media: Film,
  voice: Mic,
  audio: Headphones,
  captions: Subtitles,
  video: MonitorPlay,
  thumbnail: ImageIcon,
  seo: Target,
  repurpose: Repeat,
  publishing: Rocket,
  analytics: BarChart3,
  'story-mode': SlidersHorizontal,
  'film-mode': Flame,
};

export const LeftNavigation: React.FC<{
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeModule, setActiveModule } = useApp();

  const handleNavClick = (id: ModuleId) => {
    setActiveModule(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static top-14 bottom-8 left-0 z-40 w-64
          border-r border-[var(--dm-border)] bg-[var(--dm-surface-elevated)]
          backdrop-blur-xl transition-transform duration-200 ease-in-out
          flex flex-col select-none
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Navigation Header with Brand Subtitle */}
        <div className="px-4 py-3 border-b border-[var(--dm-divider)] flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-xs tracking-widest text-[var(--dm-text)]">
              SYSTEM CONSOLE
            </span>
            <span className="block font-mono text-[9px] text-[var(--dm-muted)] uppercase tracking-wider">
              PIPELINE TELEMETRY
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-accent)] animate-pulse" />
            <span className="font-mono text-[9px] text-[var(--dm-accent)] font-semibold">
              OS CORE v2.0
            </span>
          </div>
        </div>

        {/* Dedicated Operations Quick Bar (Story Mode & Film Mode) */}
        <div className="p-3 border-b border-[var(--dm-divider)] space-y-1 bg-[var(--dm-surface)]">
          <div className="text-[9px] font-mono text-[var(--dm-muted)] uppercase tracking-wider px-1 mb-1">
            SPECIALIZED OPERATING MODES
          </div>
          
          <button
            onClick={() => handleNavClick('story-mode')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-display transition-all cursor-pointer ${
              activeModule === 'story-mode'
                ? 'bg-[var(--dm-accent)] text-black font-semibold shadow-[0_0_12px_var(--dm-accent-soft)]'
                : 'text-[var(--dm-text-secondary)] hover:bg-[var(--dm-surface-hover)] hover:text-[var(--dm-text)] border border-transparent hover:border-[var(--dm-border)]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>STORY MODE FUSION</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>

          <button
            onClick={() => handleNavClick('film-mode')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-display transition-all cursor-pointer ${
              activeModule === 'film-mode'
                ? 'bg-[var(--dm-accent)] text-black font-semibold shadow-[0_0_12px_var(--dm-accent-soft)]'
                : 'text-[var(--dm-text-secondary)] hover:bg-[var(--dm-surface-hover)] hover:text-[var(--dm-text)] border border-transparent hover:border-[var(--dm-border)]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>CINEMATIC FILM MODE</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
        </div>

        {/* Scrollable Pipeline Categories dynamically driven from MODULE_GROUPS */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {MODULE_GROUPS.map((group) => {
            return (
              <div key={group.key} className="space-y-1">
                <div className="flex items-center space-x-2 px-2.5 py-1">
                  <span className="font-mono text-[10px] font-bold text-[var(--dm-muted)] tracking-wider">
                    {group.label}
                  </span>
                  <div className="flex-1 h-[1px] bg-[var(--dm-divider)]" />
                </div>

                <div className="space-y-0.5">
                  {group.modules.map((m) => {
                    const Icon = ICON_MAP[m.id] || Compass;
                    const isActive = activeModule === m.id;

                    return (
                      <button
                        key={m.id}
                        onClick={() => handleNavClick(m.id)}
                        className={`
                          group relative w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg
                          text-xs font-display transition-all duration-150 cursor-pointer
                          ${
                            isActive
                              ? 'bg-[var(--dm-accent-soft)] text-[var(--dm-text)] font-semibold border border-[var(--dm-accent-border)] shadow-[inset_0_0_12px_var(--dm-accent-soft)]'
                              : 'text-[var(--dm-text-secondary)] hover:text-[var(--dm-text)] hover:bg-[var(--dm-surface-hover)] border border-transparent'
                          }
                        `}
                      >
                        {/* Energy Indicator for active module */}
                        {isActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[var(--dm-accent)] shadow-[0_0_8px_var(--dm-accent)]" />
                        )}

                        <div className="flex items-center space-x-2.5 pl-1">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-[var(--dm-accent)]'
                                : 'text-[var(--dm-muted)] group-hover:text-[var(--dm-text)]'
                            }`}
                          />
                          <span className="tracking-wide">{m.name}</span>
                        </div>

                        {m.badge && (
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-[var(--dm-accent)] border border-[var(--dm-accent-border)] font-semibold">
                            {m.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Console Telemetry Summary */}
        <div className="p-3 border-t border-[var(--dm-divider)] bg-[var(--dm-surface)]">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--dm-muted)]">
            <span>STORAGE ENGINE:</span>
            <span className="text-emerald-400 font-semibold">LOCAL-FIRST // 100%</span>
          </div>
          <div className="w-full bg-[var(--dm-surface-elevated)] h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[var(--dm-accent)] h-full w-[96%]" />
          </div>
        </div>
      </aside>
    </>
  );
};
