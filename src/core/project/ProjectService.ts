import { 
  Project, 
  CharacterProfile, 
  LocationProfile, 
  ScriptScene, 
  ProductionShot, 
  MediaAsset, 
  StoryBible, 
  Story, 
  ProductionJob,
  JobType,
  ProjectVersion,
  ModuleId,
  SEOData,
  RepurposeData
} from '../../types';
import { JobService } from '../jobs/JobService';

export class ProjectService {
  /**
   * Generates a new Project entity with default initialized memory structures.
   */
  static createNewProject(params: {
    name: string;
    description: string;
    contentType: Project['contentType'];
    primaryMode: string;
    secondaryMode: string;
    primaryLanguage: string;
    targetPlatform: Project['targetPlatform'];
    missionObjective: string;
  }): Project {
    const id = `proj-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const codename = `MISSION: ${params.name.trim().toUpperCase().slice(0, 10)}-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: Project = {
      id,
      name: params.name.trim() || 'UNTITLED EXPEDITION',
      codename,
      description: params.description || 'Deep space creative mission initialized on Dark Matter Command OS.',
      status: 'Active',
      language: params.primaryLanguage || 'English (Galactic Standard)',
      contentType: params.contentType || 'Sci-Fi Short Film',
      storyMode: params.primaryMode || 'sci-fi',
      secondaryStoryMode: params.secondaryMode || 'mystery',
      primaryMode: params.primaryMode || 'sci-fi',
      secondaryMode: params.secondaryMode || 'mystery',
      fusionScore: Math.floor(88 + Math.random() * 10),
      primaryLanguage: params.primaryLanguage || 'English (Galactic Standard)',
      targetPlatform: params.targetPlatform || 'YouTube 4K',
      missionObjective: params.missionObjective || 'Execute complete narrative architecture, character memory binding, and visual shot breakdown.',
      currentModule: 'dashboard',
      systemState: 'ACTIVE MISSION',
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {
        engineVersion: '2.0-CoreOS',
        storageType: 'local-first',
      },
      pipelineProgress: {
        research: 'completed',
        ideas: 'in-progress',
        story: 'pending',
        script: 'pending',
        production: 'pending',
        media: 'pending',
        video: 'pending',
        seo: 'pending',
        publishing: 'pending',
      },
      bible: {
        premise: `${params.name}: A narrative exploration in the ${params.primaryMode} genre.`,
        worldLore: 'Operational parameters initialized. Spacecraft sensors tuned to regional anomaly frequencies.',
        primaryConflict: 'Balancing the drive for forbidden cosmic discovery against existential safety.',
        coreTheme: 'Curiosity, survival, and the unknown boundaries of human intellect.',
        rulesOfWorld: [
          'Signal transmission latency increases proportional to solar distance.',
          'Autonomous AI sub-cores operate on isolated quantum optical buses.',
        ],
      },
      characters: [
        {
          id: `char-${Date.now()}-1`,
          name: 'Command Specialist',
          role: 'Protagonist',
          archetype: 'Expedition Lead',
          backstory: 'Veteran pilot of the Frontier Survey Division.',
          voiceStyle: 'Grounded, authoritative, deliberate',
          traits: ['Determined', 'Tactical', 'Intuitive'],
        },
      ],
      locations: [
        {
          id: `loc-${Date.now()}-1`,
          name: 'Primary Command Deck',
          environment: 'Atmospheric Cockpit',
          atmosphere: 'Pressurized command bridge with panoramic view of celestial filaments.',
          visualSignatures: ['Holographic control arrays', 'Volumetric optical HUDs'],
          scenesLinked: 1,
        },
      ],
      stories: [
        {
          id: `story-${Date.now()}-1`,
          projectId: id,
          title: params.name,
          premise: `${params.name}: Narrative premise in development.`,
          synopsis: 'Three-act progression currently being synthesized.',
          genre: params.primaryMode,
          primaryMode: params.primaryMode,
          secondaryMode: params.secondaryMode,
          status: 'Concept',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          sceneNumber: 1,
          slugline: `INT. COMMAND DECK - ${params.name.toUpperCase()} INITIALIZATION`,
          timeOfDay: 'DEEP VOID',
          summary: 'Mission launch and primary sensor synchronization.',
          dialogueCount: 2,
          characters: ['Command Specialist'],
          status: 'Draft',
          content: `INT. COMMAND DECK - ${params.name.toUpperCase()} INITIALIZATION\n\nDeep vacuum outside the observation array. The holographic core spins to life with a quiet hum.\n\nCOMMAND SPECIALIST\nSystem online. Sensors locked on target coordinates. Transmission underway.`,
        },
      ],
      shots: [
        {
          id: `shot-${Date.now()}-1`,
          sceneId: `scene-${Date.now()}-1`,
          shotNumber: '1.01',
          cameraMovement: 'Static Wide',
          lens: '35mm Anamorphic',
          lightingPrompt: 'Moody cockpit illumination contrasting deep black viewport space vacuum',
          status: 'Ready',
        },
      ],
      assets: [],
      jobs: [],
      ideas: [],
      scripts: [],
      seo: {
        title: `${params.name.toUpperCase()} // Mission Production`,
        description: params.description || `Cinematic production for ${params.name}.`,
        keywords: [params.name.toLowerCase(), params.primaryMode, 'sci-fi', 'dark matter', 'space'],
        tags: [params.name.toLowerCase().replace(/\s+/g, ''), 'scifi', 'cinema'],
        hashtags: [`#${params.name.replace(/\s+/g, '')}`, '#DarkMatter'],
        category: 'Film & Animation',
      },
      analytics: {
        estimatedViews: '150K - 500K',
        projectedRetention: '64.2%',
        hookDropoffRate: '14.5%',
        audienceEngagementScore: 88,
        keywordSearchVolume: 'Moderate',
        viralPotential: 'High',
        telemetryNotes: ['Audience interest peaking in speculative cosmic narrative themes.'],
      },
      filmMode: {
        sourceTitle: params.name,
        sourceFormat: 'Movie',
        sourceStatus: 'AWAITING_SOURCE',
        tensionCurvePoints: [15, 30, 50, 75, 90, 60],
        cadenceBpm: 60,
        originalExplanationAngle: 'Transformative breakdown and original scene recreation.',
        seriesParts: [],
        authorizedTransformationNotice: 'Authorized transformative analysis and original creative production pipeline.',
      },
      repurpose: {
        segments: [],
      },
      versionHistory: [
        {
          id: `ver-${Date.now()}`,
          projectId: id,
          version: '1.0.0',
          timestamp,
          changeType: 'CREATE',
          module: 'dashboard',
          description: `Mission "${params.name}" initialized.`,
        },
      ],
    };

    return newProject;
  }

