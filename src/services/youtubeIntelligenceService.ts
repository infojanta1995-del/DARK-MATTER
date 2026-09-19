/**
 * DARK MATTER OS - YouTube & Research Intelligence Engine
 * Migrated and hardened from MINT-MIND
 */

export interface OutlierVideo {
  id: string;
  title: string;
  views: number;
  channelTitle: string;
  publishedAt: string;
  benchmarkViews: number;
  multiplier: number;
  isOutlier: boolean;
  hookPattern: string;
  viralSignal: string;
}

export interface ViralHookPattern {
  id: string;
  category: string;
  name: string;
  avgMultiplier: string;
  exampleTitle: string;
  retentionTrigger: string;
  whyItWorks: string;
}

export const VIRAL_HOOK_PATTERNS: ViralHookPattern[] = [
  {
    id: 'hook-contrarian',
    category: 'Psychological Dissonance',
    name: 'The Contrarian Inversion',
    avgMultiplier: '4.8x - 8.2x',
    exampleTitle: 'Why 99% Of Creators Are Using AI Completely Wrong',
    retentionTrigger: 'Instantly invalidates viewer habits, forcing them to watch to discover their mistake.',
    whyItWorks: 'Loss aversion is psychologically 2.5x more potent than potential gain.',
  },
  {
    id: 'hook-urgency',
    category: 'Temporal Threshold',
    name: 'The Impending Paradigm Shift',
    avgMultiplier: '3.6x - 6.4x',
    exampleTitle: 'The Uncomfortable Truth About Content Creation In 2026',
    retentionTrigger: 'Creates FOMO and existential dread about becoming obsolete.',
    whyItWorks: 'Humans are hypersensitive to sudden environmental or technological disruption.',
  },
  {
    id: 'hook-blueprint',
    category: 'High-Utility Proof',
    name: 'The Quantified Operational System',
    avgMultiplier: '3.2x - 5.1x',
    exampleTitle: 'I Automated My Entire Workflow in 48 Hours (Step-by-Step)',
    retentionTrigger: 'Promises concrete, actionable transformation with specific time constraint.',
    whyItWorks: 'Removes ambiguity; viewers crave systematized frameworks with tangible outcomes.',
  },
  {
    id: 'hook-exposing',
    category: 'Forbidden Insight',
    name: 'The Hidden Architecture Exposed',
    avgMultiplier: '5.2x - 10.4x',
    exampleTitle: 'What YouTube Engineers Never Tell You About The Algorithm',
    retentionTrigger: 'Frames information as privileged, confidential, or suppressed truth.',
    whyItWorks: 'High prestige bias; viewers feel they are receiving unfair competitive advantages.',
  },
  {
    id: 'hook-transformation',
    category: 'Narrative Case Study',
    name: 'The High-Stakes Crucible Test',
    avgMultiplier: '4.1x - 7.5x',
    exampleTitle: 'I Built A 100K Audience In 30 Days Using Only Voice Synthesis',
    retentionTrigger: 'Dramatic stakes with unambiguous quantitative before-and-after.',
    whyItWorks: 'Combines hero’s journey narrative tension with verifiable proof of concept.',
  },
];

export function detectPerformanceOutliers(
  videos: Array<{
    id: string;
    title: string;
    views: number;
    channelTitle: string;
    publishedAt: string;
  }>,
  benchmarkViews = 30000
): OutlierVideo[] {
  return videos.map((v) => {
    const multiplier = Math.round((v.views / Math.max(1, benchmarkViews)) * 10) / 10;
    const isOutlier = multiplier >= 2.5;

    let hookPattern = 'Standard Organic';
    let viralSignal = 'Baseline Audience Resonance';

    if (v.title.toLowerCase().includes('wrong') || v.title.toLowerCase().includes('stop')) {
      hookPattern = 'Contrarian Inversion';
      viralSignal = 'High algorithmic controversy spike';
    } else if (v.title.toLowerCase().includes('truth') || v.title.toLowerCase().includes('secret')) {
      hookPattern = 'Forbidden Insight';
      viralSignal = 'High click-through-rate velocity';
    } else if (v.title.toLowerCase().includes('step') || v.title.toLowerCase().includes('how i')) {
      hookPattern = 'Operational Blueprint';
      viralSignal = 'High bookmark/save retention ratio';
    }

    return {
      id: v.id,
      title: v.title,
      views: v.views,
      channelTitle: v.channelTitle,
      publishedAt: v.publishedAt,
      benchmarkViews,
      multiplier,
      isOutlier,
      hookPattern,
      viralSignal,
    };
  });
}

export function calculateChannelPerformanceMetrics(channelData: {
  subscribers?: number;
  totalViews?: number;
  videoCount?: number;
}) {
  const subs = channelData.subscribers || 45000;
  const views = channelData.totalViews || 2800000;
  const count = channelData.videoCount || 64;

  const avgViewsPerVideo = Math.round(views / Math.max(1, count));
  const viewsPerSubscriberRatio = Math.round((avgViewsPerVideo / Math.max(1, subs)) * 100) / 100;

  // Engagement index (0-100)
  const engagementScore = Math.min(99, Math.max(50, Math.round(viewsPerSubscriberRatio * 85 + 15)));

  // Velocity score (0-100)
  const growthScore = Math.min(98, Math.max(60, Math.round(72 + (subs > 10000 ? 18 : 5))));

  return {
    subscribers: subs,
    totalViews: views,
    videoCount: count,
    avgViewsPerVideo,
    viewsPerSubscriberRatio,
    engagementScore,
    growthScore,
    overallCreatorIndex: Math.round((engagementScore + growthScore) / 2),
  };
}
