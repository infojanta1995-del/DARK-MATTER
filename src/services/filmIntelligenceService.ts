/**
 * DARK MATTER OS - Film Intelligence & Narrative Bible Engine
 * Migrated and hardened from MINT-MIND
 */

import { Script, CharacterProfile, Scene } from '../types';

export interface StoryBeat {
  id: string;
  act: 'Act I' | 'Act II-A' | 'Act II-B' | 'Act III';
  beatName: string;
  targetPercent: number; // 0-100% of narrative timeline
  tensionScore: number; // 1-10 scale
  description: string;
  turningPoint: boolean;
  status: 'planned' | 'drafted' | 'approved';
}

export interface ContinuityItem {
  id: string;
  category: 'Wardrobe' | 'Props' | 'Lighting' | 'Timeline' | 'Atmosphere';
  sceneSequence: number;
  item: string;
  note: string;
  verified: boolean;
}

export interface CharacterTensionNode {
  characterA: string;
  characterB: string;
  dynamic: string;
  conflictIntensity: number; // 1-10
  unresolvedStakes: string;
}

export interface CopyrightRiskAudit {
  overallRisk: 'Low Risk / Safe' | 'Moderate / Review Suggested' | 'High Risk / Action Needed';
  fairUseScore: number; // 0-100
  transformativeIndex: number; // 0-100
  flags: Array<{
    item: string;
    riskCategory: 'Likeness / Persona' | 'Audio / Music Sampling' | 'Trademark / Brand' | 'Direct Lore Copyright';
    severity: 'Low' | 'Medium' | 'High';
    recommendation: string;
  }>;
}

export interface FilmStoryBible {
  format: string;
  logline: string;
  thematicCore: string;
  beats: StoryBeat[];
  continuityChecklist: ContinuityItem[];
  characterDynamics: CharacterTensionNode[];
  copyrightAudit: CopyrightRiskAudit;
}

