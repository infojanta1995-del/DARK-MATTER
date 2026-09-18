import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProviderRegistry } from '../../core/ai/ProviderRegistry';
import { ContextEngine } from '../../core/context/ContextEngine';
import { ScriptSectionCard } from './ScriptSectionCard';
import { ScriptSynthesizerModal } from './ScriptSynthesizerModal';
import { ScriptTeleprompterModal } from './ScriptTeleprompterModal';
import { ScriptVersionsModal } from './ScriptVersionsModal';
import { Script, ScriptSection } from '../../types';
import { 
  FileText, 
  Plus, 
  Users, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Compass, 
  Save,
  Wand2,
  Trash2,
  CheckCircle2,
  Layers,
  Edit3,
  Tv,
  History,
  Send,
  Download,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';

export const StoryScriptStudio: React.FC = () => {
  const { 
    currentProject, 
    activeModule,
    saveScript,
    deleteScript,
    saveScriptVersion,
    restoreScriptVersion,
    syncScriptToProduction,
    updateSceneContent, 
    updateSceneStatus, 
    addNewScene,
    deleteScene,
    addCharacter,
    deleteCharacter,
    addLocation,
    deleteLocation,
    updateBible,
    createProductionJob,
    updateProductionJob,
    triggerToast,
    requestConfirmation
  } = useApp();

  const { playCockpitBeep } = useTheme();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'sections' | 'scenes' | 'bible' | 'characters' | 'locations'>('sections');

  // Multi-Script State
  const scriptsList = currentProject.scripts || [];
  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    scriptsList[0]?.id || ''
  );

  // Modals
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  // Scene navigation state (for Screenplay Scenes view)
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    currentProject.scenes[0]?.id || ''
  );
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuggestionNotice, setAiSuggestionNotice] = useState<string | null>(null);

  // Characters and Locations Form State
  const [isAddingChar, setIsAddingChar] = useState(false);
  const [charForm, setCharForm] = useState({ name: '', role: 'Protagonist', archetype: '', traits: '', backstory: '', voiceStyle: '' });

  const [isAddingLoc, setIsAddingLoc] = useState(false);
  const [locForm, setLocForm] = useState({ name: '', environment: '', atmosphere: '', visualSignatures: '' });

  // Bible State
  const [isEditingBible, setIsEditingBible] = useState(false);
  const [bibleSynopsis, setBibleSynopsis] = useState(currentProject.bible.synopsis);

  // Copy Full Script feedback
  const [copiedFull, setCopiedFull] = useState(false);

  // Keep selectedScriptId valid or initialize default script
  useEffect(() => {
    if (scriptsList.length > 0) {
      if (!scriptsList.some((s) => s.id === selectedScriptId)) {
        setSelectedScriptId(scriptsList[0].id);
      }
    }
  }, [scriptsList, selectedScriptId]);

  // Sync activeTab with activeModule navigation
  useEffect(() => {
    if (activeModule === 'script') setActiveTab('sections');
    else if (activeModule === 'bible' || activeModule === 'story') setActiveTab('bible');
    else if (activeModule === 'characters') setActiveTab('characters');
    else if (activeModule === 'locations') setActiveTab('locations');
  }, [activeModule]);

  // Keep selectedSceneId valid
  useEffect(() => {
    if (!currentProject.scenes.some((s) => s.id === selectedSceneId)) {
      if (currentProject.scenes.length > 0) {
        setSelectedSceneId(currentProject.scenes[0].id);
      }
    }
  }, [currentProject.scenes, selectedSceneId]);

  const activeScript = scriptsList.find((s) => s.id === selectedScriptId) || scriptsList[0];
  const activeScene = currentProject.scenes.find((s) => s.id === selectedSceneId) || currentProject.scenes[0];

  // =========================================================================
  // Script Section Handlers
  // =========================================================================

  const handleUpdateSection = (updatedSection: ScriptSection) => {
    if (!activeScript) return;
    const newSections = activeScript.sections.map((sec) =>
      sec.id === updatedSection.id ? updatedSection : sec
    );
    saveScript({
      ...activeScript,
      sections: newSections,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!activeScript) return;
    requestConfirmation({
      title: 'PURGE SECTION PROTOCOL',
      message: 'Are you sure you want to remove this narrative section from the script?',
      isDanger: true,
      confirmLabel: 'DELETE SECTION',
      onConfirm: () => {
        const newSections = activeScript.sections.filter((s) => s.id !== sectionId);
        saveScript({
          ...activeScript,
          sections: newSections,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        });
        triggerToast('info', 'SECTION REMOVED', 'Script structure updated.');
      },
    });
  };

  const handleMoveSectionUp = (idx: number) => {
    if (!activeScript || idx <= 0) return;
    playCockpitBeep('click');
    const newSections = [...activeScript.sections];
    const temp = newSections[idx - 1];
    newSections[idx - 1] = newSections[idx];
    newSections[idx] = temp;
    saveScript({
      ...activeScript,
      sections: newSections,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
  };

  const handleMoveSectionDown = (idx: number) => {
    if (!activeScript || idx >= activeScript.sections.length - 1) return;
    playCockpitBeep('click');
    const newSections = [...activeScript.sections];
    const temp = newSections[idx + 1];
    newSections[idx + 1] = newSections[idx];
    newSections[idx] = temp;
    saveScript({
      ...activeScript,
      sections: newSections,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
  };

  const handleAddSection = () => {
    if (!activeScript) return;
    playCockpitBeep('engage');
    const newOrder = activeScript.sections.length + 1;
    const newSec: ScriptSection = {
      id: `sec-${Date.now()}`,
      name: `Act ${newOrder}: Narrative Progression`,
      content: 'Write spoken voiceover or dialogue beat here...',
      narration: 'Write spoken voiceover or dialogue beat here...',
      visualDescription: 'B-Roll direction, holographic interface overlays, or cinematic wide-angle framing...',
      directorNotes: 'Maintain tension and curiosity.',
      pacing: 'Measured Cadence',
      targetDuration: '1m 15s',
      order: newOrder,
    };
    saveScript({
      ...activeScript,
      sections: [...activeScript.sections, newSec],
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
    triggerToast('success', 'ACT SECTION ADDED', `New section registered in script.`);
  };

  const handleSyncToProduction = () => {
    if (!activeScript) return;
    playCockpitBeep('engage');
    syncScriptToProduction(activeScript);
    triggerToast(
      'success',
      'SYNCED TO PRODUCTION',
      `Synchronized ${activeScript.sections.length} script beats directly into Production Board & Shots!`
    );
  };

  const handleCopyFullScript = () => {
    if (!activeScript) return;
    playCockpitBeep('click');
    const fullText = activeScript.sections
      .map((sec, idx) => `[ACT ${idx + 1}: ${sec.name.toUpperCase()}]\nVISUAL: ${sec.visualDescription || 'N/A'}\nNARRATION: ${sec.narration || sec.content}\n`)
      .join('\n---\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedFull(true);
    triggerToast('success', 'SCRIPT COPIED', 'Full production script copied to clipboard.');
    setTimeout(() => setCopiedFull(false), 2000);
  };

  // Scene handlers
  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneTitle.trim()) return;
    addNewScene(newSceneTitle.trim(), `INT. SECTOR - ${newSceneTitle.trim().toUpperCase()}`);
    setNewSceneTitle('');
    setIsAddingScene(false);
  };

  const handleDeleteScene = (sceneId: string, title: string) => {
    requestConfirmation({
      title: 'PURGE SCENE PROTOCOL',
      message: `Are you sure you want to delete scene "${title}"? This cannot be undone.`,
      isDanger: true,
      confirmLabel: 'DELETE SCENE',
      onConfirm: () => {
        deleteScene(sceneId);
      },
    });
  };

  const handleExecuteAiAction = async (actionName: string) => {
    setIsAiProcessing(true);
    playCockpitBeep('engage');

    const job = createProductionJob('SCRIPT_ANALYSIS', {
      sceneId: activeScene?.id,
      action: actionName,
    });

    try {
      const provider = ProviderRegistry.getActiveProvider();
      const context = ContextEngine.assembleContext(currentProject, 'Script', 'high');
      
      const response = await provider.execute({
        taskId: `ai-script-${Date.now()}`,
        taskType: 'Script',
        prompt: `Calibrate screenplay scene: ${actionName} for "${activeScene?.slugline}".`,
        context,
      });

      updateProductionJob(job.id, 'Completed', { result: response.content });

      if (activeScene) {
        const updated = `${activeScene.content}\n\n[// AI ENGINE CALIBRATION: ${actionName}]\n${response.content}`;
        updateSceneContent(activeScene.id, updated);
      }

      setAiSuggestionNotice(`AI ROUTER // EXECUTED: ${actionName}. Telemetry integrated into screenplay.`);
      triggerToast('success', 'AI OPERATION COMPLETE', `Generated script updates with ${provider.name}.`);
    } catch (err: any) {
      updateProductionJob(job.id, 'Failed', null, err.message);
      triggerToast('error', 'AI FAILURE', 'Unable to complete AI operation.');
    } finally {
      setIsAiProcessing(false);
      setTimeout(() => setAiSuggestionNotice(null), 4000);
    }
  };

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charForm.name.trim()) return;
    addCharacter({
      projectId: currentProject.id,
      name: charForm.name.trim(),
      role: charForm.role as any,
      archetype: charForm.archetype || 'Specialist',
      traits: charForm.traits.split(',').map((t) => t.trim()).filter(Boolean),
      backstory: charForm.backstory || 'Classified cosmic dossier.',
      voiceStyle: charForm.voiceStyle || 'Calm, measured, analytical cadence.',
    });
    setCharForm({ name: '', role: 'Protagonist', archetype: '', traits: '', backstory: '', voiceStyle: '' });
    setIsAddingChar(false);
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locForm.name.trim()) return;
    addLocation({
      projectId: currentProject.id,
      name: locForm.name.trim(),
      environment: locForm.environment || 'Deep Space Habitat',
      atmosphere: locForm.atmosphere || 'Zero-g pressurized chamber.',
      visualSignatures: locForm.visualSignatures.split(',').map((s) => s.trim()).filter(Boolean),
      scenesLinked: 0,
    });
    setLocForm({ name: '', environment: '', atmosphere: '', visualSignatures: '' });
    setIsAddingLoc(false);
  };

  const handleSaveBible = () => {
    updateBible({ synopsis: bibleSynopsis });
    setIsEditingBible(false);
    triggerToast('success', 'STORY BIBLE UPDATED', 'Canonical synopsis synchronized across project memory.');
  };

  // Aggregate Script Telemetry
  const totalWords = activeScript?.sections.reduce((acc, s) => {
    const text = s.narration || s.content || '';
    return acc + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0) || 0;

  const totalMinutes = Math.round(totalWords / 140);

  return (
    <div className="space-y-4">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <FileText className="w-4 h-4" />
            <span>// HOLOGRAPHIC SCRIPT & SCREENPLAY STUDIO</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            {activeScript ? activeScript.title : `SCRIPT WORKSTATION: ${currentProject.name}`}
          </h1>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center space-x-1.5 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)] overflow-x-auto">
          {[
            { id: 'sections', label: 'PRODUCTION SCRIPT', icon: Layers },
            { id: 'scenes', label: 'SCREENPLAY (SCENES)', icon: FileText },
            { id: 'bible', label: 'STORY BIBLE', icon: BookOpen },
            { id: 'characters', label: 'CHARACTERS', icon: Users },
            { id: 'locations', label: 'LOCATIONS', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
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

      {aiSuggestionNotice && (
        <div className="p-2.5 rounded-lg border border-[var(--dm-accent-border)] bg-[var(--dm-accent-soft)] text-xs font-mono text-cyan-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[var(--dm-accent)]" />
            <span>{aiSuggestionNotice}</span>
          </div>
          <button onClick={() => setAiSuggestionNotice(null)} className="text-[10px] text-cyan-400 hover:underline">
            DISMISS
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PRODUCTION SCRIPT (SECTIONS & ACTS) TAB */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {/* Script Action Bar & Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-xl border border-cyan-500/20 bg-slate-950/60">
            {/* Script Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold shrink-0">
                ACTIVE SCRIPT:
              </span>
              {scriptsList.length > 0 ? (
                <select
                  value={selectedScriptId}
                  onChange={(e) => {
                    playCockpitBeep('click');
                    setSelectedScriptId(e.target.value);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-black text-xs font-mono text-white focus:border-cyan-400 focus:outline-none max-w-[280px] truncate"
                >
                  {scriptsList.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.title} (v{sc.currentVersionNumber}.0)
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-mono text-xs text-slate-400 italic">No scripts synthesized yet.</span>
              )}

              {activeScript && (
                <StatusBadge status={activeScript.status || 'Ready'} size="sm" />
              )}
            </div>

            {/* Script Telemetry & Global Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {activeScript && (
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300 mr-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold">{totalWords} WORDS</span>
                  <span className="text-slate-500">|</span>
                  <span>~{totalMinutes} MIN AUDIO</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-indigo-300">{activeScript.sections.length} ACTS</span>
                </div>
              )}

              {/* Synthesize with AI */}
              <GlowButton
                size="sm"
                variant="primary"
                onClick={() => setIsSynthesizerOpen(true)}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>AI SYNTHESIZER</span>
              </GlowButton>

              {/* Teleprompter */}
              {activeScript && (
                <button
                  onClick={() => setIsTeleprompterOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
                  title="Open Teleprompter HUD"
                >
                  <Tv className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TELEPROMPTER</span>
                </button>
              )}

              {/* Version History */}
              {activeScript && (
                <button
                  onClick={() => setIsVersionsOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-cyan-500/50 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
                  title="Version History & Snapshots"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>v{activeScript.currentVersionNumber}.0</span>
                </button>
              )}

              {/* Sync to Production Pipeline */}
              {activeScript && (
                <GlowButton
                  size="sm"
                  variant="secondary"
                  onClick={handleSyncToProduction}
                >
                  <Send className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>SYNC TO PRODUCTION</span>
                </GlowButton>
              )}

              {/* Copy Full Script */}
              {activeScript && (
                <button
                  onClick={handleCopyFullScript}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                  title="Copy Full Screenplay Markdown"
                >
                  {copiedFull ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Active Script Sections List */}
          {activeScript && activeScript.sections && activeScript.sections.length > 0 ? (
            <div className="space-y-4">
              {activeScript.sections.map((sec, idx) => (
                <ScriptSectionCard
                  key={sec.id}
                  section={sec}
                  index={idx}
                  totalSections={activeScript.sections.length}
                  onUpdate={handleUpdateSection}
                  onDelete={handleDeleteSection}
                  onMoveUp={handleMoveSectionUp}
                  onMoveDown={handleMoveSectionDown}
                  context={ContextEngine.buildScriptContext(currentProject, activeScript.settings)}
                />
              ))}

              {/* Add New Section */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleAddSection}
                  className="px-4 py-2 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer font-bold"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>INSERT ACT / SCENE BEAT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 space-y-4">
              <div className="w-12 h-12 rounded-full border border-cyan-500/40 bg-cyan-950/50 text-cyan-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-sm font-bold text-slate-200">
                  NO ACTIVE SCRIPT REGISTERED
                </h3>
                <p className="font-mono text-xs text-slate-400 max-w-md mx-auto">
                  Launch the Autonomous AI Script Synthesizer to generate a complete production screenplay from your ideas, or build act-by-act.
                </p>
              </div>
              <GlowButton
                size="md"
                variant="primary"
                onClick={() => setIsSynthesizerOpen(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span>SYNTHESIZE SCRIPT WITH AI</span>
              </GlowButton>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SCREENPLAY SCENES CHRONOLOGY TAB */}
      {/* ========================================================================= */}
      {activeTab === 'scenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column: Scene Navigation */}
          <div className="lg:col-span-1 space-y-3">
            <HoloPanel
              title="SCENE CHRONOLOGY"
              subtitle={`${currentProject.scenes.length} SCENES REGISTERED`}
              headerRight={
                <button
                  onClick={() => setIsAddingScene(true)}
                  className="text-xs font-mono text-[var(--dm-accent)] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> ADD
                </button>
              }
            >
              {isAddingScene && (
                <form onSubmit={handleCreateScene} className="mb-3 p-2 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-accent-border)] space-y-2">
                  <input
                    type="text"
                    required
                    value={newSceneTitle}
                    onChange={(e) => setNewSceneTitle(e.target.value)}
                    placeholder="Scene title or event..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-[var(--dm-border)] bg-black text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAddingScene(false)}
                      className="px-2 py-1 text-[10px] text-[var(--dm-muted)]"
                    >
                      CANCEL
                    </button>
                    <GlowButton type="submit" size="sm" variant="primary">
                      INITIALIZE
                    </GlowButton>
                  </div>
                </form>
              )}

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {currentProject.scenes.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => {
                      playCockpitBeep('click');
                      setSelectedSceneId(scene.id);
                    }}
                    className={`
                      w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer select-none group relative
                      ${
                        activeScene?.id === scene.id
                          ? 'border-[var(--dm-accent)] bg-[var(--dm-surface-elevated)] shadow-[0_0_12px_var(--dm-accent-soft)]'
                          : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-[var(--dm-accent)] font-semibold">
                        SCENE #{scene.sceneNumber}
                      </span>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={scene.status} size="sm" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(scene.id, scene.slugline);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 transition-opacity"
                          title="Delete Scene"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-display text-xs font-semibold text-[var(--dm-text)] truncate">
                      {scene.slugline}
                    </h4>

                    <p className="text-[11px] text-[var(--dm-text-secondary)] truncate mt-0.5">
                      {scene.summary}
                    </p>
                  </div>
                ))}
              </div>
            </HoloPanel>

            {/* AI Assistant Tool Module */}
            <HoloPanel title="AUTONOMOUS SCRIPT COPILOT" subtitle="LOCAL NEURAL CORE">
              <div className="space-y-1.5 text-xs">
                <button
                  disabled={isAiProcessing}
                  onClick={() => handleExecuteAiAction('Astrophysics Dialogue Calibration')}
                  className="w-full text-left p-2 rounded-lg bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] hover:border-[var(--dm-accent-border)] transition-all flex items-center justify-between text-slate-300 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  <span className="font-display">Inject Hard Sci-Fi Terminology</span>
                  <Wand2 className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
                </button>
                <button
                  disabled={isAiProcessing}
                  onClick={() => handleExecuteAiAction('Pacing Compression')}
                  className="w-full text-left p-2 rounded-lg bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] hover:border-[var(--dm-accent-border)] transition-all flex items-center justify-between text-slate-300 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  <span className="font-display">Compress Dialogue & Enhance Pacing</span>
                  <Wand2 className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
                </button>
                <button
                  disabled={isAiProcessing}
                  onClick={() => handleExecuteAiAction('Cinematic Sensory Beats')}
                  className="w-full text-left p-2 rounded-lg bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] hover:border-[var(--dm-accent-border)] transition-all flex items-center justify-between text-slate-300 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  <span className="font-display">Generate Environmental Sound Cues</span>
                  <Wand2 className="w-3.5 h-3.5 text-[var(--dm-accent)]" />
                </button>
              </div>
            </HoloPanel>
          </div>

          {/* Right Column: Screenplay Holographic Terminal */}
          <div className="lg:col-span-3 space-y-4">
            {activeScene ? (
              <HoloPanel
                title={`SCENE ${activeScene.sceneNumber} // ${activeScene.slugline}`}
                subtitle={`FORMAT: SCREENPLAY MASTER // TIME: ${activeScene.timeOfDay}`}
                headerRight={
                  <div className="flex items-center space-x-2">
                    <select
                      value={activeScene.status}
                      onChange={(e) => updateSceneStatus(activeScene.id, e.target.value as any)}
                      className="px-2 py-1 text-xs rounded border border-[var(--dm-border)] bg-[var(--dm-surface-elevated)] text-[var(--dm-text)] focus:outline-none font-mono"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                    </select>

                    <GlowButton
                      size="sm"
                      variant="primary"
                      onClick={() => triggerToast('success', 'SCENE SAVED', 'Screenplay changes saved to local memory.')}
                    >
                      <Save className="w-3.5 h-3.5 mr-1" />
                      <span>SAVE</span>
                    </GlowButton>
                  </div>
                }
              >
                {/* Scene Meta Strip */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)] mb-3 text-xs font-mono">
                  <div className="flex items-center space-x-4">
                    <span className="text-[var(--dm-muted)]">
                      CHARACTERS: <strong className="text-white">{activeScene.characters.join(', ') || 'N/A'}</strong>
                    </span>
                    <span className="text-[var(--dm-muted)]">
                      DIALOGUE LINES: <strong className="text-white">{activeScene.dialogueCount}</strong>
                    </span>
                  </div>
                  <div className="text-[var(--dm-accent)] font-semibold">
                    EST. SCREEN TIME: 1M 20S
                  </div>
                </div>

                {/* The Screenplay Text Area */}
                <div className="relative">
                  <textarea
                    rows={16}
                    value={activeScene.content}
                    onChange={(e) => updateSceneContent(activeScene.id, e.target.value)}
                    className="w-full p-4 rounded-xl border border-[var(--dm-border)] bg-black/60 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-[var(--dm-accent)] transition-all resize-y"
                    placeholder="Type screenplay formatted scene..."
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[var(--dm-muted)] bg-black/80 px-2 py-0.5 rounded border border-slate-800">
                    SCREENPLAY TELEMETRY // REAL-TIME PERSISTENCE
                  </div>
                </div>
              </HoloPanel>
            ) : (
              <div className="p-12 text-center text-slate-400 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                NO SCENES PRESENT. CLICK "ADD" TO INITIALIZE A SCENE.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STORY BIBLE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'bible' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HoloPanel
            title="CANONICAL NARRATIVE SYNOPSIS"
            subtitle="CORE STORY PREMISE"
            headerRight={
              isEditingBible ? (
                <button
                  onClick={handleSaveBible}
                  className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> SAVE
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingBible(true)}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> EDIT
                </button>
              )
            }
          >
            {isEditingBible ? (
              <textarea
                rows={6}
                value={bibleSynopsis}
                onChange={(e) => setBibleSynopsis(e.target.value)}
                className="w-full p-3 rounded-lg border border-cyan-500 bg-black text-white font-mono text-xs leading-relaxed focus:outline-none"
              />
            ) : (
              <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed bg-[var(--dm-surface)] p-3.5 rounded-xl border border-[var(--dm-border)]">
                {currentProject.bible.synopsis}
              </p>
            )}
          </HoloPanel>

          <HoloPanel title="WORLDBUILDING LORE & PHYSICS" subtitle="CANON RULES">
            <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed bg-[var(--dm-surface)] p-3.5 rounded-xl border border-[var(--dm-border)]">
              {currentProject.bible.worldLore}
            </p>
          </HoloPanel>

          <HoloPanel title="PRIMARY CONFLICT & THEME" subtitle="DRAMATIC STAKES">
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                <span className="font-mono text-[9px] text-amber-400 uppercase font-bold block mb-1">
                  CENTRAL CONFLICT
                </span>
                <p className="text-slate-200">{currentProject.bible.primaryConflict}</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase font-bold block mb-1">
                  THEMATIC RESONANCE
                </span>
                <p className="text-slate-200">{currentProject.bible.coreTheme}</p>
              </div>
            </div>
          </HoloPanel>

          <HoloPanel title="RULES OF THE COSMOS" subtitle="PHYSICAL & NARRATIVE CONSTRAINTS">
            <ul className="space-y-2 text-xs text-slate-300">
              {currentProject.bible.rulesOfWorld.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2 p-2 rounded bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                  <span className="font-mono text-[10px] text-[var(--dm-accent)] font-bold shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CHARACTERS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'characters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">
              {currentProject.characters.length} CREW DOSSIERS ON RECORD
            </span>
            <GlowButton
              size="sm"
              variant="secondary"
              onClick={() => setIsAddingChar(!isAddingChar)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>{isAddingChar ? 'CANCEL' : 'REGISTER CHARACTER'}</span>
            </GlowButton>
          </div>

          {isAddingChar && (
            <form
              onSubmit={handleAddCharacter}
              className="p-4 rounded-xl border border-cyan-500/50 bg-slate-950/80 space-y-3"
            >
              <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase">
                COMMISSION NEW CHARACTER PROFILE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Character Name"
                  value={charForm.name}
                  onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <select
                  value={charForm.role}
                  onChange={(e) => setCharForm({ ...charForm, role: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Protagonist">Protagonist</option>
                  <option value="Antagonist">Antagonist</option>
                  <option value="Supporting">Supporting</option>
                  <option value="Minor">Minor</option>
                </select>
                <input
                  type="text"
                  placeholder="Archetype (e.g. Commander, AI Core)"
                  value={charForm.archetype}
                  onChange={(e) => setCharForm({ ...charForm, archetype: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Traits (comma separated: Resolute, Tactical)"
                  value={charForm.traits}
                  onChange={(e) => setCharForm({ ...charForm, traits: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Voice Signature (e.g. Measured, low timbre)"
                  value={charForm.voiceStyle}
                  onChange={(e) => setCharForm({ ...charForm, voiceStyle: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Backstory & Origin logs..."
                value={charForm.backstory}
                onChange={(e) => setCharForm({ ...charForm, backstory: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />

              <div className="flex justify-end">
                <GlowButton type="submit" size="sm" variant="primary">
                  ENCODE DOSSIER
                </GlowButton>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentProject.characters.map((char) => (
              <HoloPanel
                key={char.id}
                title={char.name.toUpperCase()}
                subtitle={char.archetype}
                headerRight={
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[var(--dm-accent-soft)] text-[var(--dm-accent)] font-semibold uppercase">
                      {char.role}
                    </span>
                    <button
                      onClick={() => deleteCharacter(char.id)}
                      className="p-1 hover:text-red-400 text-slate-500 rounded"
                      title="Delete Character Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }
              >
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      TRAITS & PSYCHOLOGY
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {char.traits.map((tr) => (
                        <span key={tr} className="px-1.5 py-0.5 rounded bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-[10px] text-slate-300">
                          {tr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      ORIGIN & LOGS
                    </span>
                    <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
                      {char.backstory}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--dm-surface)] border border-[var(--dm-border)]">
                    <span className="font-mono text-[9px] text-[var(--dm-accent)] uppercase block mb-0.5">
                      VOICEPRINT SIGNATURE
                    </span>
                    <p className="text-[11px] text-slate-300 italic">
                      "{char.voiceStyle}"
                    </p>
                  </div>
                </div>
              </HoloPanel>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LOCATIONS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">
              {currentProject.locations.length} SECTORS MAPPED
            </span>
            <GlowButton
              size="sm"
              variant="secondary"
              onClick={() => setIsAddingLoc(!isAddingLoc)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>{isAddingLoc ? 'CANCEL' : 'MAP SECTOR'}</span>
            </GlowButton>
          </div>

          {isAddingLoc && (
            <form
              onSubmit={handleAddLocation}
              className="p-4 rounded-xl border border-emerald-500/50 bg-slate-950/80 space-y-3"
            >
              <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase">
                MAP NEW SPATIAL LOCATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Location Name"
                  value={locForm.name}
                  onChange={(e) => setLocForm({ ...locForm, name: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Environment (e.g. Orbiting Array)"
                  value={locForm.environment}
                  onChange={(e) => setLocForm({ ...locForm, environment: e.target.value })}
                  className="px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Visual Signatures (comma separated: Cyan conduits, zero-g droplets)"
                value={locForm.visualSignatures}
                onChange={(e) => setLocForm({ ...locForm, visualSignatures: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
              />

              <textarea
                rows={2}
                placeholder="Atmosphere & Lighting telemetry..."
                value={locForm.atmosphere}
                onChange={(e) => setLocForm({ ...locForm, atmosphere: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-slate-700 bg-black text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
              />

              <div className="flex justify-end">
                <GlowButton type="submit" size="sm" variant="primary">
                  REGISTER COORDINATES
                </GlowButton>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentProject.locations.map((loc) => (
              <HoloPanel
                key={loc.id}
                title={loc.name.toUpperCase()}
                subtitle={loc.environment}
                headerRight={
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      {loc.scenesLinked} SCENES LINKED
                    </span>
                    <button
                      onClick={() => deleteLocation(loc.id)}
                      className="p-1 hover:text-red-400 text-slate-500 rounded"
                      title="Delete Location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }
              >
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      ATMOSPHERE & LIGHTING
                    </span>
                    <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed">
                      {loc.atmosphere}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-[var(--dm-muted)] uppercase block mb-1">
                      VISUAL SIGNATURES
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {loc.visualSignatures.map((sig) => (
                        <span key={sig} className="px-2 py-0.5 rounded bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)] text-[10px] text-slate-300">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </HoloPanel>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modals: Synthesizer, Teleprompter, Versions */}
      {/* ========================================================================= */}
      {isSynthesizerOpen && (
        <ScriptSynthesizerModal
          isOpen={isSynthesizerOpen}
          project={currentProject}
          onClose={() => setIsSynthesizerOpen(false)}
          onScriptGenerated={(newScript) => {
            saveScript(newScript);
            setSelectedScriptId(newScript.id);
            setActiveTab('sections');
            triggerToast('success', 'SCREENPLAY SYNTHESIZED', `Generated ${newScript.sections.length} production acts.`);
          }}
        />
      )}

      {isTeleprompterOpen && activeScript && (
        <ScriptTeleprompterModal
          isOpen={isTeleprompterOpen}
          script={activeScript}
          onClose={() => setIsTeleprompterOpen(false)}
        />
      )}

      {isVersionsOpen && activeScript && (
        <ScriptVersionsModal
          isOpen={isVersionsOpen}
          script={activeScript}
          onClose={() => setIsVersionsOpen(false)}
          onSaveVersion={(note) => {
            saveScriptVersion(activeScript.id, note);
            triggerToast('success', 'VERSION SNAPSHOT SAVED', `v${activeScript.currentVersionNumber + 1}.0 created.`);
          }}
          onRestoreVersion={(versionNum) => {
            restoreScriptVersion(activeScript.id, versionNum);
            triggerToast('info', 'VERSION RESTORED', `Reverted to version ${versionNum}.0.`);
          }}
        />
      )}
    </div>
  );
};
