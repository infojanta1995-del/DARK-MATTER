export type ThemeMode = 'dark' | 'light' | 'mixed';
export type AccentColor = 'purple' | 'cyan' | 'blue' | 'green' | 'orange' | 'pink' | 'red';
export type PerformanceLevel = 'high' | 'medium' | 'low';

export type PipelineStage = 
  | 'research'
  | 'ideas'
  | 'story'
  | 'script'
  | 'production'
  | 'media'
  | 'video'
  | 'seo'
  | 'publishing';

export type StageStatus = 'completed' | 'in-progress' | 'pending' | 'blocked';

export type ProjectStatus = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export type ModuleId =
  // THINK
  | 'dashboard'
  | 'trends'
  | 'research'
  | 'ideas'
  // CREATE
  | 'story'
  | 'bible'
  | 'characters'
  | 'locations'
  | 'script'
  // PRODUCE
  | 'production'
  | 'scenes'
  | 'shots'
  | 'media'
  | 'voice'
  | 'audio'
  | 'captions'
  | 'video'
  | 'thumbnail'
  // GROW
  | 'seo'
  | 'repurpose'
  | 'publishing'
  | 'analytics'
  // SPECIAL OPERATIONAL MODES
  | 'story-mode'
  | 'film-mode';

export type NavCategory = 'THINK' | 'CREATE' | 'PRODUCE' | 'GROW';

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  group: NavCategory;
  description: string;
  badge?: string;
  status?: StageStatus;
  enabled: boolean;
}

export type StoryModeCategory = 'Cinematic' | 'Narrative' | 'Informational' | 'Genre' | 'Documentary';

export interface StoryModeConfig {
  id: string;
  name: string;
  category: StoryModeCategory;
  description: string;
  tone?: string;
  pacing: string;
  visualStyle?: string;
  cameraStyle?: string;
  voiceStyle?: string;
  musicStyle?: string;
  sceneDensity?: 'Sparse' | 'Moderate' | 'High' | 'Kinetic';
  targetTone: string;
  atmosphere: string;
  tags: string[];
}

export type StoryModeOption = StoryModeConfig;

export interface CharacterProfile {
  id: string;
  projectId?: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Narrator' | 'Mentor' | 'Observer';
  archetype: string;
  description?: string;
  personality?: string;
  appearance?: string;
  relationships?: string;
  backstory: string;
  voiceStyle: string;
  traits: string[];
  notes?: string;
}

export interface LocationProfile {
  id: string;
  projectId?: string;
  name: string;
  type?: string;
  environment: string;
  atmosphere: string;
  visualDescription?: string;
  visualSignatures: string[];
  scenesLinked: number;
  notes?: string;
}

export interface StoryBible {
  id?: string;
  projectId?: string;
  premise: string;
  synopsis?: string;
  worldLore: string;
  primaryConflict: string;
  coreTheme: string;
  genre?: string;
  tone?: string;
  timeline?: string;
  rulesOfWorld: string[];
  importantEvents?: string[];
  continuityNotes?: string;
}

export interface Story {
  id: string;
  projectId: string;
  title: string;
  premise: string;
  synopsis: string;
  genre: string;
  primaryMode: string;
  secondaryMode: string;
  storyBibleId?: string;
  status: 'Concept' | 'In Development' | 'Drafted' | 'Polished' | 'Approved';
  createdAt: string;
  updatedAt: string;
}

export interface ScriptScene {
  id: string;
  projectId?: string;
  scriptId?: string;
  sceneNumber: number;
  slugline: string; // e.g. INT. EVENT HORIZON OBSERVATORY - NIGHT
  timeOfDay: 'DAY' | 'NIGHT' | 'SPACE DAWN' | 'ECLIPSE' | 'DEEP VOID';
  title?: string;
  purpose?: string;
  narration?: string;
  voiceover?: string;
  spokenDialogue?: string;
  summary: string;
  dialogueCount: number;
  characters: string[];
  locations?: string[];
  duration?: string;
  durationSec?: number;
  status: 'Draft' | 'Approved' | 'In Production' | 'Rendered';
  content: string;
  actionDescription?: string;
  action?: string;
  cameraDirection?: string;
  shotType?: string;
  cameraMovement?: string;
  onScreenText?: string;
  bRollSuggestion?: string;
  lightingMood?: string;
  sfxMusic?: string;
  sfx?: string;
  transition?: string;
  sceneMode?: string;
  emotionalBeats?: string;
  notes?: string;
}

