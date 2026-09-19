/**
 * DARK MATTER OS - Voice & Audio Pipeline Engine
 * Migrated and hardened from MINT-MIND
 */

export interface VoiceModelProfile {
  id: string;
  name: string;
  archetype: string;
  gender: 'Male' | 'Female' | 'Neutral';
  timbre: string;
  paceWPM: number;
  recommendedGenres: string[];
  description: string;
  sampleText: string;
}

export const VOICE_MODELS_CATALOG: VoiceModelProfile[] = [
  {
    id: 'voice-adam',
    name: 'Adam (Deep Baritone)',
    archetype: 'Investigative Documentary Narrator',
    gender: 'Male',
    timbre: 'Deep, resonant, authoritative, cinematic low-end',
    paceWPM: 135,
    recommendedGenres: ['Documentary', 'Cosmic Mystery', 'True Crime', 'Sci-Fi Lore'],
    description: 'Commanding baritone with gravitas and measured cadence, built for high-stakes expository narratives.',
    sampleText: 'In the deep quiet beyond the Kuiper belt, every signal is an invitation or an omen.',
  },
  {
    id: 'voice-rachel',
    name: 'Rachel (Warm Narrative)',
    archetype: 'Intellectual Explainer & Mentor',
    gender: 'Female',
    timbre: 'Crisp, empathetic, articulate, warm mid-range',
    paceWPM: 150,
    recommendedGenres: ['Science Explainer', 'Philosophy', 'Tech Analysis', 'Audiobook'],
    description: 'Crystal-clear articulation that retains audience trust through complex multi-stage concepts.',
    sampleText: 'Before we can understand the singularity, we have to unlearn how we perceive time.',
  },
  {
    id: 'voice-antoni',
    name: 'Antoni (Modern Kinetic)',
    archetype: 'Dynamic Fast-Paced Creator',
    gender: 'Male',
    timbre: 'Energetic, punchy, forward-projecting, bright',
    paceWPM: 165,
    recommendedGenres: ['Viral Short', 'Tech Promo', 'High-Octane Action', 'Product Launch'],
    description: 'High kinetic velocity designed to maintain thumb-stopping retention on short-form platforms.',
    sampleText: 'Stop scrolling. What they just discovered in deep space breaks the laws of thermodynamics.',
  },
  {
    id: 'voice-bella',
    name: 'Bella (Intimate Chiaroscuro)',
    archetype: 'Psychological Tension & Mystery',
    gender: 'Female',
    timbre: 'Breathy, close-mic, intense, psychological depth',
    paceWPM: 128,
    recommendedGenres: ['Psychological Thriller', 'Cosmic Horror', 'Noir', 'Drama'],
    description: 'Creates claustrophobic proximity and emotional vulnerability in personal reflections.',
    sampleText: 'Commander Vance knew the transmission was impossible. But she answered anyway.',
  },
  {
    id: 'voice-marcus',
    name: 'Marcus (Theatrical Commander)',
    archetype: 'Epic Space Opera Commander',
    gender: 'Male',
    timbre: 'Stentorian, metallic edge, heroic projection',
    paceWPM: 142,
    recommendedGenres: ['Space Opera', 'Military Sci-Fi', 'Blockbuster Trailer', 'History'],
    description: 'Heroic vocal weight capable of cutting through heavy orchestral and sound design layers.',
    sampleText: 'All stations, brace for tidal shear. We are diving into the ergosphere on manual thrust.',
  },
];

/**
 * Calculates estimated speech duration in seconds given text and target words-per-minute
 */
export function calculateSpeechDuration(text: string, wpm = 145): number {
  if (!text || text.trim() === '') return 0;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = wordCount / Math.max(60, wpm);
  return Math.round(minutes * 60 * 10) / 10;
}
