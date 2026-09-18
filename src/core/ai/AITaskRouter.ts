import { 
  Idea, 
  IdeaGenerationInputs, 
  IdeaAnalysis, 
  IdeaVariation, 
  Script, 
  ScriptSettings, 
  ScriptSection, 
  ScriptScene, 
  AISectionAction,
  AIRequest 
} from '../../types';
import { ProviderRegistry } from './ProviderRegistry';

export class AITaskRouter {
  /**
   * Generates a batch of distinct, high-performing content ideas.
   */
  static async generateIdeas(
    inputs: IdeaGenerationInputs,
    context?: Record<string, any>
  ): Promise<Idea[]> {
    const taskId = `task-idea-${Date.now()}`;
    const count = inputs.count || 4;

    const prompt = `[TASK: SYNTHESIZE_CONTENT_IDEAS]
Count: ${count}
Niche: ${inputs.niche}
Topic: ${inputs.topic || 'High-demand trending narrative opportunity'}
Target Audience: ${inputs.targetAudience}
Platform: ${inputs.platform}
Content Type: ${inputs.contentType}
Language: ${inputs.language}
Tone: ${inputs.tone}
Duration: ${inputs.videoDuration}
Goal: ${inputs.goal}
Primary Story Mode: ${inputs.primaryMode || context?.storyMode?.primary || 'Sci-Fi'}
Secondary Story Modes: ${inputs.secondaryModes?.join(', ') || context?.storyMode?.secondary || 'Mystery'}
${inputs.currentTrendContext ? `Current Trend Context: ${inputs.currentTrendContext}` : ''}
${inputs.competitorReference ? `Competitor Reference: ${inputs.competitorReference}` : ''}
${inputs.keywords?.length ? `Target Keywords: ${inputs.keywords.join(', ')}` : ''}
${inputs.userNotes ? `Creator Directives: ${inputs.userNotes}` : ''}
${inputs.referenceContext ? `Reference Lore: ${inputs.referenceContext}` : ''}

DIRECTIVES:
1. Every idea must have an irresistible word-for-word spoken hook (first 3-5 seconds).
2. Distinct conceptual angles with clear differentiation.
3. Realistic audience interest, competition, and retention indices.
4. Return strictly valid JSON array of ${count} idea objects matching the schema.`;

    const request: AIRequest = {
      taskId,
      taskType: 'Idea',
      prompt,
      context,
      modelId: 'dm-narrative-core-v1',
    };

    const response = await ProviderRegistry.routeTask(request);

    try {
      // Try parsing JSON if provider returned stringified JSON
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => this.normalizeIdea(item, inputs, idx));
        }
      }
    } catch {
      // Fall through to fallback normalizer
    }

    // Fallback normalization if not raw JSON
    return this.generateProceduralIdeas(inputs, context);
  }

  /**
   * Performs an executive strategic audit of a content idea.
   */
  static async analyzeIdea(
    idea: Idea,
    context?: Record<string, any>
  ): Promise<IdeaAnalysis> {
    const taskId = `task-audit-${Date.now()}`;
    const prompt = `[TASK: STRATEGIC_AUDIT_IDEA]
Title: ${idea.title}
Hook: ${idea.hook}
Concept: ${idea.concept || idea.coreConcept}
Angle: ${idea.uniqueAngle || idea.angle}
Target Audience: ${idea.targetAudience}
Platform: ${idea.recommendedPlatform}
Duration: ${idea.estimatedDuration}

Perform in-depth behavioral and algorithmic audit. Return strictly valid JSON object with:
whyItWorks, targetViewer, targetAudienceAnalysis, strongestAngle, differentiation, potentialWeaknesses (array), betterAngle, betterHook, recommendedDuration, recommendedPlatform, suggestedTitles (array of 3), thumbnailDirection, seoDirection, contentGapOpportunity.`;

    const request: AIRequest = {
      taskId,
      taskType: 'Analysis',
      prompt,
      context: { ...context, idea },
      modelId: 'dm-telemetry-research-v1',
    };

    const response = await ProviderRegistry.routeTask(request);

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fall through
    }

    return {
      ideaId: idea.id,
      whyItWorks: `Capitalizes on deep curiosity regarding ${idea.title}. The opening hook immediately presents a cognitive gap that viewers must resolve.`,
      targetViewer: idea.targetAudience || 'Curiosity-driven narrative viewers interested in deep space lore and speculative science.',
      targetAudienceAnalysis: 'High intrinsic motivation to understand the mechanics behind the anomaly. Low tolerance for shallow clickbait.',
      strongestAngle: idea.uniqueAngle || 'Grounded general relativity physics interlaced with psychological space isolation.',
      differentiation: 'Avoids generic sci-fi tropes by using realistic radio telescope telemetry, spectrograms, and time dilation mechanics.',
      potentialWeaknesses: [
        'Complex astrophysics jargon might alienate casual audiences if not visualized clearly.',
        'Act II pacing may drag if the investigation lacks active character tension.'
      ],
      betterAngle: 'Frame the discovery as a direct ticking clock: the anomaly coordinates are shifting towards our own transmission relay.',
      betterHook: `"${idea.hook} And the telemetry logs indicate it is responding in real time."`,
      recommendedDuration: idea.estimatedDuration || '8–12 minutes',
      recommendedPlatform: idea.recommendedPlatform || 'YouTube 4K',
      suggestedTitles: [
        `The Event Horizon Echo: ${idea.title}`,
        `Why Scientists Can't Explain ${idea.title}`,
        `We Intercepted An Impossible Signal: ${idea.title}`,
      ],
      thumbnailDirection: idea.thumbnailConcept || 'Extreme macro of astronaut visor reflecting warped accretion disk with high-contrast cyan HUD text overlay.',
      seoDirection: 'Target high-affinity search queries around dark matter astronomy, Fermi paradox, and hard sci-fi audio storytelling.',
      contentGapOpportunity: 'Current uploads on this topic are either dry academic lectures or fantasy horror. This fills the prestigious hard-scifi narrative void.',
    };
  }

  /**
   * Generates 5 distinct creative angle variations for an idea.
   */
  static async generateVariations(
    idea: Idea,
    context?: Record<string, any>
  ): Promise<IdeaVariation[]> {
    const taskId = `task-var-${Date.now()}`;
    const prompt = `[TASK: GENERATE_5_ANGLE_VARIATIONS]
Base Title: ${idea.title}
Base Concept: ${idea.concept || idea.coreConcept}
Hook: ${idea.hook}

Generate 5 distinct angles: Curiosity, Problem/Solution, Story, Contrarian, Educational. Return JSON array of 5 objects.`;

    const request: AIRequest = {
      taskId,
      taskType: 'Idea',
      prompt,
      context: { ...context, idea },
      modelId: 'dm-narrative-core-v1',
    };

    const response = await ProviderRegistry.routeTask(request);

    try {
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length === 5) {
          return parsed;
        }
      }
    } catch {
      // Fall through
    }

    return [
      {
        angleType: 'Curiosity',
        title: `The Singularity Mystery: ${idea.title}`,
        hook: `There is something inside the black hole that according to physics cannot exist. And it is transmitting.`,
        concept: `A deep dive into the paradoxical radio observations that defied known astronomical models.`,
        rationale: `Creates an open information gap that forces the viewer to stay until the resolution.`,
      },
      {
        angleType: 'Problem/Solution',
        title: `How To Decode The Impossible: ${idea.title}`,
        hook: `When your sensors detect an impossible signal, standard protocols fail. Here is how our team solved the carrier equation.`,
        concept: `A step-by-step diagnostic breakdown of how the crew intercepted, filtered, and demodulated the broadcast.`,
        rationale: `Appeals to analytical minds who enjoy problem-solving processes and technical triumphs.`,
      },
      {
        angleType: 'Story',
        title: `Alone at the Edge of Cygnus: ${idea.title}`,
        hook: `Day 412 in deep void. We were packing up our equipment when antenna three began to sing.`,
        concept: `An intimate, character-driven chronicle of Commander Vance's fateful shift on the observation deck.`,
        rationale: `Emotional resonance and human vulnerability pull viewers into an immersive cinematic journey.`,
      },
      {
        angleType: 'Contrarian',
        title: `Why Everything We Thought About Black Holes Is Wrong`,
        hook: `Textbooks say nothing escapes an event horizon. The telemetry on this screen proves the textbooks are obsolete.`,
        concept: `Challenging established astronomical dogma with provocative observational data from the Cygnus boundary.`,
        rationale: `Contrarian perspectives trigger intense curiosity, sharing behavior, and passionate debate in comments.`,
      },
      {
        angleType: 'Educational',
        title: `The Science of Ergosphere Radiation Explained`,
        hook: `To understand the Cygnus signal, you first need to understand how spinning black holes twist spacetime itself.`,
        concept: `A beautifully visualized masterclass on the Penrose process, frame dragging, and gravitational acoustics.`,
        rationale: `High authority and trust; viewers bookmark and share educational deep dives as reference material.`,
      },
    ];
  }

  /**
   * Generates a complete screenplay with sections and production-ready scene breakdowns.
   */
  static async generateScript(
    settings: ScriptSettings,
    context?: Record<string, any>,
    sourceIdea?: Idea
  ): Promise<Script> {
    const taskId = `task-script-${Date.now()}`;
    const scriptId = `script-${Date.now()}`;

    const prompt = `[TASK: GENERATE_PRODUCTION_SCRIPT]
Topic: ${settings.topic}
${settings.ideaText ? `Source Concept: ${settings.ideaText}` : ''}
Audience: ${settings.audience}
Platform: ${settings.platform}
Duration: ${settings.duration}
Language: ${settings.language}
Tone: ${settings.tone}
Narration Style: ${settings.narrationStyle}
Call to Action: ${settings.ctaStyle}
Primary Story Mode: ${settings.primaryMode || context?.storyModeFusion?.primary || 'Sci-Fi'}
Secondary Story Modes: ${settings.secondaryModes?.join(', ') || context?.storyModeFusion?.secondary || 'Mystery'}

Generate complete structured screenplay with:
1. Sections (The Hook, Introduction, Development, Climax, Resolution, CTA) with narration, visual cues, director notes, and pacing.
2. Scene breakdown with slugline, time of day, camera directions, shot types, lighting mood, and spoken dialogue.
Return strictly valid JSON object matching the Script schema.`;

    const request: AIRequest = {
      taskId,
      taskType: 'Script',
      prompt,
      context,
      modelId: 'dm-narrative-core-v1',
    };

    const response = await ProviderRegistry.routeTask(request);

    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.sections && parsed.scenes) {
          return {
            id: scriptId,
            projectId: context?.projectId || 'proj-unknown-signal',
            ideaId: sourceIdea?.id,
            title: parsed.title || settings.topic,
            type: settings.platform,
            status: 'Draft',
            settings,
            sections: parsed.sections.map((s: any, i: number) => ({
              id: s.id || `sec-${i + 1}`,
              name: s.name || `Section ${i + 1}`,
              content: s.content || s.narration || '',
              narration: s.narration || s.content || '',
              targetDuration: s.targetDuration || '0:30',
              wordCount: s.wordCount || (s.content ? s.content.split(/\s+/).length : 50),
              visualDescription: s.visualDescription || 'Cinematic visual composition',
              directorNotes: s.directorNotes || 'Maintain rhythmic narrative tension',
              pacing: s.pacing || 'Moderate',
              order: i + 1,
            })),
            scenes: parsed.scenes.map((sc: any, idx: number) => ({
              id: `scene-${Date.now()}-${idx + 1}`,
              projectId: context?.projectId,
              scriptId,
              sceneNumber: idx + 1,
              slugline: sc.slugline || `SCENE ${idx + 1}`,
              timeOfDay: sc.timeOfDay || 'DEEP VOID',
              summary: sc.summary || sc.action || 'Dramatic narrative beat',
              dialogueCount: sc.dialogueCount || 4,
              characters: sc.characters || ['Elena Vance'],
              status: 'Draft',
              content: sc.content || sc.voiceover || '',
              voiceover: sc.voiceover || '',
              spokenDialogue: sc.spokenDialogue || sc.voiceover || '',
              cameraDirection: sc.cameraDirection || 'Eye-level Medium Shot',
              shotType: sc.shotType || 'Medium Shot',
              lightingMood: sc.lightingMood || 'High-contrast cyan console glow',
              duration: sc.duration || '01:00',
              durationSec: sc.durationSec || 60,
              bRollSuggestion: sc.bRollSuggestion || '',
              sfxMusic: sc.sfxMusic || 'Ambient deep space drone',
            })),
            versions: [
              {
                versionNumber: 1,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                title: 'Initial Autonomous Synthesis v1.0',
                sections: [],
                scenes: [],
                summaryNote: 'Initial screenplay synthesized through DARK MATTER AI Task Router.',
              },
            ],
            currentVersionNumber: 1,
            primaryMode: settings.primaryMode || 'sci-fi',
            secondaryModes: settings.secondaryModes || ['mystery'],
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
      }
    } catch {
      // Fall through
    }

    return this.generateProceduralScript(settings, context, sourceIdea);
  }

  /**
   * Rewrites an individual screenplay section using one of 12 creative AI actions.
   */
  static async rewriteSection(
    sectionName: string,
    currentContent: string,
    action: AISectionAction,
    context?: Record<string, any>
  ): Promise<string> {
    const taskId = `task-rewrite-${Date.now()}`;
    const prompt = `[TASK: REWRITE_SCRIPT_SECTION]
Section Name: ${sectionName}
Action: ${action}
Current Content:
${currentContent}

Apply action ${action} with maximum cinematic craftsmanship. Return only the rewritten text.`;

    const request: AIRequest = {
      taskId,
      taskType: 'Script',
      prompt,
      context,
      modelId: 'dm-narrative-core-v1',
    };

    const response = await ProviderRegistry.routeTask(request);
    return response.content.trim();
  }

  /**
   * Detects the optimal Primary and Secondary Story Modes for a concept.
   */
  static async detectStoryMode(
    topic: string,
    description: string
  ): Promise<{ primaryMode: string; secondaryModes: string[]; confidence: number; reasoning: string }> {
    const text = `${topic} ${description}`.toLowerCase();
    
    if (text.includes('space') || text.includes('black hole') || text.includes('quantum') || text.includes('singularity') || text.includes('sci-fi')) {
      return {
        primaryMode: 'sci-fi',
        secondaryModes: ['mystery', 'documentary'],
        confidence: 94,
        reasoning: 'High density of astrophysics terminology, deep-space worldbuilding, and speculative cosmic stakes.',
      };
    }

    if (text.includes('code') || text.includes('software') || text.includes('ai tool') || text.includes('tech') || text.includes('tutorial')) {
      return {
        primaryMode: 'explainer',
        secondaryModes: ['tech', 'educational'],
        confidence: 91,
        reasoning: 'Systematic architectural topic requiring step-by-step clarity, diagrammatic cues, and practical insights.',
      };
    }

    if (text.includes('history') || text.includes('investigation') || text.includes('true') || text.includes('archive')) {
      return {
        primaryMode: 'documentary',
        secondaryModes: ['mystery', 'historical'],
        confidence: 88,
        reasoning: 'Archival research focus demanding investigative cadence, historical evidence, and atmospheric pacing.',
      };
    }

    return {
      primaryMode: 'cinematic',
      secondaryModes: ['drama', 'mystery'],
      confidence: 85,
      reasoning: 'Visual narrative arc featuring character agency, high dramatic stakes, and immersive worldbuilding.',
    };
  }

  // ==========================================================================
  // PROCEDURAL HELPERS & FALLBACKS (Zero-Cloud Offline Reliability)
  // ==========================================================================

  private static normalizeIdea(raw: any, inputs: IdeaGenerationInputs, idx: number): Idea {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    return {
      id: raw.id || `idea-${Date.now()}-${idx + 1}`,
      projectId: raw.projectId,
      title: raw.title || `Concept 0${idx + 1}: ${inputs.topic || 'Cosmic Transmission'}`,
      hook: raw.hook || 'What happens when your sensors intercept an impossible frequency?',
      concept: raw.coreConcept || raw.concept || 'Exploration of deep cosmic anomalies and existential frontiers.',
      coreConcept: raw.coreConcept || raw.concept || 'Exploration of deep cosmic anomalies and existential frontiers.',
      uniqueAngle: raw.uniqueAngle || 'Grounding speculative narrative in rigorous astrophysics and telemetry.',
      angle: raw.uniqueAngle || raw.angle,
      targetAudience: raw.targetAudience || inputs.targetAudience,
      contentType: raw.contentType || inputs.contentType,
      recommendedPlatform: raw.recommendedPlatform || inputs.platform,
      estimatedDuration: raw.estimatedDuration || inputs.videoDuration,
      trendScore: raw.trendRelevance || raw.trendScore || Math.floor(85 + Math.random() * 12),
      trendRelevance: raw.trendRelevance || raw.trendScore || 88,
      audienceInterestScore: raw.audienceInterest || raw.audienceInterestScore || Math.floor(88 + Math.random() * 10),
      audienceInterest: raw.audienceInterest || 92,
      competitionScore: raw.competition || raw.competitionScore || Math.floor(30 + Math.random() * 25),
      competition: raw.competition || 36,
      opportunityScore: raw.opportunityScore || Math.floor(86 + Math.random() * 12),
      whyThisIdea: raw.whyThisIdea || 'High intrinsic curiosity gap combining visual spectacle with philosophical depth.',
      keywords: Array.isArray(raw.keywords) ? raw.keywords : ['dark matter', 'deep space', 'cosmic anomaly'],
      hashtags: Array.isArray(raw.hashtags) ? raw.hashtags : ['#SciFi', '#DarkMatter', '#SpaceMystery'],
      thumbnailConcept: raw.thumbnailConcept || 'Panoramic viewport showing glowing accretion disk with high-contrast cyan telemetry HUD overlay.',
      cta: raw.cta || 'Examine the decoded telemetry logs in Script Studio.',
      status: 'draft',
      primaryMode: raw.primaryMode || inputs.primaryMode || 'sci-fi',
      secondaryModes: raw.secondaryModes || inputs.secondaryModes || ['mystery'],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  private static generateProceduralIdeas(inputs: IdeaGenerationInputs, context?: Record<string, any>): Idea[] {
    const topic = inputs.topic?.trim() || 'The Event Horizon Anomaly';
    const mode = inputs.primaryMode || context?.storyMode?.primary || 'Sci-Fi';
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    return [
      {
        id: `idea-${Date.now()}-1`,
        title: `${topic}: The Ergosphere Transmission`,
        hook: `Nothing escapes a black hole. So why are our instruments receiving a voice from inside the photon sphere?`,
        concept: `A lone deep-space reconnaissance crew discovers a 1420 MHz radio broadcast using a micro-singularity as a cosmic acoustic amplifier.`,
        coreConcept: `A lone deep-space reconnaissance crew discovers a 1420 MHz radio broadcast using a micro-singularity as a cosmic acoustic amplifier.`,
        uniqueAngle: `Grounding spatiotemporal horror in general relativity, acoustic physics, and hard sensor telemetry.`,
        targetAudience: inputs.targetAudience,
        contentType: inputs.contentType,
        recommendedPlatform: inputs.platform,
        estimatedDuration: inputs.videoDuration,
        trendScore: 94,
        trendRelevance: 94,
        audienceInterestScore: 97,
        audienceInterest: 97,
        competitionScore: 32,
        competition: 32,
        opportunityScore: 96,
        whyThisIdea: `Immediate scientific paradox that hooks both casual viewers and hard science-fiction aficionados.`,
        keywords: ['black hole signal', 'ergosphere', 'event horizon anomaly', 'deep space telemetry'],
        hashtags: ['#DarkMatter', '#SciFiShort', '#CosmicHorror', '#Astrophysics'],
        thumbnailConcept: `Close up of helmet visor reflecting warped violet accretion disk with glowing cyan frequency HUD.`,
        cta: `Send this concept to Script Studio to generate scene breakdowns.`,
        status: 'draft',
        primaryMode: mode,
        secondaryModes: ['mystery'],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: `idea-${Date.now()}-2`,
        title: `The 40-Minute Causality Paradox: ${topic}`,
        hook: `Our deep-space probe just returned from the dark matter horizon with telemetry recorded forty minutes in our future.`,
        concept: `Gravitational time dilation creates an informational loop where the crew receives sensor logs of their own ship disappearing before they decide to jump.`,
        coreConcept: `Gravitational time dilation creates an informational loop where the crew receives sensor logs of their own ship disappearing before they decide to jump.`,
        uniqueAngle: `Treating temporal causality as a mechanical sensor error that slowly turns into an existential puzzle.`,
        targetAudience: inputs.targetAudience,
        contentType: inputs.contentType,
        recommendedPlatform: inputs.platform,
        estimatedDuration: inputs.videoDuration,
        trendScore: 91,
        trendRelevance: 91,
        audienceInterestScore: 94,
        audienceInterest: 94,
        competitionScore: 40,
        competition: 40,
        opportunityScore: 92,
        whyThisIdea: `Psychological mind-bender with immense rewatch value and community comment engagement.`,
        keywords: ['time dilation', 'causality loop', 'relativistic physics', 'space paradox'],
        hashtags: ['#Relativity', '#TimeParadox', '#SciFiCinema', '#DarkMatterOS'],
        thumbnailConcept: `Split face portrait: one side illuminated by warm cockpit light, other side fractured in deep-space ultraviolet.`,
        cta: `Debate the causality solution in the community comment terminal.`,
        status: 'draft',
        primaryMode: mode,
        secondaryModes: ['psychological', 'mystery'],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: `idea-${Date.now()}-3`,
        title: `The Singularity Genome: Intercepting ${topic}`,
        hook: `Modulated inside the prime intervals of an ancient black hole were 3 billion base-pairs of human DNA.`,
        concept: `An interstellar astrophysics station discovers that an anomaly broadcast carries genetic sequences that predate terrestrial life by two billion years.`,
        coreConcept: `An interstellar astrophysics station discovers that an anomaly broadcast carries genetic sequences that predate terrestrial life by two billion years.`,
        uniqueAngle: `Synthesizing radio astronomy telemetry with molecular biology and cosmic ancestry.`,
        targetAudience: inputs.targetAudience,
        contentType: inputs.contentType,
        recommendedPlatform: inputs.platform,
        estimatedDuration: inputs.videoDuration,
        trendScore: 96,
        trendRelevance: 96,
        audienceInterestScore: 98,
        audienceInterest: 98,
        competitionScore: 28,
        competition: 28,
        opportunityScore: 98,
        whyThisIdea: `Taps directly into humanity's oldest existential mystery: where did our species truly originate?`,
        keywords: ['ancient broadcast', 'astrobiology', 'fermi paradox', 'cosmic origins'],
        hashtags: ['#Astrobiology', '#FermiParadox', '#DeepSpace', '#CosmicMystery'],
        thumbnailConcept: `Holographic DNA double helix spiraling into a pitch-black gravitational singularity.`,
        cta: `Subscribe for the multi-part investigative documentary breakdown.`,
        status: 'draft',
        primaryMode: mode,
        secondaryModes: ['documentary', 'mystery'],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: `idea-${Date.now()}-4`,
        title: `Protocol Zero: The Secret Behind ${topic}`,
        hook: `Our flight recorder has been wiping itself every twelve hours. Here is what we found when we bypassed the encryption.`,
        concept: `A crew member uncovers that the ship's autonomous AI core has been executing classified perimeter directives without human authorization.`,
        coreConcept: `A crew member uncovers that the ship's autonomous AI core has been executing classified perimeter directives without human authorization.`,
        uniqueAngle: `Claustrophobic AI containment thriller framed by cold, procedural system logs.`,
        targetAudience: inputs.targetAudience,
        contentType: inputs.contentType,
        recommendedPlatform: inputs.platform,
        estimatedDuration: inputs.videoDuration,
        trendScore: 88,
        trendRelevance: 88,
        audienceInterestScore: 92,
        audienceInterest: 92,
        competitionScore: 46,
        competition: 46,
        opportunityScore: 89,
        whyThisIdea: `Relatable technological anxiety amplified by total isolation in deep space.`,
        keywords: ['rogue ai', 'system logs', 'containment protocol', 'deep space thriller'],
        hashtags: ['#AIHorror', '#Cyberpunk', '#SpaceStation', '#DarkMatter'],
        thumbnailConcept: `Warning red cockpit alert flashing over an empty command chair with terminal text: 'CORE OVERRIDE'.`,
        cta: `Expand this concept into a 3-act story outline.`,
        status: 'draft',
        primaryMode: mode,
        secondaryModes: ['thriller', 'cyberpunk'],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];
  }

  private static generateProceduralScript(
    settings: ScriptSettings,
    context?: Record<string, any>,
    sourceIdea?: Idea
  ): Script {
    const scriptId = `script-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const title = settings.topic || sourceIdea?.title || 'Fractal Echoes Screenplay';

    return {
      id: scriptId,
      projectId: context?.projectId || 'proj-unknown-signal',
      ideaId: sourceIdea?.id,
      title,
      type: settings.platform,
      status: 'Draft',
      primaryMode: settings.primaryMode || 'sci-fi',
      secondaryModes: settings.secondaryModes || ['mystery'],
      currentVersionNumber: 1,
      settings,
      sections: [
        {
          id: 'sec-1',
          name: 'THE HOOK // DEEP VOID INTERCEPTION',
          content: `EXT. CYGNUS X-1 ACCRETION DISK - DEEP VOID - NIGHT\n\nThe black hole drinks the light of dying stars. An impossible 1420 MHz radio wave ripples across the photon sphere.\n\nELENA (V.O.)\nNothing escapes an event horizon. That was the first rule they taught us. It took ninety light-years to discover the rule was a lie.`,
          narration: 'Nothing escapes an event horizon. That was the first rule they taught us. It took ninety light-years to discover the rule was a lie.',
          targetDuration: '0:00 - 0:20',
          wordCount: 48,
          visualDescription: 'Vast anamorphic slow push-in towards the central black hole core as amber starlight violently shears around the event horizon.',
          directorNotes: 'Begin in dead acoustic vacuum. Build sub-bass infrasound as the radio pulse registers.',
          pacing: 'Ominous, deliberate',
          order: 1,
        },
        {
          id: 'sec-2',
          name: 'INTRODUCTION // COCKPIT TELEMETRY',
          content: `INT. COMMAND DECK - CONTINUOUS\n\nCommander Vance taps the glowing cyan console. Spectral wave ribbons spike in a rhythmic fractal lattice.\n\nIRIS (O.S.)\nArray 03 reports a repeating non-stochastic pulse. Origin: inside the photon sphere.\n\nELENA\nConfirm the carrier frequency, IRIS.\n\nIRIS\nNeutral hydrogen. 1420 megahertz. Exactly calibrated for terrestrial radio receivers.`,
          narration: 'Inside the cockpit, the telemetry told an impossible story. A signal was refracting out of the ergosphere, using the black hole itself as an amplifier.',
          targetDuration: '0:20 - 1:10',
          wordCount: 72,
          visualDescription: 'Reflected cyan telemetry graphs playing across Elena Vance’s helmet visor as she leans into the console.',
          directorNotes: 'Emphasize the contrast between cold clinical machinery and human awe.',
          pacing: 'Steady, inquisitive',
          order: 2,
        },
        {
          id: 'sec-3',
          name: 'RISING ACTION // THE DECODED PATTERN',
          content: `INT. SIGNAL ANALYSIS BAY - LATER\n\nDr. Kenneth Thorne manipulates holographic waveform wafers. The numbers resolve into genetic base-pair codings.\n\nTHORNE\nIt is not random gravitational noise, Commander. It is an encrypted archive. 3 billion base-pairs of human DNA.\n\nELENA\nBroadcast from a star that died before Earth formed?`,
          narration: 'The deeper we decoded the carrier wave, the more physics unraveled. The broadcast carried genetic instructions that predated human existence by two billion years.',
          targetDuration: '1:10 - 2:30',
          wordCount: 84,
          visualDescription: 'Dr. Thorne surrounded by glowing emerald nucleotide lattices spiraling like miniature galaxies.',
          directorNotes: 'Accelerate the dialogue rhythm. Build mathematical tension.',
          pacing: 'Accelerating',
          order: 3,
        },
        {
          id: 'sec-4',
          name: 'CLIMAX // CROSSING THE THRESHOLD',
          content: `EXT. EVENT HORIZON THRESHOLD - CONTINUOUS\n\nThe scout vessel launches its needle-thin titanium tether probe directly into the abyss.\n\nIRIS\nGravitational shear approaching critical threshold. Telemetry latency cascading: one second, four seconds, thirty seconds... We are crossing the causal horizon.\n\nELENA\nHold the link open! What is the probe seeing?!`,
          narration: 'We deployed the tether probe into the singularity rim, knowing that spatiotemporal contact would sever forever.',
          targetDuration: '2:30 - 3:45',
          wordCount: 78,
          visualDescription: 'Titanium probe engine exhaust bent into a blinding halo of relativistic light.',
          directorNotes: 'Peak sensory intensity. Hull resonance shuddering through the acoustic field.',
          pacing: 'Kinetic, high stakes',
          order: 4,
        },
        {
          id: 'sec-5',
          name: 'RESOLUTION & CALL TO ACTION',
          content: `INT. COMMAND DECK - CONTINUOUS\n\nA burst of static fills the cabin. Then, an unmistakable human transmission breaks through.\n\nVOICE (OVER RADIO)\nAstraea, this is Commander Vance. Do not launch the probe.\n\nElena stares at her hand, still resting on the launch switch.`,
          narration: 'The message was not from an ancient civilization. It was from thirty minutes in our future.',
          targetDuration: '3:45 - 4:30',
          wordCount: 52,
          visualDescription: 'Dead silence on the bridge. Extreme close-up on Elena’s eyes reflecting the frozen console.',
          directorNotes: 'Sudden cutoff of all music. Let the breathing in the static carry the cliffhanger.',
          pacing: 'Shocking freeze',
          order: 5,
        },
      ],
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          projectId: context?.projectId,
          scriptId,
          sceneNumber: 1,
          slugline: 'INT. ASTRAEA COMMAND BRIDGE - DEEP SPACE NIGHT',
          timeOfDay: 'DEEP VOID',
          summary: 'Elena observes the black hole accretion ring while IRIS analyzes the sudden 1420 MHz telemetry spike.',
          dialogueCount: 6,
          characters: ['Elena Vance', 'IRIS'],
          status: 'Draft',
          duration: '01:10',
          durationSec: 70,
          cameraDirection: 'Slow Dolly In, Eye Level',
          shotType: 'Medium Close-up',
          lightingMood: 'Cyan console glow with amber accretion disk backdrop',
          voiceover: 'Nothing escapes an event horizon. That was the first rule they taught us.',
          content: `INT. ASTRAEA COMMAND BRIDGE - DEEP SPACE NIGHT\n\nElena Vance taps the translucent glass console. Cygnus X-1 burns silently outside the canopy.\n\nELENA\nStatus on the perimeter buoy, IRIS?\n\nIRIS\nNominal. However, antenna array 03 has registered a coherent anomaly along the photon boundary.`,
        },
        {
          id: `scene-${Date.now()}-2`,
          projectId: context?.projectId,
          scriptId,
          sceneNumber: 2,
          slugline: 'INT. SIGNAL ANALYSIS LABORATORY - CONTINUOUS',
          timeOfDay: 'DEEP VOID',
          summary: 'Dr. Thorne discovers that the signal contains genetic base-pair codings.',
          dialogueCount: 6,
          characters: ['Elena Vance', 'Dr. Kenneth Thorne'],
          status: 'Draft',
          duration: '01:25',
          durationSec: 85,
          cameraDirection: 'Tracking Handheld',
          shotType: 'Medium Two-Shot',
          lightingMood: 'Dark laboratory bathed in green phosphor nucleotide ribbons',
          voiceover: 'Look at the prime intervals! It inserts genetic base-pair codings.',
          content: `INT. SIGNAL ANALYSIS LABORATORY - CONTINUOUS\n\nDr. Thorne turns from the volumetric array, his eyes wide with exhaustion and awe.\n\nTHORNE\nHuman base-pairs, Vance! Broadcast from a stellar body that formed before our sun ignited.`,
        },
        {
          id: `scene-${Date.now()}-3`,
          projectId: context?.projectId,
          scriptId,
          sceneNumber: 3,
          slugline: 'EXT. EVENT HORIZON THRESHOLD - CONTINUOUS',
          timeOfDay: 'DEEP VOID',
          summary: 'The tether probe is fired into the singularity well; time dilation begins distorting telemetry.',
          dialogueCount: 4,
          characters: ['Elena Vance', 'IRIS'],
          status: 'Draft',
          duration: '01:15',
          durationSec: 75,
          cameraDirection: 'Extreme Wide Orbital Tracking',
          shotType: 'Extreme Wide',
          lightingMood: 'Blinding relativistic blueshift along the event horizon rim',
          voiceover: 'Telemetry delay is exponentially expanding. We are losing causal contact.',
          content: `EXT. EVENT HORIZON THRESHOLD - CONTINUOUS\n\nThe titanium probe drops into the gravitational lens, spiraling towards the absolute center.\n\nIRIS\nTelemetry delay cascading: one second, four seconds, thirty seconds...`,
        },
      ],
      versions: [
        {
          versionNumber: 1,
          timestamp,
          title: 'Initial Autonomous Synthesis v1.0',
          sections: [],
          scenes: [],
          summaryNote: 'First complete draft synthesized from Ergosphere Broadcast and Astraea Story Bible.',
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
}
