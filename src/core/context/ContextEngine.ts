import { Project, ScriptScene, StoryModeConfig } from '../../types';
import { computeStoryModeFusion, getStoryModeConfig } from '../story-mode/storyModes';

export interface ContextAssemblyOptions {
  includeBible?: boolean;
  includeCharacters?: boolean;
  characterIds?: string[];
  includeLocations?: boolean;
  locationIds?: string[];
  includeScene?: boolean;
  sceneId?: string;
  includeStoryMode?: boolean;
  maxTokenBudget?: number;
}

export interface AssembledContext {
  projectId: string;
  projectName: string;
  storyMode: {
    primary: string;
    secondary: string;
    fusedTone: string;
    fusedPacing: string;
    fusedVisualStyle: string;
  };
  bibleExtract?: {
    premise: string;
    worldLore: string;
    primaryConflict: string;
    rulesOfWorld: string[];
  };
  characters?: {
    name: string;
    role: string;
    archetype: string;
    voiceStyle: string;
  }[];
  locations?: {
    name: string;
    environment: string;
    atmosphere: string;
  }[];
  targetScene?: {
    sceneNumber: number;
    slugline: string;
    summary: string;
    characters: string[];
  };
  contextTimestamp: string;
  estimatedContextTokens: number;
}

export class ContextEngine {
  /**
   * Assembles surgical, query-specific context from the Project Core.
   * Avoids sending the entire project state blindly.
   */
  static buildContext(project: Project, options: ContextAssemblyOptions = {}): AssembledContext {
    const fusion = computeStoryModeFusion(project.primaryMode || project.storyMode, project.secondaryMode || project.secondaryStoryMode);

    const assembled: AssembledContext = {
      projectId: project.id,
      projectName: project.name,
      storyMode: {
        primary: fusion.primary.name,
        secondary: fusion.secondary.name,
        fusedTone: fusion.fusedTone,
        fusedPacing: fusion.fusedPacing,
        fusedVisualStyle: fusion.fusedVisualStyle,
      },
      contextTimestamp: new Date().toISOString(),
      estimatedContextTokens: 120, // Baseline overhead
    };

    // Include Bible if requested
    if (options.includeBible && project.bible) {
      assembled.bibleExtract = {
        premise: project.bible.premise,
        worldLore: project.bible.worldLore,
        primaryConflict: project.bible.primaryConflict,
        rulesOfWorld: project.bible.rulesOfWorld || [],
      };
      assembled.estimatedContextTokens += 350;
    }

    // Include relevant characters only
    if (options.includeCharacters && project.characters) {
      const chars = options.characterIds && options.characterIds.length > 0
        ? project.characters.filter((c) => options.characterIds!.includes(c.id))
        : project.characters.slice(0, 4); // Top 4 to stay inside token budget

      assembled.characters = chars.map((c) => ({
        name: c.name,
        role: c.role,
        archetype: c.archetype,
        voiceStyle: c.voiceStyle,
      }));
      assembled.estimatedContextTokens += chars.length * 110;
    }

    // Include relevant locations only
    if (options.includeLocations && project.locations) {
      const locs = options.locationIds && options.locationIds.length > 0
        ? project.locations.filter((l) => options.locationIds!.includes(l.id))
        : project.locations.slice(0, 3);

      assembled.locations = locs.map((l) => ({
        name: l.name,
        environment: l.environment,
        atmosphere: l.atmosphere,
      }));
      assembled.estimatedContextTokens += locs.length * 90;
    }

    // Include target scene if specified
    if (options.includeScene && options.sceneId && project.scenes) {
      const scene = project.scenes.find((s) => s.id === options.sceneId);
      if (scene) {
        assembled.targetScene = {
          sceneNumber: scene.sceneNumber,
          slugline: scene.slugline,
          summary: scene.summary,
          characters: scene.characters,
        };
        assembled.estimatedContextTokens += 180;
      }
    }

    return assembled;
  }

  static assembleContext(project: Project, taskType?: string, depth?: string): AssembledContext {
    return this.buildContext(project, {
      includeBible: true,
      includeCharacters: true,
      includeLocations: true,
      includeStoryMode: true,
    });
  }

