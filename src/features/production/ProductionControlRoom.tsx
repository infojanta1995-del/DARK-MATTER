import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProductionShot, ScriptScene, JobType } from '../../types';
import { ProviderRegistry } from '../../core/ai/ProviderRegistry';
import { ContextEngine } from '../../core/context/ContextEngine';
import { 
  Clapperboard, 
  Camera, 
  Layers, 
  Film, 
  Mic, 
  Headphones, 
  Subtitles, 
  MonitorPlay,
  ChevronRight,
  Plus,
  Trash2,
  Cpu,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Kanban,
  Sliders,
  Play,
  RotateCw,
  Video,
  Eye,
  Check,
  Download,
  Copy,
  FileText
} from 'lucide-react';
import {
  exportScenesToCSV,
  exportScenesToJSON,
  exportScenesToText
} from '../../services/sceneBreakdownService';

export const ProductionControlRoom: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'production' }) => {
  const { 
    currentProject, 
    updateShotStatus, 
    addNewShot, 
    deleteShot, 
    updateSceneStatus,
    updateSceneContent,
    addNewScene,
    deleteScene,
    setActiveModule,
    createProductionJob,
    updateProductionJob,
    triggerToast,
    requestConfirmation
  } = useApp();

  const { playCockpitBeep } = useTheme();

  // Mode switcher: 'production' (Kanban/Board) | 'scenes' (Scene Matrix) | 'shots' (Shot Deck)
  const [activeTab, setActiveTab] = useState<'production' | 'scenes' | 'shots'>(
    initialSubModule === 'scenes' ? 'scenes' : initialSubModule === 'shots' ? 'shots' : 'production'
  );

  useEffect(() => {
    if (initialSubModule === 'scenes') setActiveTab('scenes');
    else if (initialSubModule === 'shots') setActiveTab('shots');
    else if (initialSubModule === 'production') setActiveTab('production');
  }, [initialSubModule]);

  // Shots state
  const [selectedShotId, setSelectedShotId] = useState<string>(
    currentProject.shots[0]?.id || ''
  );
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const [isAddingShot, setIsAddingShot] = useState(false);
  const [isGeneratingShots, setIsGeneratingShots] = useState(false);

  // Scenes state
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    currentProject.scenes[0]?.id || ''
  );
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [newSceneSlug, setNewSceneSlug] = useState('');
  const [newSceneSetting, setNewSceneSetting] = useState('INT. OBSERVATION DOME - ORBIT');

  // New shot form state
  const [newShotForm, setNewShotForm] = useState({
    sceneId: currentProject.scenes[0]?.id || '',
    cameraMovement: 'Static Wide',
    lens: '35mm Anamorphic',
    lightingPrompt: 'Deep space starfield with volumetric cyan glow on metallic surfaces.'
  });

  const filteredShots = selectedSceneFilter === 'all'
    ? currentProject.shots
    : currentProject.shots.filter((s) => s.sceneId === selectedSceneFilter);

  const selectedShot = currentProject.shots.find((s) => s.id === selectedShotId) || filteredShots[0];
  const selectedScene = currentProject.scenes.find((s) => s.id === selectedSceneId) || currentProject.scenes[0];

  const pipelineStages = [
    { label: 'SCRIPT', icon: Film, count: currentProject.scenes.length },
    { label: 'SCENES', icon: Layers, count: currentProject.scenes.length },
    { label: 'SHOTS', icon: Camera, count: currentProject.shots.length },
    { label: 'VISUAL', icon: Film, count: currentProject.assets.filter(a => a.category === 'Images' || a.category === 'Video' || a.category === 'Thumbnails').length },
    { label: 'VOICE', icon: Mic, count: currentProject.assets.filter(a => a.category === 'Voice').length },
    { label: 'AUDIO', icon: Headphones, count: currentProject.assets.filter(a => a.category === 'Audio' || a.category === 'Music' || a.category === 'SFX').length },
    { label: 'CAPTIONS', icon: Subtitles, count: currentProject.assets.filter(a => a.category === 'Captions').length || 1 },
    { label: 'JOBS', icon: Cpu, count: currentProject.jobs.length },
  ];

  // Shot creation
  const handleCreateShot = (e: React.FormEvent) => {
    e.preventDefault();
    addNewShot(newShotForm.sceneId || currentProject.scenes[0]?.id || 'scene-1', {
      cameraMovement: newShotForm.cameraMovement,
      lens: newShotForm.lens,
      lightingPrompt: newShotForm.lightingPrompt,
      status: 'Ready',
    });
    setIsAddingShot(false);
  };

  const handleDeleteShot = (shotId: string, shotNum: string) => {
    requestConfirmation({
      title: 'DELETE SHOT PROTOCOL',
      message: `Delete Shot ${shotNum} from production manifest?`,
      isDanger: true,
      confirmLabel: 'DELETE SHOT',
      onConfirm: () => {
        deleteShot(shotId);
      }
    });
  };

  const handleAiBreakdownScene = async () => {
    setIsGeneratingShots(true);
    playCockpitBeep('engage');

    const job = createProductionJob('SHOT_BREAKDOWN', {
      project: currentProject.name,
      scenesCount: currentProject.scenes.length,
    });

    try {
      const provider = ProviderRegistry.getActiveProvider();
      const context = ContextEngine.assembleContext(currentProject, 'Shot', 'high');

      const response = await provider.execute({
        taskId: `shot-gen-${Date.now()}`,
        taskType: 'Shot',
        prompt: `Generate cinematic visual camera shot breakdown for scene: "${currentProject.scenes[0]?.slugline || 'INT. BRIDGE'}".`,
        context,
      });

      updateProductionJob(job.id, 'Completed', { result: response.content });

      addNewShot(currentProject.scenes[0]?.id || 'scene-1', {
        cameraMovement: 'Orbital Crane 180°',
        lens: '50mm Anamorphic T1.8',
        lightingPrompt: `Volumetric rim lighting against black hole horizon. ${response.content.slice(0, 100)}...`,
        status: 'Ready',
      });

      triggerToast('success', 'SHOT BREAKDOWN GENERATED', `New shot generated via ${provider.name}.`);
    } catch (err: any) {
      updateProductionJob(job.id, 'Failed', null, err.message);
      triggerToast('error', 'BREAKDOWN FAILED', 'AI Engine encountered a processing fault.');
    } finally {
      setIsGeneratingShots(false);
    }
  };

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneSlug.trim()) return;
    addNewScene(newSceneSlug.trim(), `[${newSceneSetting.toUpperCase()}]\n\nAction lines and dialogue to be staged.`);
    setNewSceneSlug('');
    setIsAddingScene(false);
  };

  const handleExportCSV = () => {
    const csv = exportScenesToCSV(currentProject.scenes);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/\s+/g, '_')}_scenes.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('success', 'SCENE CSV EXPORTED', 'Screenplay scene breakdown downloaded as CSV.');
  };

  const handleExportJSON = () => {
    const json = exportScenesToJSON(currentProject.scenes);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/\s+/g, '_')}_scenes.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('success', 'SCENE JSON EXPORTED', 'Raw scene metadata saved as JSON.');
  };

  const handleExportText = () => {
    const text = exportScenesToText(currentProject.scenes, currentProject.title);
    navigator.clipboard.writeText(text);
    triggerToast('info', 'PRODUCTION CALL SHEET COPIED', 'Formatted production sheet copied to clipboard.');
  };

  return (
    <div className="space-y-5">
      {/* Control Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Clapperboard className="w-4 h-4" />
            <span>// MISSION PRODUCTION COMMAND & CONTROL</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            PRODUCTION CONTROL ROOM
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Coordinate the master production Kanban, breakdown scenes into camera setups, and dispatch GPU rendering pipelines.
          </p>
        </div>

        {/* Workstation Mode Switcher */}
        <div className="flex items-center space-x-1.5 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)]">
          {[
            { id: 'production', label: 'PRODUCTION BOARD', icon: Kanban },
            { id: 'scenes', label: 'SCENE MATRIX', icon: Layers },
            { id: 'shots', label: 'SHOT STUDIO', icon: Camera },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--dm-accent)] text-black font-bold shadow-[0_0_12px_var(--dm-accent-soft)]'
                    : 'text-[var(--dm-text-secondary)] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Production Pipeline Cadence Bar */}
      <HoloPanel title="PRODUCTION PIPELINE CADENCE" subtitle="STAGE ASSET PROGRESSION">
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center min-w-[700px] justify-between">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <React.Fragment key={stage.label}>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] min-w-[72px]">
                    <Icon className="w-4 h-4 text-[var(--dm-accent)] mb-1" />
                    <span className="font-display text-[10px] font-bold uppercase text-[var(--dm-text)]">
                      {stage.label}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] mt-0.5">
                      {stage.count} ASSETS
                    </span>
                  </div>

                  {idx < pipelineStages.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--dm-border-bright)]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </HoloPanel>

      {/* ========================================================================= */}
      {/* MODE 1: PRODUCTION KANBAN BOARD */}
      {/* ========================================================================= */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono text-[var(--dm-text-secondary)]">
              // PRODUCTION LIFECYCLE STAGES ACROSS SHOTS & SCENES
            </span>

            <div className="flex items-center space-x-2">
              <GlowButton
                size="sm"
                variant="primary"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={handleAiBreakdownScene}
                disabled={isGeneratingShots}
              >
                {isGeneratingShots ? 'ANALYZING...' : 'AI SHOT SYNTHESIS'}
              </GlowButton>
              <GlowButton
                size="sm"
                variant="secondary"
                icon={<Film className="w-3.5 h-3.5" />}
                onClick={() => setActiveModule('media')}
              >
                MEDIA VAULT
              </GlowButton>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { status: 'Required' as const, title: '01 // SCRIPTED / REQUIRED', color: 'border-slate-700 bg-slate-950/40 text-slate-400' },
              { status: 'Queued' as const, title: '02 // QUEUED FOR RENDER', color: 'border-indigo-500/50 bg-indigo-950/20 text-indigo-300' },
              { status: 'Processing' as const, title: '03 // IN PRODUCTION', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
              { status: 'Ready' as const, title: '04 // ASSETS READY', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' },
            ].map((col) => {
              const shotsInCol = currentProject.shots.filter(s => s.status === col.status);

              return (
                <div key={col.status} className={`p-3.5 rounded-xl border ${col.color} space-y-3 min-h-[320px] flex flex-col`}>
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--dm-divider)]">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{col.title}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/60 font-bold">
                      {shotsInCol.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px]">
                    {shotsInCol.length === 0 ? (
                      <div className="text-center py-8 text-[10px] font-mono text-[var(--dm-muted)] italic">
                        No shots currently in this status stage.
                      </div>
                    ) : (
                      shotsInCol.map((shot) => (
                        <div
                          key={shot.id}
                          onClick={() => {
                            setSelectedShotId(shot.id);
                            setActiveTab('shots');
                          }}
                          className="p-3 rounded-lg bg-black/70 border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-cyan-400 font-bold">
                              SHOT {shot.shotNumber}
                            </span>
                            <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                              {shot.sceneId.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-[11px] font-display font-semibold text-white truncate">
                            {shot.cameraMovement} // {shot.lens}
                          </p>

                          <p className="text-[10px] text-[var(--dm-text-secondary)] line-clamp-2 leading-tight">
                            {shot.lightingPrompt}
                          </p>

                          <div className="pt-1 flex items-center justify-between border-t border-slate-900 text-[9px] font-mono">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus: ProductionShot['status'] =
                                  shot.status === 'Required' ? 'Queued' :
                                  shot.status === 'Queued' ? 'Processing' :
                                  shot.status === 'Processing' ? 'Ready' : 'Required';
                                updateShotStatus(shot.id, nextStatus);
                              }}
                              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              ADVANCE <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[var(--dm-muted)]">CLICK TO INSPECT</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mission Production Jobs Queue */}
          <HoloPanel
            title="MISSION PRODUCTION JOBS"
            subtitle={`${currentProject.jobs.length} ASYNC PIPELINE PROCESSES`}
          >
            {currentProject.jobs.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono text-center py-3">
                No active background production jobs.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {currentProject.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-2.5 rounded-lg border border-slate-800 bg-black/40 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          job.status === 'Completed'
                            ? 'bg-emerald-400'
                            : job.status === 'Processing'
                            ? 'bg-cyan-400 animate-spin'
                            : job.status === 'Failed'
                            ? 'bg-red-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="font-bold text-white uppercase">{job.type}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold ${
                          job.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : job.status === 'Failed'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SCENE MATRIX WORKSTATION */}
      {/* ========================================================================= */}
      {activeTab === 'scenes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">
                SCENE DYNAMICS & PACING CALCULATOR
              </span>
              <span className="text-xs text-[var(--dm-text-secondary)]">
                {currentProject.scenes.length} Master Scenes in screenplay manifest.
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Export Scenes to CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Export Scenes to JSON"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={handleExportText}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                title="Copy Formatted Production Breakdown Sheet"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>COPY SHEET</span>
              </button>

              <GlowButton
                size="sm"
                variant="secondary"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddingScene(!isAddingScene)}
              >
                {isAddingScene ? 'CANCEL' : 'ADD NEW SCENE'}
              </GlowButton>
            </div>
          </div>

          {isAddingScene && (
            <form onSubmit={handleCreateScene} className="p-4 rounded-xl bg-[var(--dm-surface)] border border-cyan-500/50 space-y-3">
              <h4 className="text-xs font-display font-bold uppercase text-white">NEW SCENE SLUGLINE</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newSceneSlug}
                  onChange={(e) => setNewSceneSlug(e.target.value)}
                  placeholder="Slugline (e.g. INT. RESEARCH LAB - GRAVITATIONAL WELL)"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                />
                <input
                  type="text"
                  value={newSceneSetting}
                  onChange={(e) => setNewSceneSetting(e.target.value)}
                  placeholder="Setting / Environmental Atmosphere"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs text-white"
                />
              </div>
              <div className="flex justify-end">
                <GlowButton size="sm" variant="primary" type="submit">
                  REGISTER SCENE
                </GlowButton>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 5 Cols: Scenes list */}
            <div className="lg:col-span-5 space-y-2.5">
              <HoloPanel title="SCENE MANIFEST" subtitle="ORDERED RUNTIME SEQUENCE">
                <div className="space-y-2">
                  {currentProject.scenes.map((sc, i) => {
                    const isSelected = selectedScene?.id === sc.id;
                    const linkedShots = currentProject.shots.filter(s => s.sceneId === sc.id);
                    return (
                      <div
                        key={sc.id}
                        onClick={() => {
                          playCockpitBeep('click');
                          setSelectedSceneId(sc.id);
                        }}
                        className={`
                          p-3 rounded-xl border transition-all cursor-pointer
                          ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                              : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] text-cyan-400 font-bold">
                            SCENE #{i + 1}
                          </span>
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-slate-300">
                            {linkedShots.length} SHOTS LINKED
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-white mb-1">
                          {sc.slugline}
                        </h4>
                        <p className="text-[11px] text-[var(--dm-text-secondary)] line-clamp-2">
                          {sc.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </HoloPanel>
            </div>

            {/* Right 7 Cols: Scene Details & Shot Breakout */}
            {selectedScene && (
              <div className="lg:col-span-7 space-y-4">
                <HoloPanel
                  title={`SCENE DETAIL // ${selectedScene.slugline}`}
                  subtitle={`STATUS: ${selectedScene.status.toUpperCase()}`}
                  headerRight={
                    <GlowButton
                      size="sm"
                      variant="primary"
                      icon={<Camera className="w-3.5 h-3.5" />}
                      onClick={() => {
                        setSelectedSceneFilter(selectedScene.id);
                        setActiveTab('shots');
                      }}
                    >
                      VIEW LINKED SHOTS
                    </GlowButton>
                  }
                >
                  <div className="space-y-4 text-xs">
                    <div className="p-3 rounded-xl bg-black/60 border border-[var(--dm-border)] space-y-2">
                      <span className="font-mono text-[10px] text-[var(--dm-accent)] font-bold uppercase block">
                        SCREENPLAY ACTIONS & DIALOGUE
                      </span>
                      <textarea
                        value={selectedScene.content}
                        onChange={(e) => updateSceneContent(selectedScene.id, e.target.value)}
                        className="w-full h-36 p-2 rounded-lg bg-black border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                        <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                          ESTIMATED DURATION
                        </span>
                        <span className="font-display font-bold text-sm text-cyan-300">
                          ~{Math.max(1, Math.round(selectedScene.content.split(/\s+/).length / 130 * 60))} SECONDS
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                        <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                          PRODUCTION STATUS
                        </span>
                        <select
                          value={selectedScene.status}
                          onChange={(e) => updateSceneStatus(selectedScene.id, e.target.value as any)}
                          className="w-full bg-black text-xs font-mono text-emerald-400 border border-slate-800 rounded p-1"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Review">In Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Filmed">Filmed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </HoloPanel>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SHOT STUDIO & OPTICAL DIRECTOR */}
      {/* ========================================================================= */}
      {activeTab === 'shots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Shot List Table */}
          <div className="lg:col-span-2 space-y-3">
            <HoloPanel
              title="SHOT DECK"
              subtitle={`${filteredShots.length} PRODUCTION SHOTS LOGGED`}
              headerRight={
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSceneFilter}
                    onChange={(e) => setSelectedSceneFilter(e.target.value)}
                    className="px-2 py-1 text-[11px] rounded border border-[var(--dm-border)] bg-black text-slate-300 font-mono focus:outline-none"
                  >
                    <option value="all">ALL SCENES</option>
                    {currentProject.scenes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.slugline.slice(0, 24)}...
                      </option>
                    ))}
                  </select>

                  <GlowButton
                    size="sm"
                    variant="secondary"
                    icon={<Plus className="w-3 h-3" />}
                    onClick={() => setIsAddingShot(!isAddingShot)}
                  >
                    {isAddingShot ? 'CANCEL' : 'ADD SHOT'}
                  </GlowButton>
                </div>
              }
            >
              {isAddingShot && (
                <form onSubmit={handleCreateShot} className="p-4 mb-4 rounded-xl bg-[var(--dm-surface-elevated)] border border-[var(--dm-accent-border)] space-y-3">
                  <h4 className="text-xs font-display font-bold uppercase text-[var(--dm-text)]">
                    STAGE NEW CAMERA SHOT
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                        CAMERA MOVEMENT
                      </label>
                      <select
                        value={newShotForm.cameraMovement}
                        onChange={(e) => setNewShotForm({ ...newShotForm, cameraMovement: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded border border-[var(--dm-border)] bg-black text-white font-mono"
                      >
                        <option value="Static Wide">Static Wide (Master)</option>
                        <option value="Slow Push In">Slow Push In (Dramatic Accent)</option>
                        <option value="Orbital Crane 180°">Orbital Crane 180° (Cosmic Scope)</option>
                        <option value="Tracking Dolly">Tracking Dolly (Motion Match)</option>
                        <option value="Handheld Shaky Cam">Handheld Shaky Cam (High Stress)</option>
                        <option value="FPV Probe Flythrough">FPV Probe Flythrough (Kinetic)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                        LENS PROFILE
                      </label>
                      <select
                        value={newShotForm.lens}
                        onChange={(e) => setNewShotForm({ ...newShotForm, lens: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded border border-[var(--dm-border)] bg-black text-white font-mono"
                      >
                        <option value="14mm Ultra-Wide">14mm Ultra-Wide (Vast Space)</option>
                        <option value="24mm Wide Anamorphic">24mm Wide Anamorphic</option>
                        <option value="35mm Anamorphic">35mm Anamorphic (Standard Cinema)</option>
                        <option value="50mm Anamorphic T1.8">50mm Anamorphic T1.8 (Natural Eye)</option>
                        <option value="85mm Cinematic Portrait">85mm Cinematic Portrait (Isolation)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                      LIGHTING & VOLUMETRIC ATMOSPHERE PROMPT
                    </label>
                    <input
                      type="text"
                      value={newShotForm.lightingPrompt}
                      onChange={(e) => setNewShotForm({ ...newShotForm, lightingPrompt: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-[var(--dm-border)] bg-black text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <GlowButton size="sm" variant="primary" type="submit">
                      COMMIT TO MANIFEST
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {filteredShots.map((shot) => {
                  const isSelected = selectedShot?.id === shot.id;
                  return (
                    <div
                      key={shot.id}
                      onClick={() => {
                        playCockpitBeep('click');
                        setSelectedShotId(shot.id);
                      }}
                      className={`
                        p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group
                        ${
                          isSelected
                            ? 'border-[var(--dm-accent)] bg-[var(--dm-surface-elevated)] shadow-[0_0_12px_var(--dm-accent-soft)]'
                            : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                        }
                      `}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-[var(--dm-accent)]">
                            SHOT #{shot.shotNumber}
                          </span>
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/50 text-[var(--dm-muted)]">
                            {shot.sceneId.toUpperCase()}
                          </span>
                          <StatusBadge status={shot.status} />
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          <span className="font-display font-semibold text-[var(--dm-text)]">
                            {shot.cameraMovement}
                          </span>
                          <span className="text-[var(--dm-muted)] font-mono text-[10px]">
                            // {shot.lens}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShot(shot.id, shot.shotNumber);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 rounded transition-opacity"
                          title="Delete Shot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </HoloPanel>
          </div>

          {/* Right Col: Shot Telemetry Inspector */}
          <div className="space-y-4">
            {selectedShot ? (
              <HoloPanel
                title={`INSPECTOR // SHOT ${selectedShot.shotNumber}`}
                subtitle="OPTICAL & LIGHTING MANIFEST"
              >
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      PRODUCTION STATUS
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['Required', 'Queued', 'Processing', 'Ready', 'Approved'] as ProductionShot['status'][]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => updateShotStatus(selectedShot.id, st)}
                            className={`flex-1 py-1 text-[9px] font-mono uppercase rounded border transition-all cursor-pointer ${
                              selectedShot.status === st
                                ? 'border-[var(--dm-accent)] bg-[var(--dm-accent)] text-black font-bold'
                                : 'border-[var(--dm-border)] text-[var(--dm-muted)] hover:text-white'
                            }`}
                          >
                            {st.slice(0, 4)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[var(--dm-muted)] font-mono text-[10px]">CAMERA LENS</span>
                      <span className="font-display font-semibold text-white">{selectedShot.lens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--dm-muted)] font-mono text-[10px]">MOVEMENT</span>
                      <span className="font-display font-semibold text-cyan-400">{selectedShot.cameraMovement}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      LIGHTING & VOLUMETRIC ATMOSPHERE PROMPT
                    </span>
                    <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                      {selectedShot.lightingPrompt}
                    </p>
                  </div>
                </div>
              </HoloPanel>
            ) : (
              <div className="p-6 text-center border border-dashed border-[var(--dm-border)] rounded-xl text-xs font-mono text-[var(--dm-muted)]">
                SELECT A SHOT TO INSPECT
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