// ============================================================================
// IDEA GENERATOR & CONCEPT MATRIX TYPES
// ============================================================================

export type PlatformOption =
  | 'YouTube Long-form'
  | 'YouTube Shorts'
  | 'Instagram Reels'
  | 'Instagram Stories'
  | 'General Social Video'
  | 'Cinematic Web Stream'
  | 'IMAX Format';

export type ContentTypeOption =
  | 'Sci-Fi Short Film'
  | 'Deep Space Docu-series'
  | 'Interactive Video Essay'
  | 'Worldbuilding Audio Drama'
  | 'Cinematic Explainer'
  | 'Educational'
  | 'Entertainment'
  | 'News/Explainer'
  | 'Story'
  | 'Tutorial'
  | 'Review';

export type LanguageOption =
  | 'English'
  | 'English (Galactic Standard)'
  | 'Hindi'
  | 'Hinglish'
  | 'Spanish'
  | 'Japanese'
  | 'German'
  | 'French';

export type ToneOption =
  | 'Dramatic'
  | 'Mysterious'
  | 'Philosophical'
  | 'Energetic'
  | 'Professional'
  | 'Storytelling'
  | 'Scientific / Analytical'
  | 'Dark & Atmospheric'
  | 'Inspirational';

export type GoalOption =
  | 'High Views / Reach'
  | 'Viral Potential'
  | 'Education & Trust'
  | 'Cinematic Worldbuilding'
  | 'Brand Awareness'
  | 'Community Growth'
  | 'Authority Building';

export interface IdeaGenerationInputs {
  niche: string;
  topic: string;
  targetAudience: string;
  platform: PlatformOption | string;
  contentType: ContentTypeOption | string;
  language: LanguageOption | string;
  tone: ToneOption | string;
  videoDuration: string;
  goal: GoalOption | string;
  currentTrendContext?: string;
  competitorReference?: string;
  keywords?: string[];
  userNotes?: string;
  referenceContext?: string;
  count?: number;
  primaryMode?: string;
  secondaryModes?: string[];
}

