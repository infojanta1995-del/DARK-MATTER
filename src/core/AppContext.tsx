import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Project, 
  ModuleId, 
  TelemetryData, 
  PipelineStage, 
  StageStatus, 
  ScriptScene,
  ProductionShot,
  MediaAsset,
  CharacterProfile,
  LocationProfile,
  StoryBible,
  Story,
  ProductionJob,
  JobType,
  AutosaveStatus,
  StorageProvider,
  JobStatus,
  Idea,
  Script
} from '../types';
import { INITIAL_PROJECT, INITIAL_TELEMETRY } from './initialData';
import { useTheme } from '../theme/ThemeContext';
import { defaultStorage } from '../storage/LocalStorageProvider';
import { ProjectService } from './project/ProjectService';
import { JobService } from './jobs/JobService';
import { ToastMessage, ToastType, NotificationToast } from '../components/common/NotificationToast';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SettingsModal } from '../components/settings/SettingsModal';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  currentProject: Project;
  projects: Project[];
  activeModule: ModuleId;
  telemetry: TelemetryData;
  autosaveStatus: AutosaveStatus;
  isCommandPaletteOpen: boolean;
  isCreateProjectOpen: boolean;
  isSettingsOpen: boolean;
  creationStep: string | null;
  storage: StorageProvider;
  setActiveModule: (id: ModuleId) => void;
  selectProject: (projectId: string) => void;
  initializeNewProject: (params: {
    name: string;
    description: string;
    contentType: Project['contentType'];
    primaryMode: string;
    secondaryMode: string;
    primaryLanguage: string;
    targetPlatform: Project['targetPlatform'];
    missionObjective: string;
  }) => Promise<void>;
  renameProject: (projectId: string, newName: string) => void;
  archiveProject: (projectId: string) => void;
  restoreProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  exportProjectJson: () => void;
  importProjectJson: (projectData: any) => void;
  updatePipelineStage: (stage: PipelineStage, status: StageStatus) => void;
  updateSceneContent: (sceneId: string, content: string) => void;
  updateSceneStatus: (sceneId: string, status: ScriptScene['status']) => void;
  addNewScene: (title: string, slugline: string) => void;
  deleteScene: (sceneId: string) => void;
  updateShotStatus: (shotId: string, status: ProductionShot['status']) => void;
  addNewShot: (sceneId: string, shot: Partial<ProductionShot>) => void;
  deleteShot: (shotId: string) => void;
  addNewAsset: (asset: Omit<MediaAsset, 'id' | 'createdAt'>) => void;
  deleteAsset: (assetId: string) => void;
  setStoryModes: (primary: string, secondary: string) => void;
  updateBible: (bibleUpdates: Partial<StoryBible>) => void;
  addCharacter: (char: Omit<CharacterProfile, 'id'>) => void;
  updateCharacter: (charId: string, updates: Partial<CharacterProfile>) => void;
  deleteCharacter: (charId: string) => void;
  addLocation: (loc: Omit<LocationProfile, 'id'>) => void;
  updateLocation: (locId: string, updates: Partial<LocationProfile>) => void;
  deleteLocation: (locId: string) => void;
  saveIdea: (idea: Idea) => void;
  updateIdea: (ideaId: string, updates: Partial<Idea>) => void;
  deleteIdea: (ideaId: string) => void;
  duplicateIdea: (ideaId: string) => void;
  saveScript: (script: Script) => void;
  updateScript: (scriptId: string, updates: Partial<Script>) => void;
  deleteScript: (scriptId: string) => void;
  saveScriptVersion: (scriptId: string, summaryNote?: string) => void;
  restoreScriptVersion: (scriptId: string, versionNumber: number) => void;
  createScriptFromIdea: (idea: Idea) => Script;
  syncScriptToProduction: (script: Script) => void;
  createProductionJob: (type: JobType, input: Record<string, any>) => ProductionJob;
  updateProductionJob: (jobId: string, status: JobStatus, output?: any, error?: string) => void;
  triggerToast: (type: ToastType, title: string, message: string) => void;
  requestConfirmation: (options: ConfirmationOptions) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsCreateProjectOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PROJECTS_COLLECTION = 'projects';
