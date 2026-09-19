/**
 * DARK MATTER OS - Omni-Channel Repurposing Engine
 * Migrated and hardened from MINT-MIND
 */

export type HookAngleType = 'curiosity' | 'contrarian' | 'mistake' | 'blueprint' | 'urgency';

export interface RepurposedHook {
  id: string;
  type: HookAngleType;
  label: string;
  headline: string;
  openingLine: string;
  onScreenText: string;
  retentionMultiplier: string;
}

export interface PatternInterrupt {
  timestampSec: number;
  type: 'zoom_punch' | 'sound_hit' | 'text_pop' | 'broll_flash' | 'sfx_whoosh' | 'camera_angle_flip';
  label: string;
  direction: string;
}

export interface VerticalShortScript {
  id: string;
  title: string;
  targetDurationSec: number;
  hook: RepurposedHook;
  beats: Array<{
    secondRange: string;
    phase: 'Hook' | 'Setup' | 'Tension Spike' | 'Resolution' | 'Call to Action';
    voiceover: string;
    visualDirection: string;
    onScreenGraphic: string;
    patternInterrupt?: PatternInterrupt;
  }>;
}

export function generateHookVariations(topic: string): RepurposedHook[] {
  const cleanTopic = topic || 'Black Hole Event Horizons';

  return [
    {
      id: 'hook-curiosity',
      type: 'curiosity',
      label: 'Curiosity Loop',
      headline: 'The Secret Nobody Talks About',
      openingLine: `Almost nobody realizes what actually happens when you cross into ${cleanTopic}...`,
      onScreenText: 'WHAT ACTUALLY HAPPENS?',
      retentionMultiplier: '1.45x Avg Retention',
    },
    {
      id: 'hook-contrarian',
      type: 'contrarian',
      label: 'Contrarian Stance',
      headline: 'Everything You Were Taught Is Wrong',
      openingLine: `Stop assuming ${cleanTopic} is just dead space. In reality, it is screaming in mathematical prime numbers.`,
      onScreenText: 'STOP BELIEVING THE LIE',
      retentionMultiplier: '1.62x Viral Velocity',
    },
    {
      id: 'hook-mistake',
      type: 'mistake',
      label: 'Fatal Mistake',
      headline: 'The Critical Error',
      openingLine: `The biggest mistake people make about ${cleanTopic} is thinking time still moves forward.`,
      onScreenText: 'DO NOT MAKE THIS MISTAKE',
      retentionMultiplier: '1.38x Click Engagement',
    },
    {
      id: 'hook-blueprint',
      type: 'blueprint',
      label: 'Step-By-Step Blueprint',
      headline: 'The 3-Second Breakdown',
      openingLine: `Here is the exact mathematical sequence that proves ${cleanTopic} was transmitting a message.`,
      onScreenText: 'THE 3-STEP PROOF',
      retentionMultiplier: '1.51x Completion Rate',
    },
    {
      id: 'hook-urgency',
      type: 'urgency',
      label: 'Urgent Paradigm Shift',
      headline: 'This Changes Everything',
      openingLine: `If you study astrophysics, you need to understand this anomaly before the next preprint drops.`,
      onScreenText: 'WATCH BEFORE REMOVED',
      retentionMultiplier: '1.74x Share Rate',
    },
  ];
}

export function generateVerticalShort(
  topic: string,
  selectedHook?: RepurposedHook
): VerticalShortScript {
  const hook = selectedHook || generateHookVariations(topic)[0];

  return {
    id: 'short-' + Date.now(),
    title: `Vertical Short // ${topic}`,
    targetDurationSec: 50,
    hook,
    beats: [
      {
        secondRange: '0:00 - 0:03',
        phase: 'Hook',
        voiceover: hook.openingLine,
        visualDirection: 'Extreme snap-zoom into high contrast holographic visualization with lens flare.',
        onScreenGraphic: hook.onScreenText,
        patternInterrupt: {
          timestampSec: 1.5,
          type: 'zoom_punch',
          label: 'Snap Punch-In (1.2x)',
          direction: 'Fast 1.2x punch zoom on the word "nobody"',
        },
      },
      {
        secondRange: '0:03 - 0:15',
        phase: 'Setup',
        voiceover: `In 1964, astronomers detected an anomalous radio wave from Cygnus X-1. But everyone ignored the 1420 MHz resonance band.`,
        visualDirection: 'Archival terminal log scrolling with glowing cyan frequency telemetry lines.',
        onScreenGraphic: '1420 MHz RESONANCE DETECTED',
        patternInterrupt: {
          timestampSec: 7.0,
          type: 'text_pop',
          label: 'Kinetic Neon Pop',
          direction: 'Yellow callout box pops over frequency telemetry',
        },
      },
      {
        secondRange: '0:15 - 0:35',
        phase: 'Tension Spike',
        voiceover: `When we reconstructed the wave equation, it wasn't random thermal noise. It was a closed timelike curve repeating in primes: 2, 3, 5, 7, 11.`,
        visualDirection: 'Fast kinetic b-roll cuts of mathematician staring in shock at oscillating waveform oscilloscope.',
        onScreenGraphic: '2, 3, 5, 7, 11 // PRIMES',
        patternInterrupt: {
          timestampSec: 22.0,
          type: 'sound_hit',
          label: 'Sub-Bass Drop & Color Glitch',
          direction: 'Heavy 808 sub-boom impact + split-second RGB chromatic aberration',
        },
      },
      {
        secondRange: '0:35 - 0:50',
        phase: 'Call to Action',
        voiceover: `The full 4K research breakdown is now live on the Dark Matter console. Tap the link in bio to inspect the raw waveform.`,
        visualDirection: 'Final cinematic hero frame of the event horizon with pulsing Dark Matter logo badge.',
        onScreenGraphic: 'FULL 4K DEEP-DIVE IN BIO',
        patternInterrupt: {
          timestampSec: 42.0,
          type: 'sfx_whoosh',
          label: 'Transition Whoosh',
          direction: 'Whip-pan into high-contrast CTA interface banner',
        },
      },
    ],
  };
}
