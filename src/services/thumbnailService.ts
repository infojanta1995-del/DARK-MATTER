/**
 * DARK MATTER OS - Thumbnail Visual Packaging & CTR Engine
 * Migrated and hardened from MINT-MIND
 */

export interface StoryModeThumbnailProfile {
  lighting: string;
  colorTheory: string;
  composition: string;
  recommendedFont: string;
  palette: string[];
  contrastKeywords: string[];
}

export const STORY_MODE_THUMBNAIL_STYLES: Record<string, StoryModeThumbnailProfile> = {
  Documentary: {
    lighting: 'Natural cinematic golden hour with deep shadow falloff, 35mm film grain, Hasselblad aesthetic',
    colorTheory: 'Muted earth tones with punchy warm amber focal contrast',
    composition: 'Rule of thirds, intense subject eye contact, authentic human grit and historical resonance',
    recommendedFont: 'Montserrat Black',
    palette: ['#0f172a', '#f59e0b', '#78350f', '#f8fafc'],
    contrastKeywords: ['EXPOSED', 'THE UNTOLD STORY', 'WHAT HAPPENED?'],
  },
  'Tech Explainer': {
    lighting: 'Crisp studio key light with sharp 5600K rim light, subtle blue ambient bounce, ultra-clean reflections',
    colorTheory: 'Futuristic Electric Cyan (#00f0ff) contrasting against deep Obsidian Charcoal (#090d16)',
    composition: 'Subject presenting a floating holographic or glowing 3D diagram, center weighted with diagonal energy',
    recommendedFont: 'Impact Bold',
    palette: ['#090d16', '#06b6d4', '#3b82f6', '#ffffff'],
    contrastKeywords: ['10X FASTER', 'IT FINALLY HAPPENED', 'DO THIS INSTEAD'],
  },
  'Cyberpunk Neon': {
    lighting: 'Volumetric wet-street neon reflections, split teal and magenta rim lighting, anamorphic lens flares',
    colorTheory: 'Hyper-saturated Neon Pink and Electric Cyan over dystopian dark tones',
    composition: 'Low-angle wide shot, glowing interface reflections on subject sunglasses or eyes',
    recommendedFont: 'Bebas Neue',
    palette: ['#050510', '#ec4899', '#06b6d4', '#facc15'],
    contrastKeywords: ['THE FUTURE IS HERE', 'GLITCH DETECTED', 'DO NOT TOUCH'],
  },
  'Action Thriller': {
    lighting: 'Extreme contrast chiaroscuro, explosive amber backfire, dynamic motion blur on edges',
    colorTheory: 'Teal and Orange Hollywood blockbuster color grade',
    composition: 'Dynamic tilted Dutch angle, high-speed foreground debris, extreme subject tension',
    recommendedFont: 'Impact Bold',
    palette: ['#0b0f19', '#ea580c', '#38bdf8', '#ffffff'],
    contrastKeywords: ['RUN NOW', 'CRITICAL ERROR', 'WARNING'],
  },
  'Noir Mystery': {
    lighting: 'Venetian blind window cast shadows, intense single-source spotlight, smoke atmosphere',
    colorTheory: 'Desaturated monochrome with a single vivid crimson accent element',
    composition: 'Subject half in deep shadow, magnifying glass or spotlight revealing a shocking piece of evidence',
    recommendedFont: 'Oswald Bold',
    palette: ['#030712', '#dc2626', '#9ca3af', '#ffffff'],
    contrastKeywords: ['WHO DID THIS?', 'FOUND EVIDENCE', 'SECRET REVEALED'],
  },
  'Luxury Showcase': {
    lighting: 'Soft diffused high-end studio illumination, specular highlights on polished titanium and crystal',
    colorTheory: 'Champagne Gold and Deep Onyx Black with ultra-clean white typography',
    composition: 'Minimalist symmetrical hero framing, extreme macro texture detail, museum-grade elegance',
    recommendedFont: 'Cinzel Decorative',
    palette: ['#0a0a0a', '#fbbf24', '#71717a', '#ffffff'],
    contrastKeywords: ['WORTH $10M?', 'THE ELITE SECRET', 'PURE LUXURY'],
  },
  'Educational Academy': {
    lighting: 'Bright, welcoming key lighting, soft background gradient, crystal-clear whiteboard or tablet clarity',
    colorTheory: 'Emerald Green (#10b981) and Slate Navy with clean yellow callout badges',
    composition: 'Instructor pointing with high clarity towards simplified 3-step visual or diagram with big red arrow',
    recommendedFont: 'Montserrat Black',
    palette: ['#0f172a', '#10b981', '#facc15', '#ffffff'],
    contrastKeywords: ['LEARN THIS IN 5 MIN', 'STEP-BY-STEP', 'STOP STUDYING WRONG'],
  },
  'Cinematic Drama': {
    lighting: 'Soft directional moonlight meeting warm tungsten fill, cinematic 2.39:1 anamorphic crop feel',
    colorTheory: 'Rich cinematic film emulation, Kodachrome warm skin tones with deep velvet blacks',
    composition: 'Emotional portrait with intense storytelling eyes looking just off-camera at a dramatic light source',
    recommendedFont: 'Playfair Display Bold',
    palette: ['#080c14', '#e11d48', '#38bdf8', '#f8fafc'],
    contrastKeywords: ['THE END OF EVERYTHING', 'NEVER FORGET', 'FINAL CHOICE'],
  },
};

