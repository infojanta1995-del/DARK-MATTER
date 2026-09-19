/**
 * DARK MATTER OS - Scene Breakdown & Export Service
 * Migrated from MINT-MIND SceneBreakdownStudio
 */

import { Scene } from '../types';

export function reindexScenes(scenes: Scene[]): Scene[] {
  return scenes.map((s, idx) => ({
    ...s,
    sequence: idx + 1,
    title: s.title || `Scene ${idx + 1}`,
  }));
}

export function exportScenesToJSON(scenes: Scene[], scriptTitle = 'Dark Matter Script'): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    scriptTitle,
    totalScenes: scenes.length,
    scenes: scenes.map((s) => ({
      sequence: s.sequence,
      title: s.title,
      setting: s.setting || 'UNKNOWN',
      timeOfDay: s.timeOfDay || 'DAY',
      description: s.description,
      visualPrompt: s.visualPrompt,
      cameraShot: s.cameraShot || 'Medium Shot',
      cameraMovement: s.cameraMovement || 'Slow Push-In',
      audioPrompt: s.audioPrompt,
      dialogue: s.dialogue,
      durationSec: s.durationSec,
      characters: s.characters || [],
    })),
  };
  return JSON.stringify(payload, null, 2);
}

export function exportScenesToCSV(scenes: Scene[]): string {
  const headers = [
    'Scene #',
    'Title',
    'Setting',
    'Time of Day',
    'Camera Shot',
    'Camera Movement',
    'Duration (Sec)',
    'Visual Direction',
    'Audio Direction',
    'Dialogue / Voiceover',
  ];

  const escapeCsv = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = scenes.map((s) => [
    s.sequence,
    escapeCsv(s.title),
    escapeCsv(s.setting),
    escapeCsv(s.timeOfDay),
    escapeCsv(s.cameraShot),
    escapeCsv(s.cameraMovement),
    s.durationSec,
    escapeCsv(s.visualPrompt),
    escapeCsv(s.audioPrompt),
    escapeCsv(s.dialogue),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportScenesToText(scenes: Scene[], scriptTitle = 'Dark Matter Script'): string {
  let output = `=================================================================\n`;
  output += `DARK MATTER OS // PRODUCTION SHOT BREAKDOWN\n`;
  output += `PROJECT: ${scriptTitle.toUpperCase()}\n`;
  output += `EXPORTED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
  output += `TOTAL SCENES: ${scenes.length}\n`;
  output += `=================================================================\n\n`;

  scenes.forEach((s) => {
    output += `-----------------------------------------------------------------\n`;
    output += `SCENE ${String(s.sequence).padStart(2, '0')}: ${s.title.toUpperCase()}\n`;
    output += `SETTING: ${s.setting || 'INT.'} [${s.timeOfDay || 'DAY'}] | DURATION: ${s.durationSec}s\n`;
    output += `CAMERA: ${s.cameraShot || 'Medium'} // MOVEMENT: ${s.cameraMovement || 'Static'}\n`;
    output += `-----------------------------------------------------------------\n`;
    output += `VISUAL CUE:\n${s.visualPrompt || s.description || 'N/A'}\n\n`;
    if (s.audioPrompt) {
      output += `AUDIO / SOUND FX:\n${s.audioPrompt}\n\n`;
    }
    if (s.dialogue) {
      output += `DIALOGUE / NARRATION:\n${s.dialogue}\n\n`;
    }
  });

  return output;
}