  /**
   * Appends an immutable version audit log to the project.
   */
  static logVersion(
    project: Project,
    changeType: ProjectVersion['changeType'],
    module: ModuleId,
    description: string
  ): Project {
    const nextVerNumber = (project.versionHistory.length + 1).toString();
    const versionRecord: ProjectVersion = {
      id: `ver-${Date.now()}`,
      projectId: project.id,
      version: `1.${project.versionHistory.length}.0`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      changeType,
      module,
      description,
    };

    return {
      ...project,
      updatedAt: versionRecord.timestamp,
      versionHistory: [versionRecord, ...project.versionHistory],
    };
  }

  static renameProject(project: Project, newName: string): Project {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === project.name) return project;
    const updated: Project = {
      ...project,
      name: trimmed,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    return this.logVersion(updated, 'UPDATE', 'dashboard', `Renamed mission to "${trimmed}"`);
  }

  static archiveProject(project: Project): Project {
    const updated: Project = {
      ...project,
      status: 'Archived',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    return this.logVersion(updated, 'UPDATE', 'dashboard', 'Archived project to cold storage vault');
  }

  static restoreProject(project: Project): Project {
    const updated: Project = {
      ...project,
      status: 'Active',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    return this.logVersion(updated, 'RESTORE', 'dashboard', 'Restored project to active mission status');
  }
}