export interface ThumbnailConceptCard {
  id: string;
  title: string;
  hookText: string;
  visualDescription: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  dallePrompt: string;
  colorPalette: string[];
  contrastRatio: string;
  estimatedCTR: string;
  storyMode: string;
  lightingSpec: string;
  recommendedFont: string;
}

export function generateThumbnailConcepts(
  topic: string,
  storyMode = 'Tech Explainer'
): ThumbnailConceptCard[] {
  const profile = STORY_MODE_THUMBNAIL_STYLES[storyMode] || STORY_MODE_THUMBNAIL_STYLES['Tech Explainer'];
  const cleanTopic = topic || 'The Quantum Singularity Anomaly';

  return [
    {
      id: 'thumb-1',
      title: 'The Gravitational Focal Shock',
      hookText: profile.contrastKeywords[0] || 'IT HAPPENED',
      visualDescription: `Extreme close-up macro of an astronaut helmet visor reflecting a swirling gravitational event horizon of ${cleanTopic}. Dual rim lighting in cyan and amber.`,
      midjourneyPrompt: `extreme close up macro shot of astronaut visor reflecting ${cleanTopic} singularity, hyper-detailed, Hasselblad 100mm f/2.8, volumetric neon rim lighting, 8k resolution, cinematic color grading --ar 16:9 --style raw --v 6.0`,
      fluxPrompt: `Cinematic movie still: high contrast close-up portrait with glowing holographic display showing ${cleanTopic}, deep rich shadows, anamorphic lens flare, photorealistic 35mm.`,
      dallePrompt: `A dramatic 4K YouTube thumbnail visual featuring a high-tech control room with an engineer staring in disbelief at a glowing ${cleanTopic} anomaly on a holographic monitor.`,
      colorPalette: profile.palette,
      contrastRatio: '14.2:1 (Extreme Luminance Separation)',
      estimatedCTR: '13.8%',
      storyMode,
      lightingSpec: profile.lighting,
      recommendedFont: profile.recommendedFont,
    },
    {
      id: 'thumb-2',
      title: 'The Impossible Diagram',
      hookText: profile.contrastKeywords[1] || 'DO NOT TOUCH',
      visualDescription: `Split composition: left side shows conventional model failing, right side displays glowing ${cleanTopic} equation with bold red arrow pointing to the singularity point.`,
      midjourneyPrompt: `split view cinematic comparison of standard physics vs ${cleanTopic}, floating 3D neon equations, clean studio lighting, high key separation, editorial photography --ar 16:9 --v 6.0`,
      fluxPrompt: `Photorealistic YouTube thumbnail: expert standing in front of a giant transparent glass whiteboard filled with glowing cyan mathematical formulas about ${cleanTopic}.`,
      dallePrompt: `A vibrant high-CTR educational thumbnail showing a side-by-side comparison diagram of ${cleanTopic} with high contrast labels and an astonished scientist.`,
      colorPalette: [profile.palette[0], '#ef4444', profile.palette[1], '#ffffff'],
      contrastRatio: '16.5:1 (Maximum Color Delta)',
      estimatedCTR: '12.4%',
      storyMode,
      lightingSpec: profile.lighting,
      recommendedFont: profile.recommendedFont,
    },
  ];
}