export function buildFilmStoryBible(script: Script, characters: CharacterProfile[] = []): FilmStoryBible {
  const defaultLogline =
    script.logline ||
    'When a deep-space research vessel intercepts an acoustic transmission inside the ergosphere of Cygnus X-1, the crew must choose between self-preservation and decoding a message written in prime numbers.';

  const beats: StoryBeat[] = [
    {
      id: 'beat-1',
      act: 'Act I',
      beatName: 'Opening Image & Status Quo',
      targetPercent: 5,
      tensionScore: 3,
      description: 'The vast quiet of the deep void. Daily telemetry logs aboard the Aethelgard. Routine scientific protocol.',
      turningPoint: false,
      status: 'approved',
    },
    {
      id: 'beat-2',
      act: 'Act I',
      beatName: 'Inciting Incident (The Signal)',
      targetPercent: 12,
      tensionScore: 6,
      description: 'The 1420 MHz receiver registers an acoustic harmonic anomaly repeating prime pulses from inside the event horizon.',
      turningPoint: true,
      status: 'approved',
    },
    {
      id: 'beat-3',
      act: 'Act I',
      beatName: 'Debate & Hesitation',
      targetPercent: 20,
      tensionScore: 5,
      description: 'Commander Vance insists on maintaining perimeter safety, while Dr. Thorne argues the signal could be artificial.',
      turningPoint: false,
      status: 'approved',
    },
    {
      id: 'beat-4',
      act: 'Act II-A',
      beatName: 'Break into Act II (The Dive)',
      targetPercent: 25,
      tensionScore: 7,
      description: 'The ship crosses the ergosphere threshold. Spacetime frame-dragging begins warping internal chronometers.',
      turningPoint: true,
      status: 'drafted',
    },
    {
      id: 'beat-5',
      act: 'Act II-A',
      beatName: 'Fun & Games / Exploration',
      targetPercent: 40,
      tensionScore: 6,
      description: 'Deciphering the acoustic waveform reveals holographic equations matching non-Euclidean quantum gravity.',
      turningPoint: false,
      status: 'drafted',
    },
    {
      id: 'beat-6',
      act: 'Act II-A',
      beatName: 'Midpoint (False Victory & Real Danger)',
      targetPercent: 50,
      tensionScore: 8,
      description: 'The frequency isn’t an ancient recording—it is responding to their ship’s presence in real time.',
      turningPoint: true,
      status: 'drafted',
    },
    {
      id: 'beat-7',
      act: 'Act II-B',
      beatName: 'Bad Guys Close In / System Failure',
      targetPercent: 65,
      tensionScore: 8,
      description: 'Radiation shielding fails. IRIS AI core exhibits cognitive dissociation, speaking in crew member childhood voices.',
      turningPoint: false,
      status: 'planned',
    },
    {
      id: 'beat-8',
      act: 'Act II-B',
      beatName: 'All Hope is Lost (Dark Night of the Soul)',
      targetPercent: 75,
      tensionScore: 9,
      description: 'Engines flame out. The gravity gradient pins the hull. Thorne realizes the broadcast is timestamped tomorrow.',
      turningPoint: true,
      status: 'planned',
    },
    {
      id: 'beat-9',
      act: 'Act III',
      beatName: 'Break into Act III / Climax',
      targetPercent: 88,
      tensionScore: 10,
      description: 'Vance initiates an inverted Penrose energy extraction to slingshot the transmission package home before the hull implodes.',
      turningPoint: true,
      status: 'planned',
    },
    {
      id: 'beat-10',
      act: 'Act III',
      beatName: 'Final Image & Resolution',
      targetPercent: 100,
      tensionScore: 4,
      description: 'The probe reaches Earth relay stations as a lone beacon pulses in the dark. The silence returns.',
      turningPoint: false,
      status: 'planned',
    },
  ];

  const continuityChecklist: ContinuityItem[] = [
    {
      id: 'cont-1',
      category: 'Wardrobe',
      sceneSequence: 1,
      item: 'Vance Flight Patch',
      note: 'NASA / Ares VII expedition insignia on left shoulder; check for burn mark after Scene 4.',
      verified: true,
    },
    {
      id: 'cont-2',
      category: 'Lighting',
      sceneSequence: 2,
      item: 'Console Status Glow',
      note: 'Switches from calm Cyan (#00f0ff) to Alert Amber (#f59e0b) upon crossing ergosphere.',
      verified: true,
    },
    {
      id: 'cont-3',
      category: 'Props',
      sceneSequence: 3,
      item: 'Mechanical Chronometer',
      note: 'Mechanical pocket watch ticks backwards during relativistic frame-drag sequences.',
      verified: true,
    },
    {
      id: 'cont-4',
      category: 'Timeline',
      sceneSequence: 4,
      item: 'Ship Time Dilatation',
      note: 'Elapsed mission time: 48 hours. Earth relative time: 14.2 years.',
      verified: false,
    },
  ];

  const characterDynamics: CharacterTensionNode[] = [
    {
      characterA: characters[0]?.name || 'Commander Elena Vance',
      characterB: characters[1]?.name || 'Dr. Thorne',
      dynamic: 'Duty vs. Truth Paradigm',
      conflictIntensity: 8,
      unresolvedStakes: 'Elena prioritizes crew evacuation, but Thorne refuses to leave until the broadcast mathematical proof is confirmed.',
    },
    {
      characterA: characters[0]?.name || 'Commander Elena Vance',
      characterB: 'IRIS (Synthetic Core)',
      dynamic: 'Human Instinct vs. Cold Machine Logic',
      conflictIntensity: 7,
      unresolvedStakes: 'IRIS begins making decisions based on predictive casualty probabilities rather than human survival orders.',
    },
  ];

  const copyrightAudit: CopyrightRiskAudit = {
    overallRisk: 'Low Risk / Safe',
    fairUseScore: 94,
    transformativeIndex: 96,
    flags: [
      {
        item: 'Acoustic Singularity Premise',
        riskCategory: 'Direct Lore Copyright',
        severity: 'Low',
        recommendation: 'Wholly original speculative astrophysics premise grounded in published peer-reviewed theoretical mechanics.',
      },
      {
        item: '1420 MHz Hydrogen Resonance',
        riskCategory: 'Audio / Music Sampling',
        severity: 'Low',
        recommendation: 'Real physical cosmological constant in public domain scientific literature.',
      },
      {
        item: 'Synthetic Vocal Synthesis',
        riskCategory: 'Likeness / Persona',
        severity: 'Low',
        recommendation: 'Synthetic voice model generated via local browser synthesizer; zero unauthorized celebrity voice clones.',
      },
    ],
  };

  return {
    format: script.format || 'Feature Film / Episodic Narrative',
    logline: defaultLogline,
    thematicCore: 'The conflict between finite human perception and infinite cosmological causality.',
    beats,
    continuityChecklist,
    characterDynamics,
    copyrightAudit,
  };
}
