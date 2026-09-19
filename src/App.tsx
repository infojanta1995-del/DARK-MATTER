/**
 * DARK MATTER — AI Content Creation & Story Production Workspace
 * Futuristic Sci-Fi Space Command Center UI
 */
import React, { useState } from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { AppProvider, useApp } from './core/AppContext';
import { SpaceBackground } from './components/background/SpaceBackground';
import { TopCommandBar } from './components/layout/TopCommandBar';
import { LeftNavigation } from './components/layout/LeftNavigation';
import { SystemStatusBar } from './components/layout/SystemStatusBar';
import { ProjectCreationModal } from './features/projects/ProjectCreationModal';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';

// Feature Views
import { MainDashboardView } from './features/dashboard/MainDashboardView';
import { ResearchIntelligenceView } from './features/research/ResearchIntelligenceView';
import { IdeasGeneratorView } from './features/ideas/IdeasGeneratorView';
import { StoryScriptStudio } from './features/story/StoryScriptStudio';
import { ProductionControlRoom } from './features/production/ProductionControlRoom';
import { MediaVaultView } from './features/media/MediaVaultView';
import { VoiceAudioStudio } from './features/audio-voice/VoiceAudioStudio';
import { PublishingDistributionView } from './features/publishing/PublishingDistributionView';
import { StoryModeView } from './features/story-mode/StoryModeView';
import { FilmModeConsole } from './features/film-mode/FilmModeConsole';

import { ErrorBoundary } from './components/common/ErrorBoundary';

const WorkspaceBridge: React.FC = () => {
  const { activeModule } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <MainDashboardView />;

      case 'trends':
      case 'research':
        return <ResearchIntelligenceView initialSubModule={activeModule} />;

      case 'ideas':
        return <IdeasGeneratorView />;

      case 'story':
      case 'bible':
      case 'characters':
      case 'locations':
      case 'script':
        return <StoryScriptStudio initialSubModule={activeModule} />;

      case 'production':
      case 'scenes':
      case 'shots':
        return <ProductionControlRoom initialSubModule={activeModule} />;

      case 'media':
        return <MediaVaultView />;

      case 'voice':
      case 'audio':
      case 'captions':
      case 'video':
      case 'thumbnail':
        return <VoiceAudioStudio initialSubModule={activeModule} />;

      case 'seo':
      case 'repurpose':
      case 'publishing':
      case 'analytics':
        return <PublishingDistributionView initialSubModule={activeModule} />;

      case 'story-mode':
        return <StoryModeView />;

      case 'film-mode':
        return <FilmModeConsole />;

      default:
        return <MainDashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[var(--dm-text)] font-sans antialiased bg-black select-none">
      {/* Background Canvas: Deep Space & Particle Event Horizon */}
      <SpaceBackground />

      {/* Futuristic Cockpit Scanlines Overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-20 opacity-40" />

      {/* Top Command Bar */}
      <TopCommandBar onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} />

      {/* Main Bridge Workspace Layout */}
      <div className="relative z-20 flex-1 flex overflow-hidden">
        {/* Left Command Navigation */}
        <LeftNavigation
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Dynamic Center Workstation Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-12 transition-all">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              {renderActiveModule()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Bottom Mission Telemetry Status Bar */}
      <SystemStatusBar onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} />

      {/* Modal: Project Creation Protocol */}
      <ProjectCreationModal />

      {/* Modal: Universal Command Palette (Ctrl+K) */}
      <CommandPaletteModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <WorkspaceBridge />
      </AppProvider>
    </ThemeProvider>
  );
}