  /**
   * Surgical Context Builder for Idea Synthesizer
   */
  static buildIdeaContext(project: Project, inputs: Record<string, any> = {}): Record<string, any> {
    const fusion = computeStoryModeFusion(
      inputs.primaryMode || project.primaryMode || project.storyMode,
      inputs.secondaryModes?.[0] || project.secondaryMode || project.secondaryStoryMode
    );

    return {
      projectId: project.id,
      projectName: project.name,
      missionObjective: project.missionObjective,
      storyMode: {
        primary: fusion.primary.name,
        secondary: fusion.secondary.name,
        fusedTone: fusion.fusedTone,
        fusedPacing: fusion.fusedPacing,
        fusedVisualStyle: fusion.fusedVisualStyle,
        hookStyle: fusion.primary.targetTone || 'Curiosity & High Intrigue',
      },
      niche: inputs.niche || project.contentType,
      targetAudience: inputs.targetAudience || 'General Creators & Enthusiasts',
      platform: inputs.platform || project.targetPlatform,
      contentType: inputs.contentType || project.contentType,
      language: inputs.language || project.language,
      tone: inputs.tone || fusion.fusedTone,
      videoDuration: inputs.videoDuration || '8–12 minutes',
      goal: inputs.goal || 'High Views / Reach',
      currentTrendContext: inputs.currentTrendContext || project.analytics?.telemetryNotes?.join(' ') || '',
      competitorReference: inputs.competitorReference || '',
      keywords: inputs.keywords || project.seo?.keywords || [],
      userNotes: inputs.userNotes || '',
      referenceContext: inputs.referenceContext || project.bible?.premise || '',
      estimatedContextTokens: 240,
    };
  }

  /**
   * Surgical Context Builder for Script Studio
   */
  static buildScriptContext(
    project: Project,
    settings: Record<string, any> = {},
    sourceIdea?: Record<string, any>
  ): Record<string, any> {
    const fusion = computeStoryModeFusion(
      settings.primaryMode || project.primaryMode || project.storyMode,
      settings.secondaryModes?.[0] || project.secondaryMode || project.secondaryStoryMode
    );

    return {
      projectId: project.id,
      projectName: project.name,
      topic: settings.topic || sourceIdea?.title || project.name,
      sourceIdea: sourceIdea
        ? {
            id: sourceIdea.id,
            title: sourceIdea.title,
            hook: sourceIdea.hook,
            concept: sourceIdea.concept || sourceIdea.coreConcept,
            uniqueAngle: sourceIdea.uniqueAngle,
          }
        : undefined,
      storyBible: project.bible
        ? {
            premise: project.bible.premise,
            synopsis: project.bible.synopsis,
            worldLore: project.bible.worldLore,
            primaryConflict: project.bible.primaryConflict,
            coreTheme: project.bible.coreTheme,
            rulesOfWorld: project.bible.rulesOfWorld || [],
          }
        : undefined,
      characters: (project.characters || []).slice(0, 4).map((c) => ({
        name: c.name,
        role: c.role,
        archetype: c.archetype,
        voiceStyle: c.voiceStyle,
        traits: c.traits,
      })),
      locations: (project.locations || []).slice(0, 3).map((l) => ({
        name: l.name,
        environment: l.environment,
        atmosphere: l.atmosphere,
        visualSignatures: l.visualSignatures,
      })),
      storyModeFusion: {
        primary: fusion.primary.name,
        secondary: fusion.secondary.name,
        fusedTone: fusion.fusedTone,
        fusedPacing: fusion.fusedPacing,
        fusedVisualStyle: fusion.fusedVisualStyle,
        narrativeStructure: fusion.primary.description,
        pacing: fusion.primary.pacing,
      },
      settings: {
        audience: settings.audience || 'Sci-Fi and Narrative audiences',
        platform: settings.platform || project.targetPlatform,
        duration: settings.duration || '8–10 minutes',
        language: settings.language || project.language,
        tone: settings.tone || fusion.fusedTone,
        narrationStyle: settings.narrationStyle || 'Cinematic narrator and character dialogue',
        ctaStyle: settings.ctaStyle || 'Engaging community reflection question',
      },
      estimatedContextTokens: 680,
    };
  }
}