const CURRENT_PROJECT_KEY = 'dm_current_project_id';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playCockpitBeep } = useTheme();

  // Storage provider abstraction (local-first)
  const storage = defaultStorage;

  // Projects state
  const [projects, setProjects] = useState<Project[]>([INITIAL_PROJECT]);
  const [currentProjectId, setCurrentProjectId] = useState<string>(INITIAL_PROJECT.id);
  const [activeModule, setActiveModuleState] = useState<ModuleId>('dashboard');
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('SAVED');

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [creationStep, setCreationStep] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirmation Modal
  const [confirmation, setConfirmation] = useState<ConfirmationOptions | null>(null);

  // Debounce autosave ref
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: new Date().toLocaleTimeString() }]);

    // Play corresponding audio feedback
    if (type === 'error') playCockpitBeep('click');
    else if (type === 'success') playCockpitBeep('pulse');

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, [playCockpitBeep]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const requestConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmation(options);
  }, []);

  // 1. Initial Load from StorageProvider
  useEffect(() => {
    async function loadData() {
      try {
        const storedProjects = await storage.list<Project>(PROJECTS_COLLECTION);
        const lastId = localStorage.getItem(CURRENT_PROJECT_KEY);

        if (storedProjects && storedProjects.length > 0) {
          setProjects(storedProjects);
          if (lastId && storedProjects.some((p) => p.id === lastId)) {
            setCurrentProjectId(lastId);
          } else {
            setCurrentProjectId(storedProjects[0].id);
          }
        } else {
          // First time boot - persist INITIAL_PROJECT into storage
          await storage.create(PROJECTS_COLLECTION, INITIAL_PROJECT.id, INITIAL_PROJECT);
          setProjects([INITIAL_PROJECT]);
          setCurrentProjectId(INITIAL_PROJECT.id);
        }
      } catch (err) {
        console.warn('[AppContext] Storage load fallback to memory:', err);
        setProjects([INITIAL_PROJECT]);
        setCurrentProjectId(INITIAL_PROJECT.id);
      }
    }
    loadData();
  }, []);

  // 2. Autosave with Debounce to StorageProvider
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setAutosaveStatus('SAVING');

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        // Save each project into storage
        for (const proj of projects) {
          await storage.create(PROJECTS_COLLECTION, proj.id, proj);
        }
        localStorage.setItem(CURRENT_PROJECT_KEY, currentProjectId);
        setAutosaveStatus('SAVED');
      } catch (err) {
        console.error('[AppContext] Autosave failed:', err);
        setAutosaveStatus('ERROR');
      }
    }, 800);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [projects, currentProjectId]);

  // Current active project resolver
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0] || INITIAL_PROJECT;

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsCreateProjectOpen(false);
        setIsSettingsOpen(false);
        setConfirmation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Project Switching
  const selectProject = useCallback((projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      playCockpitBeep('pulse');
      setCurrentProjectId(projectId);
      triggerToast('info', 'PROJECT SWITCHED', `Switched active command context to "${target.name}".`);
    }
  }, [projects, playCockpitBeep, triggerToast]);

  const setActiveModule = useCallback((id: ModuleId) => {
    playCockpitBeep('click');
    setActiveModuleState(id);
  }, [playCockpitBeep]);

  // Initialize New Project
  const initializeNewProject = async (params: {
    name: string;
    description: string;
    contentType: Project['contentType'];
    primaryMode: string;
    secondaryMode: string;
    primaryLanguage: string;
    targetPlatform: Project['targetPlatform'];
    missionObjective: string;
  }) => {
    playCockpitBeep('engage');
    setTelemetry((prev) => ({ ...prev, aiCoreStatus: 'PROCESSING', localAIStatus: 'PROCESSING' }));

    const steps = [
      'INITIALIZING PROJECT CORE',
      'CREATING PROJECT MEMORY',
      'INITIALIZING STORY SPACE',
      'PREPARING CONTENT PIPELINE',
      'PROJECT READY',
    ];

    for (const step of steps) {
      setCreationStep(step);
      playCockpitBeep('click');
      await new Promise((r) => setTimeout(r, 380));
    }

    const newProject = ProjectService.createNewProject(params);

    // Save to storage immediately
    await storage.create(PROJECTS_COLLECTION, newProject.id, newProject);

    setProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newProject.id);
    setActiveModuleState('dashboard');
    setTelemetry((prev) => ({ ...prev, aiCoreStatus: 'READY', localAIStatus: 'READY' }));
    playCockpitBeep('engage');

    triggerToast('success', 'MISSION INITIALIZED', `Project "${newProject.name}" active in memory.`);

    await new Promise((r) => setTimeout(r, 400));
    setCreationStep(null);
    setIsCreateProjectOpen(false);
  };

  const renameProject = useCallback((projectId: string, newName: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = ProjectService.renameProject(p, newName);
          triggerToast('success', 'MISSION RENAMED', `Updated project identifier to "${updated.name}".`);
          return updated;
        }
        return p;
      })
    );
  }, [triggerToast]);

  const archiveProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = ProjectService.archiveProject(p);
          triggerToast('warning', 'PROJECT ARCHIVED', `Project "${p.name}" moved to cold storage vault.`);
          return updated;
        }
        return p;
      })
    );
  }, [triggerToast]);

  const restoreProject = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = ProjectService.restoreProject(p);
          triggerToast('success', 'PROJECT RESTORED', `Project "${p.name}" re-activated on command bridge.`);
          return updated;
        }
        return p;
      })
    );
  }, [triggerToast]);

  const deleteProject = useCallback((projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    requestConfirmation({
      title: 'PURGE MISSION PROTOCOL',
      message: `Are you certain you want to permanently erase mission "${target.name}"? This action cannot be undone.`,
      confirmLabel: 'PURGE FROM VAULT',
      isDanger: true,
      onConfirm: async () => {
        await storage.delete(PROJECTS_COLLECTION, projectId);
        setProjects((prev) => {
          const remaining = prev.filter((p) => p.id !== projectId);
          if (remaining.length === 0) {
            // Re-seed default
            storage.create(PROJECTS_COLLECTION, INITIAL_PROJECT.id, INITIAL_PROJECT);
            setCurrentProjectId(INITIAL_PROJECT.id);
            return [INITIAL_PROJECT];
          }
          if (currentProjectId === projectId) {
            setCurrentProjectId(remaining[0].id);
          }
          return remaining;
        });
        setConfirmation(null);
        triggerToast('info', 'MISSION PURGED', `Project "${target.name}" removed from local storage.`);
      },
    });
  }, [projects, currentProjectId, requestConfirmation, triggerToast, storage]);

  // JSON Export / Import
  const exportProjectJson = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentProject, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `DARK_MATTER_MISSION_${currentProject.name.replace(/\s+/g, '_')}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [currentProject]);

  const importProjectJson = useCallback(async (projectData: any) => {
    if (!projectData || !projectData.name) {
      throw new Error('Invalid project structure');
    }
    const importedId = `proj-imported-${Date.now()}`;
    const cleanProject: Project = {
      ...INITIAL_PROJECT,
      ...projectData,
      id: importedId,
      name: `(Imported) ${projectData.name}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    await storage.create(PROJECTS_COLLECTION, cleanProject.id, cleanProject);
    setProjects((prev) => [cleanProject, ...prev]);
    setCurrentProjectId(cleanProject.id);
    setActiveModuleState('dashboard');
  }, [storage]);

  // Story Mode updates
  const setStoryModes = useCallback((primary: string, secondary: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const updated = {
            ...p,
            primaryMode: primary,
            secondaryMode: secondary,
            storyMode: primary,
            secondaryStoryMode: secondary,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
          return ProjectService.logVersion(
            updated,
            'STORY_MODE_CHANGE',
            'story-mode',
            `Updated Story Modes to ${primary} + ${secondary}`
          );
        }
        return p;
      })
    );
    triggerToast('info', 'STORY MATRIX FUSED', `Engaged ${primary} with ${secondary} harmonics.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // Pipeline stage update
  const updatePipelineStage = useCallback((stage: PipelineStage, status: StageStatus) => {
    playCockpitBeep('pulse');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            pipelineProgress: {
              ...p.pipelineProgress,
              [stage]: status,
            },
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
  }, [currentProject.id, playCockpitBeep]);

  // Scene Operations
  const updateSceneContent = useCallback((sceneId: string, content: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scenes: p.scenes.map((s) => (s.id === sceneId ? { ...s, content } : s)),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  const updateSceneStatus = useCallback((sceneId: string, status: ScriptScene['status']) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scenes: p.scenes.map((s) => (s.id === sceneId ? { ...s, status } : s)),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
  }, [currentProject.id, playCockpitBeep]);

  const addNewScene = useCallback((title: string, slugline: string) => {
    playCockpitBeep('engage');
    const newScene: ScriptScene = {
      id: `scene-${Date.now()}`,
      sceneNumber: currentProject.scenes.length + 1,
      slugline: slugline || `INT. COMMAND SECTOR - ${title.toUpperCase()}`,
      timeOfDay: 'DEEP VOID',
      summary: title,
      dialogueCount: 0,
      characters: [currentProject.characters[0]?.name || 'Commander'],
      status: 'Draft',
      content: `${slugline || `INT. COMMAND SECTOR - ${title.toUpperCase()}`}\n\n[Scene action and sensor telemetry log begins here...]`,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const updated = {
            ...p,
            scenes: [...p.scenes, newScene],
            pipelineProgress: {
              ...p.pipelineProgress,
              script: 'in-progress' as const,
            },
          };
          return ProjectService.logVersion(
            updated,
            'SCENE_EDIT',
            'script',
            `Added Scene ${newScene.sceneNumber}: "${newScene.summary}"`
          );
        }
        return p;
      })
    );
    triggerToast('success', 'SCENE SEQUENCED', `Scene ${currentProject.scenes.length + 1} added to screenplay.`);
  }, [currentProject, playCockpitBeep, triggerToast]);

  const deleteScene = useCallback((sceneId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scenes: p.scenes.filter((s) => s.id !== sceneId),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'SCENE REMOVED', 'Scene deleted from screenplay breakdown.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // Shot Operations
  const updateShotStatus = useCallback((shotId: string, status: ProductionShot['status']) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            shots: p.shots.map((s) => (s.id === shotId ? { ...s, status } : s)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id, playCockpitBeep]);

  const addNewShot = useCallback((sceneId: string, shotData: Partial<ProductionShot>) => {
    playCockpitBeep('engage');
    const newShot: ProductionShot = {
      id: `shot-${Date.now()}`,
      sceneId,
      shotNumber: `${currentProject.shots.length + 1}.01`,
      cameraMovement: shotData.cameraMovement || 'Static Wide',
      lens: shotData.lens || '35mm Anamorphic',
      lightingPrompt: shotData.lightingPrompt || 'Volumetric cinematic space lighting',
      status: 'Ready',
      ...shotData,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            shots: [...p.shots, newShot],
          };
        }
        return p;
      })
    );
    triggerToast('success', 'SHOT REGISTERED', `Shot ${newShot.shotNumber} added to production storyboard.`);
  }, [currentProject, playCockpitBeep, triggerToast]);

  const deleteShot = useCallback((shotId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            shots: p.shots.filter((s) => s.id !== shotId),
          };
        }
        return p;
      })
    );
  }, [currentProject.id, playCockpitBeep]);

  // Asset Operations
  const addNewAsset = useCallback((asset: Omit<MediaAsset, 'id' | 'createdAt'>) => {
    playCockpitBeep('engage');
    const newAsset: MediaAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const updated = {
            ...p,
            assets: [newAsset, ...p.assets],
          };
          return ProjectService.logVersion(
            updated,
            'ASSET_LINK',
            'media',
            `Ingested asset: "${newAsset.name}" (${newAsset.category})`
          );
        }
        return p;
      })
    );
    triggerToast('success', 'ASSET INGESTED', `Ingested "${newAsset.name}" into media vault.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const deleteAsset = useCallback((assetId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            assets: p.assets.filter((a) => a.id !== assetId),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'ASSET PURGED', 'Asset removed from media vault.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // Story Bible updates
  const updateBible = useCallback((bibleUpdates: Partial<StoryBible>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const updated = {
            ...p,
            bible: { ...p.bible, ...bibleUpdates },
          };
          return ProjectService.logVersion(updated, 'BIBLE_UPDATE', 'bible', 'Updated canonical Story Bible lore.');
        }
        return p;
      })
    );
  }, [currentProject.id]);

  // Character Operations
  const addCharacter = useCallback((char: Omit<CharacterProfile, 'id'>) => {
    playCockpitBeep('engage');
    const newChar: CharacterProfile = {
      ...char,
      id: `char-${Date.now()}`,
      projectId: currentProject.id,
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            characters: [...p.characters, newChar],
          };
        }
        return p;
      })
    );
    triggerToast('success', 'CHARACTER CODIFIED', `Added "${newChar.name}" (${newChar.archetype}) to project memory.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const updateCharacter = useCallback((charId: string, updates: Partial<CharacterProfile>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            characters: p.characters.map((c) => (c.id === charId ? { ...c, ...updates } : c)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  const deleteCharacter = useCallback((charId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            characters: p.characters.filter((c) => c.id !== charId),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'PROFILE DELETED', 'Character profile cleared from project memory.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // Location Operations
  const addLocation = useCallback((loc: Omit<LocationProfile, 'id'>) => {
    playCockpitBeep('engage');
    const newLoc: LocationProfile = {
      ...loc,
      id: `loc-${Date.now()}`,
      projectId: currentProject.id,
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            locations: [...p.locations, newLoc],
          };
        }
        return p;
      })
    );
    triggerToast('success', 'LOCATION MAPPED', `Mapped "${newLoc.name}" to project spatial memory.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const updateLocation = useCallback((locId: string, updates: Partial<LocationProfile>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            locations: p.locations.map((l) => (l.id === locId ? { ...l, ...updates } : l)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  const deleteLocation = useCallback((locId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            locations: p.locations.filter((l) => l.id !== locId),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'LOCATION REMOVED', 'Location environment removed from project memory.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // ==========================================================================
  // IDEA GENERATOR & VAULT OPERATIONS
  // ==========================================================================

  const saveIdea = useCallback((idea: Idea) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const existingIdeas = p.ideas || [];
          const exists = existingIdeas.some((i) => i.id === idea.id);
          const updatedIdeas = exists
            ? existingIdeas.map((i) => (i.id === idea.id ? { ...idea, status: 'saved' as const } : i))
            : [{ ...idea, status: 'saved' as const }, ...existingIdeas];

          return {
            ...p,
            ideas: updatedIdeas,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
    triggerToast('success', 'IDEA SECURED', `"${idea.title}" vaulted to Project Core.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const updateIdea = useCallback((ideaId: string, updates: Partial<Idea>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            ideas: (p.ideas || []).map((i) => (i.id === ideaId ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  const deleteIdea = useCallback((ideaId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            ideas: (p.ideas || []).filter((i) => i.id !== ideaId),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'IDEA ARCHIVED', 'Concept purged from Project Vault.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const duplicateIdea = useCallback((ideaId: string) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const target = (p.ideas || []).find((i) => i.id === ideaId);
          if (!target) return p;
          const clone: Idea = {
            ...target,
            id: `idea-${Date.now()}`,
            title: `${target.title} (Variant)`,
            status: 'draft',
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return {
            ...p,
            ideas: [clone, ...(p.ideas || [])],
          };
        }
        return p;
      })
    );
    triggerToast('success', 'IDEA DUPLICATED', 'Created new concept variant.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // ==========================================================================
  // SCRIPT STUDIO & SCREENPLAY OPERATIONS
  // ==========================================================================

  const saveScript = useCallback((script: Script) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const existing = p.scripts || [];
          const exists = existing.some((s) => s.id === script.id);
          const updated = exists
            ? existing.map((s) => (s.id === script.id ? { ...script, updatedAt: new Date().toISOString() } : s))
            : [script, ...existing];

          return {
            ...p,
            scripts: updated,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
    triggerToast('success', 'SCREENPLAY SAVED', `"${script.title}" committed to Project Memory.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const updateScript = useCallback((scriptId: string, updates: Partial<Script>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scripts: (p.scripts || []).map((s) => (s.id === scriptId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  const deleteScript = useCallback((scriptId: string) => {
    playCockpitBeep('click');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scripts: (p.scripts || []).filter((s) => s.id !== scriptId),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'SCRIPT REMOVED', 'Screenplay removed from project index.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const saveScriptVersion = useCallback((scriptId: string, summaryNote?: string) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scripts: (p.scripts || []).map((s) => {
              if (s.id === scriptId) {
                const nextVersionNumber = (s.currentVersionNumber || 1) + 1;
                const newVersion = {
                  versionNumber: nextVersionNumber,
                  timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  title: `Snapshot v${nextVersionNumber}.0`,
                  sections: JSON.parse(JSON.stringify(s.sections)),
                  scenes: JSON.parse(JSON.stringify(s.scenes)),
                  summaryNote: summaryNote || `Manual revision checkpoint v${nextVersionNumber}`,
                };
                return {
                  ...s,
                  currentVersionNumber: nextVersionNumber,
                  versions: [newVersion, ...(s.versions || [])],
                  updatedAt: new Date().toISOString(),
                };
              }
              return s;
            }),
          };
        }
        return p;
      })
    );
    triggerToast('success', 'VERSION CHECKPOINT', 'Screenplay state preserved in version logs.');
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const restoreScriptVersion = useCallback((scriptId: string, versionNumber: number) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            scripts: (p.scripts || []).map((s) => {
              if (s.id === scriptId) {
                const target = s.versions?.find((v) => v.versionNumber === versionNumber);
                if (target && target.sections?.length) {
                  return {
                    ...s,
                    sections: JSON.parse(JSON.stringify(target.sections)),
                    scenes: target.scenes?.length ? JSON.parse(JSON.stringify(target.scenes)) : s.scenes,
                    updatedAt: new Date().toISOString(),
                  };
                }
              }
              return s;
            }),
          };
        }
        return p;
      })
    );
    triggerToast('info', 'VERSION RESTORED', `Reverted screenplay to Snapshot v${versionNumber}.0.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  const createScriptFromIdea = useCallback((idea: Idea): Script => {
    playCockpitBeep('engage');
    const newScriptId = `script-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newScript: Script = {
      id: newScriptId,
      projectId: currentProject.id,
      ideaId: idea.id,
      title: idea.title,
      type: idea.recommendedPlatform || currentProject.targetPlatform,
      status: 'Draft',
      primaryMode: idea.primaryMode || currentProject.primaryMode,
      secondaryModes: idea.secondaryModes || [currentProject.secondaryMode],
      currentVersionNumber: 1,
      settings: {
        topic: idea.title,
        ideaText: `${idea.hook}\n\n${idea.concept}`,
        audience: idea.targetAudience,
        platform: idea.recommendedPlatform,
        duration: idea.estimatedDuration,
        language: currentProject.language,
        tone: 'Dramatic & Cinematic',
        narrationStyle: 'Cinematic narrator and spoken character dialogue',
        ctaStyle: idea.cta || 'Encourage community reflection in the transmission comments',
        primaryMode: idea.primaryMode,
        secondaryModes: idea.secondaryModes,
      },
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          name: 'THE HOOK',
          content: `EXT. DEEP VOID - NIGHT\n\n${idea.hook}\n\nELENA (V.O.)\nNothing in the star charts prepared us for the frequency that answered.`,
          narration: idea.hook,
          targetDuration: '0:00 - 0:25',
          wordCount: 45,
          visualDescription: idea.thumbnailConcept || 'Wide shot of cosmic anomaly pulsing with relativistic light.',
          directorNotes: 'High intrigue. Open with absolute silence before sound design swells.',
          pacing: 'Ominous',
          order: 1,
        },
        {
          id: `sec-${Date.now()}-2`,
          name: 'INTRODUCTION & SETUP',
          content: `INT. COMMAND DECK - CONTINUOUS\n\nThe sensors report non-stochastic telemetry. Commander Vance analyzes the incoming carrier wave.\n\nIRIS\nTelemetry confirmed. The transmission originates from inside the horizon anomaly.`,
          narration: `Inside the cockpit, the telemetry confirmed the impossible. ${idea.concept}`,
          targetDuration: '0:25 - 1:15',
          wordCount: 65,
          visualDescription: 'Translucent cyan displays casting geometric waveforms across the bridge.',
          directorNotes: 'Establish claustrophobic isolation.',
          pacing: 'Deliberate',
          order: 2,
        },
        {
          id: `sec-${Date.now()}-3`,
          name: 'CORE INVESTIGATION',
          content: `INT. LABORATORY - LATER\n\nDr. Thorne decodes the nested mathematical structure. The frequency reveals artificial modulation.\n\nTHORNE\nIt is not cosmic radiation. It is an intentional transmission.`,
          narration: `The deeper we decoded the carrier wave, the more physics unraveled. ${idea.uniqueAngle || ''}`,
          targetDuration: '1:15 - 2:45',
          wordCount: 85,
          visualDescription: 'Volumetric emerald lattices rotating in zero-g.',
          directorNotes: 'Building intellectual vertigo.',
          pacing: 'Accelerating',
          order: 3,
        },
        {
          id: `sec-${Date.now()}-4`,
          name: 'THE CLIMAX',
          content: `EXT. ANOMALY BOUNDARY - CONTINUOUS\n\nThe scout probe crosses the threshold. Cause and effect fracture as the telemetry loops back.\n\nELENA\nHold the lock! What is transmitting?!`,
          narration: 'We reached into the singularity, knowing that once an object crosses the threshold, cause and effect decouple forever.',
          targetDuration: '2:45 - 3:45',
          wordCount: 75,
          visualDescription: 'Probe plume bending into a luminous halo around the black sphere.',
          directorNotes: 'Peak sensory intensity.',
          pacing: 'Kinetic',
          order: 4,
        },
        {
          id: `sec-${Date.now()}-5`,
          name: 'RESOLUTION & CTA',
          content: "INT. COMMAND DECK - CONTINUOUS\n\nA familiar human voice breaks through the radio static.\n\nVOICE (OVER RADIO)\nDo not deploy the probe.\n\nCommander Vance freezes.",
          narration: 'The transmission was not an echo. It was a warning from our own future.',
          targetDuration: '3:45 - 4:30',
          wordCount: 45,
          visualDescription: "Extreme close up of Commander Vance's eyes reflecting the frozen console.",
          directorNotes: 'Dead stop on music. Let the breathing in static carry the cliffhanger.',
          pacing: 'Suspenseful freeze',
          order: 5,
        },
      ],
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          projectId: currentProject.id,
          scriptId: newScriptId,
          sceneNumber: 1,
          slugline: 'INT. COMMAND BRIDGE - DEEP SPACE NIGHT',
          timeOfDay: 'DEEP VOID',
          summary: `Commander Vance observes the anomaly while the automated array detects ${idea.title}.`,
          dialogueCount: 4,
          characters: ['Elena Vance', 'IRIS'],
          status: 'Draft',
          duration: '01:15',
          durationSec: 75,
          cameraDirection: 'Slow Dolly In, Eye Level',
          shotType: 'Medium Close-up',
          lightingMood: 'High-contrast cyan console glow with deep amber accretion backdrop',
          voiceover: idea.hook,
          content: "INT. COMMAND BRIDGE - DEEP SPACE NIGHT\n\nElena Vance looks through the panoramic canopy into the abyss.\n\nELENA\nIRIS, verify the telemetry array.\n\nIRIS\nAnomaly detected along the photon boundary. Repetition frequency 1420 megahertz.",
        },
        {
          id: `scene-${Date.now()}-2`,
          projectId: currentProject.id,
          scriptId: newScriptId,
          sceneNumber: 2,
          slugline: 'INT. SIGNAL ANALYSIS BAY - CONTINUOUS',
          timeOfDay: 'DEEP VOID',
          summary: 'Dr. Thorne breaks down the mathematical modulation of the carrier wave.',
          dialogueCount: 5,
          characters: ['Elena Vance', 'Dr. Kenneth Thorne'],
          status: 'Draft',
          duration: '01:30',
          durationSec: 90,
          cameraDirection: 'Tracking Handheld',
          shotType: 'Medium Two-Shot',
          lightingMood: 'Green holographic phosphor reflections against dark bulkheads',
          voiceover: 'The deeper we decoded the signal, the more physics unraveled.',
          content: "INT. SIGNAL ANALYSIS BAY - CONTINUOUS\n\nDr. Thorne manipulates volumetric waveforms with trembling hands.\n\nTHORNE\nIt is not random gravitational noise, Commander. It is structured modulation.",
        },
      ],
      versions: [
        {
          versionNumber: 1,
          timestamp,
          title: 'Initial Idea Expansion v1.0',
          sections: [],
          scenes: [],
          summaryNote: `Autonomous expansion from vaulted idea "${idea.title}".`,
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Update project state
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          const updatedIdeas = (p.ideas || []).map((i) =>
            i.id === idea.id ? { ...i, status: 'scripted' as const } : i
          );
          return {
            ...p,
            ideas: updatedIdeas,
            scripts: [newScript, ...(p.scripts || [])],
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );

    triggerToast('success', 'SCRIPT FORMED', `Expanded "${idea.title}" into Screenplay Workstation.`);
    return newScript;
  }, [currentProject.id, currentProject.primaryMode, currentProject.secondaryMode, currentProject.language, currentProject.targetPlatform, playCockpitBeep, triggerToast]);

  const syncScriptToProduction = useCallback((script: Script) => {
    playCockpitBeep('engage');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          // Sync scenes into project master scenes
          const syncedScenes = script.scenes && script.scenes.length > 0
            ? script.scenes.map((sc, idx) => ({
                ...sc,
                projectId: p.id,
                sceneNumber: idx + 1,
                status: 'Approved' as const,
              }))
            : p.scenes;

          // If project has no shots or user wants initial shot list from scenes:
          const existingShots = p.shots || [];
          const generatedShots: ProductionShot[] = [];

          syncedScenes.forEach((sc) => {
            const hasShot = existingShots.some((sh) => sh.sceneId === sc.id);
            if (!hasShot) {
              generatedShots.push({
                id: `shot-${Date.now()}-${sc.sceneNumber}-1`,
                sceneId: sc.id,
                shotNumber: `${sc.sceneNumber}.01`,
                shotType: (sc.shotType as any) || 'Establishing',
                cameraMovement: (sc.cameraMovement as any) || sc.cameraDirection || 'Orbiting Close-up',
                lens: '35mm Anamorphic T1.8',
                lightingPrompt: sc.lightingMood || 'Volumetric space glow with cyan rim accents',
                visualPrompt: `${sc.slugline}. ${sc.summary}. Photorealistic cinematic 4K.`,
                status: 'Ready',
              });
            }
          });

          return {
            ...p,
            scenes: syncedScenes,
            shots: [...existingShots, ...generatedShots],
            pipelineProgress: {
              ...p.pipelineProgress,
              Script: 'Ready',
              Story: 'Ready',
              Production: 'In Progress',
            },
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
    triggerToast('success', 'PRODUCTION SYNCED', `Screenplay scenes & camera shots committed to Production Engine.`);
  }, [currentProject.id, playCockpitBeep, triggerToast]);

  // Production Jobs
  const createProductionJob = useCallback((type: JobType, input: Record<string, any>): ProductionJob => {
    const job = JobService.createJob(currentProject.id, type, input, 'Queued');
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            jobs: [job, ...p.jobs],
          };
        }
        return p;
      })
    );
    return job;
  }, [currentProject.id]);

  const updateProductionJob = useCallback((jobId: string, status: JobStatus, output?: any, error?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === currentProject.id) {
          return {
            ...p,
            jobs: p.jobs.map((j) => (j.id === jobId ? JobService.updateJobStatus(j, status, output, error) : j)),
          };
        }
        return p;
      })
    );
  }, [currentProject.id]);

  return (
    <AppContext.Provider
      value={{
        currentProject,
        projects,
        activeModule,
        telemetry,
        autosaveStatus,
        isCommandPaletteOpen,
        isCreateProjectOpen,
        isSettingsOpen,
        creationStep,
        storage,
        setActiveModule,
        selectProject,
        initializeNewProject,
        renameProject,
        archiveProject,
        restoreProject,
        deleteProject,
        exportProjectJson,
        importProjectJson,
        updatePipelineStage,
        updateSceneContent,
        updateSceneStatus,
        addNewScene,
        deleteScene,
        updateShotStatus,
        addNewShot,
        deleteShot,
        addNewAsset,
        deleteAsset,
        setStoryModes,
        updateBible,
        addCharacter,
        updateCharacter,
        deleteCharacter,
        addLocation,
        updateLocation,
        deleteLocation,
        saveIdea,
        updateIdea,
        deleteIdea,
        duplicateIdea,
        saveScript,
        updateScript,
        deleteScript,
        saveScriptVersion,
        restoreScriptVersion,
        createScriptFromIdea,
        syncScriptToProduction,
        createProductionJob,
        updateProductionJob,
        triggerToast,
        requestConfirmation,
        setIsCommandPaletteOpen,
        setIsCreateProjectOpen,
        setIsSettingsOpen,
      }}
    >
      {children}

      {/* Global Notifications Toast Stack */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />

      {/* Global Confirmation Modal */}
      {confirmation && (
        <ConfirmationModal
          isOpen={true}
          title={confirmation.title}
          message={confirmation.message}
          confirmLabel={confirmation.confirmLabel}
          cancelLabel={confirmation.cancelLabel}
          isDanger={confirmation.isDanger}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(null)}
        />
      )}

      {/* Master Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
