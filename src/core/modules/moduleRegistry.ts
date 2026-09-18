import { ModuleConfig, ModuleId, NavCategory } from '../../types';

export const MODULE_REGISTRY: Record<ModuleId, ModuleConfig> = {
  // THINK
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    group: 'THINK',
    description: 'Central spacecraft command bridge, telemetry visualizer, and project overview.',
    enabled: true,
  },
  trends: {
    id: 'trends',
    name: 'Trends Radar',
    group: 'THINK',
    description: 'Autonomous trend frequency scanner for cosmic, tech, and cultural hooks.',
    badge: 'RADAR',
    enabled: true,
  },
  research: {
    id: 'research',
    name: 'Deep Research',
    group: 'THINK',
    description: '7-step intelligence ladder synthesizing audience psychographics and content gaps.',
    enabled: true,
  },
  ideas: {
    id: 'ideas',
    name: 'Idea Generator',
    group: 'THINK',
    description: 'High-gravity concept engine with premise, viral velocity, and retention vectors.',
    enabled: true,
  },

  // CREATE
  story: {
    id: 'story',
    name: 'Story Engine',
    group: 'CREATE',
    description: 'Macro story architecture, three-act plot progression, and narrative pacing.',
    enabled: true,
  },
  bible: {
    id: 'bible',
    name: 'Story Bible',
    group: 'CREATE',
    description: 'Canonical lore vault, world physics, thematic pillars, and immutable rules.',
    enabled: true,
  },
  characters: {
    id: 'characters',
    name: 'Character Memory',
    group: 'CREATE',
    description: 'Deep psychological profiles, vocal cadence signatures, and relationship webs.',
    enabled: true,
  },
  locations: {
    id: 'locations',
    name: 'Location Memory',
    group: 'CREATE',
    description: 'Atmospheric environments, volumetric signatures, and sensory anchors.',
    enabled: true,
  },
  script: {
    id: 'script',
    name: 'Script Studio',
    group: 'CREATE',
    description: 'Professional screenplay and narration studio with integrated character prompt memory.',
    enabled: true,
  },

  // PRODUCE
  production: {
    id: 'production',
    name: 'Production Control',
    group: 'PRODUCE',
    description: 'Multi-stage production hub directing scenes, cinematic shots, and assets.',
    enabled: true,
  },
  scenes: {
    id: 'scenes',
    name: 'Scene Matrix',
    group: 'PRODUCE',
    description: 'Sequential scene sequencer with emotional intensity curves and pacing notes.',
    enabled: true,
  },
  shots: {
    id: 'shots',
    name: 'Shot Breakdown',
    group: 'PRODUCE',
    description: 'Granular optical shot designer with lens specifications and camera vectors.',
    enabled: true,
  },
  media: {
    id: 'media',
    name: 'Media Vault',
    group: 'PRODUCE',
    description: 'Central asset repository with waveform preview, resolution tags, and scene mapping.',
    enabled: true,
  },
  voice: {
    id: 'voice',
    name: 'Voice Synthesizer',
    group: 'PRODUCE',
    description: 'Acoustic voiceprint generator with pitch, cadence, and spatial reverb controls.',
    enabled: true,
  },
  audio: {
    id: 'audio',
    name: 'Audio Studio',
    group: 'PRODUCE',
    description: 'Atmospheric space soundscape and score orchestrator with frequency mixing.',
    enabled: true,
  },
  captions: {
    id: 'captions',
    name: 'Captions & Telemetry',
    group: 'PRODUCE',
    description: 'Kinetic subtitle timing, sci-fi HUD telemetry styling, and typography.',
    enabled: true,
  },
  video: {
    id: 'video',
    name: 'Video Pipeline',
    group: 'PRODUCE',
    description: 'Automated timeline sequence assembler and video render dispatcher.',
    enabled: true,
  },
  thumbnail: {
    id: 'thumbnail',
    name: 'Thumbnail Lab',
    group: 'PRODUCE',
    description: 'High-CTR visual hook compositor with contrast analysis and focal tests.',
    enabled: true,
  },

  // GROW
  seo: {
    id: 'seo',
    name: 'SEO & Metadata',
    group: 'GROW',
    description: 'Algorithmic discoverability engine with high-intent keywords and viral tags.',
    enabled: true,
  },
  repurpose: {
    id: 'repurpose',
    name: 'Repurpose Engine',
    group: 'GROW',
    description: '9:16 vertical short-form deconstructor extracting micro-narratives.',
    enabled: true,
  },
  publishing: {
    id: 'publishing',
    name: 'Distribution Hub',
    group: 'GROW',
    description: 'Multi-platform mission launchpad with automated scheduling and payload verification.',
    enabled: true,
  },
  analytics: {
    id: 'analytics',
    name: 'Telemetry Analytics',
    group: 'GROW',
    description: 'Audience retention telemetry, hook drop-off analysis, and performance metrics.',
    enabled: true,
  },

  // SPECIAL MODES
  'story-mode': {
    id: 'story-mode',
    name: 'Story Mode Fusion',
    group: 'CREATE',
    description: '28+ cinematic story mode matrices with dual primary/secondary harmonic fusion.',
    badge: 'MATRIX',
    enabled: true,
  },
  'film-mode': {
    id: 'film-mode',
    name: 'Film Mode Console',
    group: 'CREATE',
    description: 'Widescreen cinematic narrative deconstruction and authorized adaptation workstation.',
    badge: 'CINEMA',
    enabled: true,
  },
};

export const MODULE_LIST: ModuleConfig[] = Object.values(MODULE_REGISTRY);

export const MODULE_GROUPS: { key: NavCategory; label: string; modules: ModuleConfig[] }[] = [
  {
    key: 'THINK',
    label: 'THINK // DISCOVERY',
    modules: MODULE_LIST.filter((m) => m.group === 'THINK'),
  },
  {
    key: 'CREATE',
    label: 'CREATE // NARRATIVE',
    modules: MODULE_LIST.filter((m) => m.group === 'CREATE'),
  },
  {
    key: 'PRODUCE',
    label: 'PRODUCE // EXECUTION',
    modules: MODULE_LIST.filter((m) => m.group === 'PRODUCE'),
  },
  {
    key: 'GROW',
    label: 'GROW // IMPACT',
    modules: MODULE_LIST.filter((m) => m.group === 'GROW'),
  },
];

export function getModuleConfig(id: ModuleId): ModuleConfig {
  return MODULE_REGISTRY[id] || MODULE_REGISTRY['dashboard'];
}
