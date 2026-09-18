import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProductionShot, JobType } from '../../types';
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
  AlertCircle
} from 'lucide-react';

export const ProductionControlRoom: React.FC = () => {
  const { 
    currentProject, 
    updateShotStatus, 
    addNewShot, 
    deleteShot, 
    setActiveModule,
    createProductionJob,
    updateProductionJob,
    triggerToast,
    requestConfirmation
  } = useApp();

  const { playCockpitBeep } = useTheme();

  const [selectedShotId, setSelectedShotId] = useState<string>(
    currentProject.shots[0]?.id || ''
  );
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const [isAddingShot, setIsAddingShot] = useState(false);
  const [isGeneratingShots, setIsGeneratingShots] = useState(false);

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

      // Automatically add a generated shot
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

  return (
    <div className="space-y-5">
      {/* Control Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Clapperboard className="w-4 h-4" />
            <span>// SPACECRAFT PRODUCTION CONTROL ROOM</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            CINEMATIC SHOT & ASSET PIPELINE
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Break scripts down into granular shots, optical camera movements, and production job workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowButton
            variant="primary"
            size="sm"
            disabled={isGeneratingShots}
            icon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleAiBreakdownScene}
          >
            <span>{isGeneratingShots ? 'ANALYZING...' : 'AI SHOT BREAKDOWN'}</span>
          </GlowButton>

          <GlowButton
            variant="outline"
            size="sm"
            icon={<Film className="w-3.5 h-3.5" />}
            onClick={() => setActiveModule('media')}
          >
            OPEN ASSET VAULT
          </GlowButton>
        </div>
      </div>

      {/* PRODUCTION FLOW: SCRIPT -> SCENES -> SHOTS -> VISUAL -> VOICE -> AUDIO -> CAPTIONS -> JOBS */}
      <HoloPanel title="PRODUCTION PIPELINE CADENCE" subtitle="STEPWISE ASSET FLOW">
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

      {/* Grid: Shots Deck & Active Shot Inspector */}
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
                      SCENE #{s.sceneNumber}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsAddingShot(!isAddingShot)}
                  className="text-xs font-mono text-[var(--dm-accent)] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD SHOT
                </button>
              </div>
            }
          >
            {isAddingShot && (
              <form
                onSubmit={handleCreateShot}
                className="mb-4 p-3 rounded-xl border border-cyan-500/50 bg-slate-950/90 space-y-3"
              >
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  REGISTER NEW CAMERA SHOT
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">TARGET SCENE</label>
                    <select
                      value={newShotForm.sceneId}
                      onChange={(e) => setNewShotForm({ ...newShotForm, sceneId: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-black border border-slate-700 text-white"
                    >
                      {currentProject.scenes.map((s) => (
                        <option key={s.id} value={s.id}>
                          SCENE #{s.sceneNumber}: {s.slugline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">CAMERA MOVEMENT</label>
                    <input
                      type="text"
                      value={newShotForm.cameraMovement}
                      onChange={(e) => setNewShotForm({ ...newShotForm, cameraMovement: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-black border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">OPTICAL LENS</label>
                    <input
                      type="text"
                      value={newShotForm.lens}
                      onChange={(e) => setNewShotForm({ ...newShotForm, lens: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-black border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">LIGHTING & ATMOSPHERE</label>
                  <textarea
                    rows={2}
                    value={newShotForm.lightingPrompt}
                    onChange={(e) => setNewShotForm({ ...newShotForm, lightingPrompt: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-black border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingShot(false)}
                    className="px-3 py-1 text-xs font-mono text-slate-400"
                  >
                    CANCEL
                  </button>
                  <GlowButton type="submit" size="sm" variant="primary">
                    ENCODE SHOT
                  </GlowButton>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
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
                      p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none group
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
                          SHOT {shot.shotNumber}
                        </span>
                        <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-black border border-[var(--dm-border)] text-slate-300">
                          {shot.cameraMovement}
                        </span>
                        <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                          {shot.lens}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--dm-text-secondary)] line-clamp-1">
                        {shot.lightingPrompt}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <StatusBadge status={shot.status} />
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

          {/* Real Production Jobs Queue */}
          <HoloPanel
            title="MISSION PRODUCTION JOBS"
            subtitle={`${currentProject.jobs.length} PIPELINE TASKS TRACKED`}
          >
            {currentProject.jobs.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono text-center py-3">
                No active background production jobs.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
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
                    {(['Required', 'Queued', 'Processing', 'Ready', 'Failed'] as ProductionShot['status'][]).map(
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
    </div>
  );
};
