/**
 * DARK MATTER OS - Subtitle & Caption Export Engine
 * Migrated and hardened from MINT-MIND
 *
 * Supports:
 * - SubRip (.SRT) generation with compliant 00:00:00,000 timestamps
 * - WebVTT (.VTT) generation with compliant 00:00:00.000 timestamps
 * - JSON word-level export with millisecond accuracy
 * - Direct client-side file downloads
 */

export interface CaptionWord {
  word: string;
  startSec: number;
  endSec: number;
  highlight?: boolean;
}

export interface CaptionLine {
  id: string;
  startSec: number;
  endSec: number;
  speaker?: string;
  text: string;
  words?: CaptionWord[];
}

export interface CaptionConfig {
  style: 'bold_pop' | 'karaoke' | 'minimal_clean' | 'glow_neon' | 'cyber_terminal';
  fontFamily: string;
  fontSize: number;
  textColor: string;
  highlightColor: string;
  position: 'top' | 'center' | 'bottom';
  animation: 'word_by_word' | 'fade_line' | 'kinetic_bounce' | 'static';
  language?: string;
}

/**
 * Formats seconds into standard SRT timecode: HH:MM:SS,mmm
 */
export function formatSRTTimecode(totalSeconds: number): string {
  const safeSec = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = Math.floor(safeSec % 60);
  const milliseconds = Math.floor((safeSec % 1) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

/**
 * Formats seconds into standard WebVTT timecode: HH:MM:SS.mmm
 */
export function formatVTTTimecode(totalSeconds: number): string {
  const safeSec = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = Math.floor(safeSec % 60);
  const milliseconds = Math.floor((safeSec % 1) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

/**
 * Generates SubRip (.SRT) string
 */
export function generateSRT(captions: CaptionLine[]): string {
  if (!captions || captions.length === 0) return '';

  return captions
    .map((item, index) => {
      const idx = index + 1;
      const start = formatSRTTimecode(item.startSec);
      const end = formatSRTTimecode(item.endSec);
      const speakerPrefix = item.speaker ? `[${item.speaker}]: ` : '';
      return `${idx}\n${start} --> ${end}\n${speakerPrefix}${item.text.trim()}\n`;
    })
    .join('\n');
}

/**
 * Generates WebVTT (.VTT) string
 */
export function generateVTT(captions: CaptionLine[]): string {
  if (!captions || captions.length === 0) return 'WEBVTT\n\n';

  let vtt = 'WEBVTT - DARK MATTER HIGH-GRAVITY SUBTITLES\n\n';

  captions.forEach((item, index) => {
    const idx = index + 1;
    const start = formatVTTTimecode(item.startSec);
    const end = formatVTTTimecode(item.endSec);
    const speakerPrefix = item.speaker ? `<v ${item.speaker}>` : '';
    const speakerSuffix = item.speaker ? '</v>' : '';
    vtt += `${idx}\n${start} --> ${end}\n${speakerPrefix}${item.text.trim()}${speakerSuffix}\n\n`;
  });

  return vtt;
}

/**
 * Generates JSON caption export
 */
export function generateJSONExport(captions: CaptionLine[], config?: CaptionConfig): string {
  const payload = {
    generator: 'DARK MATTER OS Caption Engine v2.5',
    exportedAt: new Date().toISOString(),
    config: config || {
      style: 'bold_pop',
      fontFamily: 'Montserrat',
      fontSize: 28,
      textColor: '#ffffff',
      highlightColor: '#00f0ff',
      position: 'bottom',
      animation: 'word_by_word',
    },
    totalCaptions: captions.length,
    durationSec: captions.length > 0 ? captions[captions.length - 1].endSec : 0,
    captions: captions.map((c) => ({
      id: c.id,
      startSec: c.startSec,
      endSec: c.endSec,
      speaker: c.speaker || null,
      text: c.text,
      words: c.words || [],
    })),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Direct file download in browser
 */
export function downloadCaptionFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Automatically calculates per-word timestamps within a caption line based on syllable/character length
 */
export function recalculateWordsTiming(line: CaptionLine): CaptionWord[] {
  const words = line.text.trim().split(/\s+/);
  if (words.length === 0) return [];

  const totalDuration = Math.max(0.5, line.endSec - line.startSec);
  const totalChars = words.reduce((acc, w) => acc + w.length, 0);

  let currentStart = line.startSec;

  return words.map((w, idx) => {
    const fraction = totalChars > 0 ? w.length / totalChars : 1 / words.length;
    const wordDuration = fraction * totalDuration;
    const startSec = currentStart;
    const endSec = idx === words.length - 1 ? line.endSec : currentStart + wordDuration;
    currentStart = endSec;

    return {
      word: w,
      startSec: Math.round(startSec * 100) / 100,
      endSec: Math.round(endSec * 100) / 100,
    };
  });
}