export interface Idea {
  id: string;
  projectId?: string;
  title: string;
  hook: string;
  concept: string;
  coreConcept?: string;
  uniqueAngle?: string;
  angle?: string;
  targetAudience: string;
  contentType: string;
  recommendedPlatform: string;
  estimatedDuration: string;
  trendScore?: number;
  trendRelevance?: number;
  audienceInterestScore?: number;
  audienceInterest?: number;
  competitionScore?: number;
  competition?: number;
  opportunityScore?: number;
  whyThisIdea?: string;
  reason?: string;
  keywords: string[];
  hashtags: string[];
  thumbnailConcept?: string;
  cta?: string;
  status: 'draft' | 'saved' | 'scripted' | 'produced';
  primaryMode?: string;
  secondaryModes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IdeaAnalysis {
  ideaId: string;
  whyItWorks: string;
  targetViewer: string;
  targetAudienceAnalysis: string;
  strongestAngle: string;
  differentiation: string;
  potentialWeaknesses: string[];
  betterAngle: string;
  betterHook: string;
  recommendedDuration: string;
  recommendedPlatform: string;
  suggestedTitles: string[];
  thumbnailDirection: string;
  seoDirection: string;
  contentGapOpportunity?: string;
}

export interface IdeaVariation {
  angleType: 'Curiosity' | 'Problem/Solution' | 'Story' | 'Contrarian' | 'Educational';
  title: string;
  hook: string;
  concept: string;
  rationale: string;
}

// ============================================================================
// SCRIPT STUDIO & SCREENPLAY TYPES
// ============================================================================

export type AISectionAction =
  | 'rewrite'
  | 'shorten'
  | 'expand'
  | 'improve_hook'
  | 'conversational'
  | 'professional'
  | 'energetic'
  | 'simplify'
  | 'add_examples'
  | 'remove_repetition'
  | 'improve_flow'
  | 'alternative_angle';

export interface ScriptSection {
  id: string;
  name: string;
  content: string;
  narration?: string;
  targetDuration?: string;
  wordCount?: number;
  visualDescription?: string;
  directorNotes?: string;
  pacing?: string;
  order: number;
}

export interface ScriptVersion {
  versionNumber: number;
  timestamp: string;
  title: string;
  sections: ScriptSection[];
  scenes: ScriptScene[];
  summaryNote?: string;
}

export interface ScriptSettings {
  topic: string;
  ideaText?: string;
  audience: string;
  language: string;
  tone: string;
  duration: string;
  platform: string;
  narrationStyle: string;
  ctaStyle: string;
  referenceMaterial?: string;
  keyPoints?: string[];
  brandVoice?: string;
  primaryMode?: string;
  secondaryModes?: string[];
}

export interface Script {
  id: string;
  projectId: string;
  ideaId?: string;
  title: string;
  type: string;
  status: 'Draft' | 'Saved' | 'In Production' | 'Ready';
  settings: ScriptSettings;
  sections: ScriptSection[];
  scenes: ScriptScene[];
  versions: ScriptVersion[];
  currentVersionNumber: number;
  primaryMode?: string;
  secondaryModes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionShot {
  id: string;
  sceneId: string;
  shotNumber: string;
  shotType?: 'Extreme Wide' | 'Wide' | 'Medium' | 'Close-up' | 'Macro' | 'Establishing';
  description?: string;
  cameraMovement: 'Static Wide' | 'Orbiting Close-up' | 'Dolly Zoom' | 'Drone Flyover' | 'FPV Sensor Scan' | string;
  lens: string;
  lightingPrompt: string;
  visualPrompt?: string;
  videoPrompt?: string;
  voice?: string;
  music?: string;
  sfx?: string;
  captions?: string;
  timing?: string;
  duration?: string;
  status: 'Required' | 'Queued' | 'Processing' | 'Ready' | 'Failed';
  assetRef?: string;
}

export type AssetCategory = 
  | 'Images' 
  | 'Video' 
  | 'Audio' 
  | 'Voice' 
  | 'Music' 
  | 'SFX' 
  | 'Captions' 
  | 'Thumbnails'
  | 'Other';

export interface MediaAsset {
  id: string;
  projectId?: string;
  name: string;
  category: AssetCategory;
  format?: string;
  fileSize: string;
  duration?: string;
  resolution?: string;
  sceneRelation?: string;
  sceneId?: string;
  source?: 'Local Upload' | 'Procedural Synthesizer' | 'AI Generation Adapter' | 'External Ingest';
  status: 'Ready' | 'Processing' | 'Queued' | 'Draft';
  createdAt: string;
  previewUrl?: string;
  url?: string;
  metadata?: Record<string, string>;
}

export type JobType = 
  | 'ai-generation'
  | 'image-generation'
  | 'video-generation'
  | 'tts-voice'
  | 'audio-mix'
  | 'caption-sync'
  | 'video-assembly'
  | 'script-breakdown'
  | 'SCRIPT_ANALYSIS'
  | 'SHOT_BREAKDOWN';

export type JobStatus = 'Required' | 'Queued' | 'Processing' | 'Ready' | 'Completed' | 'Failed';

export interface ProductionJob {
  id: string;
  projectId: string;
  type: JobType;
  status: JobStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  hashtags: string[];
  category: string;
  targetAudience?: string;
  hookRetentionAngle?: string;
}

export interface AnalyticsData {
  estimatedViews: string;
  projectedRetention: string;
  hookDropoffRate: string;
  audienceEngagementScore: number;
  keywordSearchVolume: string;
  viralPotential: 'High' | 'Moderate' | 'Exceptional';
  telemetryNotes: string[];
}

export interface FilmModeSeriesPart {
  partNumber: number;
  title: string;
  synopsis: string;
  continuityNotes: string;
}

export interface FilmModeData {
  sourceTitle: string;
  sourceFormat: 'Movie' | 'Web Series' | 'Custom';
  sourceStatus: 'AWAITING_SOURCE' | 'INGESTED' | 'ANALYZED' | 'PRODUCING';
  tensionCurvePoints: number[];
  cadenceBpm: number;
  originalExplanationAngle: string;
  seriesParts: FilmModeSeriesPart[];
  authorizedTransformationNotice: string;
}

export interface RepurposeSegment {
  id: string;
  title: string;
  originalSceneRef: string;
  newHook: string;
  contextRewrite: string;
  targetDuration: string;
  aspectRatio: '9:16' | '1:1' | '16:9';
  status: 'Draft' | 'Polished' | 'Ready';
}

export interface RepurposeData {
  sourceScriptId?: string;
  segments: RepurposeSegment[];
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: string;
  timestamp: string;
  changeType: 'CREATE' | 'UPDATE' | 'SCENE_EDIT' | 'STORY_MODE_CHANGE' | 'BIBLE_UPDATE' | 'ASSET_LINK' | 'RESTORE';
  module: ModuleId;
  description: string;
  snapshotMetadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  codename: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  language: string;
  contentType: 'Sci-Fi Short Film' | 'Deep Space Docu-series' | 'Interactive Video Essay' | 'Worldbuilding Audio Drama' | 'Cinematic Explainer';
  storyMode: string;
  secondaryStoryMode: string;
  primaryMode: string; // compatibility alias for storyMode
  secondaryMode: string; // compatibility alias for secondaryStoryMode
  fusionScore: number;
  primaryLanguage: string; // compatibility alias for language
  targetPlatform: 'YouTube 4K' | 'Cinematic Web Stream' | 'IMAX Format' | 'Interactive Engine' | 'XR Headset';
  missionObjective: string;
  currentModule: ModuleId;
  systemState: 'ACTIVE MISSION' | 'CALIBRATING' | 'STANDBY' | 'FINAL RENDER';
  pipelineProgress: Record<PipelineStage, StageStatus>;
  metadata: Record<string, any>;
  bible: StoryBible;
  characters: CharacterProfile[];
  locations: LocationProfile[];
  stories: Story[];
  scenes: ScriptScene[];
  shots: ProductionShot[];
  assets: MediaAsset[];
  jobs: ProductionJob[];
  ideas?: Idea[];
  scripts?: Script[];
  seo: SEOData;
  analytics: AnalyticsData;
  filmMode: FilmModeData;
  repurpose: RepurposeData;
  versionHistory: ProjectVersion[];
}

export type AutosaveStatus = 'SAVED' | 'SAVING' | 'UNSAVED' | 'ERROR';

export interface StorageProvider {
  create<T>(collection: string, id: string, data: T): Promise<T>;
  read<T>(collection: string, id: string): Promise<T | null>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;
  delete(collection: string, id: string): Promise<boolean>;
  list<T>(collection: string): Promise<T[]>;
  clear(collection: string): Promise<void>;
}

export type AIProviderStatus = 'READY' | 'STANDBY' | 'NOT_CONFIGURED' | 'DISCONNECTED' | 'ERROR';

export interface AIModel {
  id: string;
  name: string;
  contextWindow: number;
  description: string;
  recommendedFor: ('story' | 'script' | 'research' | 'ideas' | 'seo' | 'production')[];
}

export interface AIProviderConfig {
  id: string;
  name: string;
  endpointType: 'Local Engine' | 'Edge Gateway' | 'Orbital Cluster' | 'Third-Party Adapter';
  status: AIProviderStatus;
  latencyMs: number;
  contextLimit: string;
  quantization?: string;
  models: AIModel[];
  description: string;
  isLocalOnly: boolean;
}

export interface AIRequest {
  taskId: string;
  taskType: 'Research' | 'Idea' | 'Story' | 'Script' | 'Scene' | 'Shot' | 'SEO' | 'Repurpose' | 'Analysis';
  prompt: string;
  systemPrompt?: string;
  context?: Record<string, any>;
  modelId?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  taskId: string;
  content: string;
  modelId: string;
  providerId: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  timestamp: string;
  error?: string;
}

export interface AITask {
  id: string;
  type: 'Research' | 'Idea' | 'Story' | 'Script' | 'Scene' | 'Shot' | 'SEO' | 'Repurpose' | 'Analysis';
  projectId: string;
  context: Record<string, any>;
  input: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  providerId: string;
  modelId: string;
  output?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  getConfig(): AIProviderConfig;
  execute(request: AIRequest): Promise<AIResponse>;
  checkHealth(): Promise<AIProviderStatus>;
}

export interface AppSettings {
  theme: ThemeMode;
  accent: AccentColor;
  performance: PerformanceLevel;
  soundEnabled: boolean;
  storageMode: 'local-first' | 'memory-only';
  autosaveEnabled: boolean;
  autosaveDebounceMs: number;
  defaultAIProviderId: string;
  defaultAIModelId: string;
  preferLocalAI: boolean;
  language: string;
}

export interface TelemetryData {
  coreFrequency: string;
  gravityWarp: string;
  darkMatterDensity: string;
  bufferOccupancy: number;
  systemHealth: number;
  activeNodes: number;
  localAIStatus: 'READY' | 'PROCESSING' | 'STANDBY';
  aiCoreStatus: 'READY' | 'PROCESSING' | 'OFFLINE';
}

export interface CommandAction {
  id: string;
  title: string;
  subtitle: string;
  targetModule: ModuleId;
  icon: string;
}
