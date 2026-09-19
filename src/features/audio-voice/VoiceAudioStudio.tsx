import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { HoloPanel } from '../../components/common/HoloPanel';
import { GlowButton } from '../../components/common/GlowButton';
import { TimelineConfig, ThumbnailConfig } from '../../types';
import { 
  downloadCaptionFile, 
  generateSRT, 
  generateVTT,
  CaptionLine
} from '../../services/captionExportService';
import {
  VOICE_MODELS_CATALOG,
  calculateSpeechDuration
} from '../../services/voicePipelineService';
import {
  STORY_MODE_THUMBNAIL_STYLES,
  generateThumbnailConcepts
} from '../../services/thumbnailService';
import { 
  Mic, 
  Headphones, 
  Subtitles, 
  MonitorPlay, 
  Image as ImageIcon, 
  Play, 
  Pause,
  Volume2, 
  VolumeX,
  Sliders, 
  Sparkles,
  Layers,
  Download,
  Copy,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wand2,
  FileText,
  Activity,
  Radio,
  Share2,
  Smartphone,
  Tv
} from 'lucide-react';

export const VoiceAudioStudio: React.FC<{ initialSubModule?: string }> = ({ initialSubModule = 'voice' }) => {
  const { 
    currentProject, 
    addAsset, 
    updateTimelineConfig, 
    updateThumbnailConfig, 
    triggerToast 
  } = useApp();
  
  const { playCockpitBeep } = useTheme();

  const [activeTab, setActiveTab] = useState<'voice' | 'audio' | 'captions' | 'video' | 'thumbnail'>(
    (initialSubModule as any) || 'voice'
  );

  useEffect(() => {
    if (initialSubModule) {
      setActiveTab(initialSubModule as any);
    }
  }, [initialSubModule]);

  // =========================================================================
  // TAB 1: VOICE SYNTHESIS STATE & AUDIO ENGINE
  // =========================================================================
  const [pitch, setPitch] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [reverb, setReverb] = useState(65);
  const [selectedVoice, setSelectedVoice] = useState('Elena Vance (Calm Operator)');
  const [testSpeechText, setTestSpeechText] = useState(
    'Station Log 4120. All telemetry indicates we have stabilized orbital decay around Cygnus X-1. The frequency modulation is repeating in prime numbers.'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play synthetic speech via browser SpeechSynthesis
  const handleAuditionSpeech = () => {
    playCockpitBeep('engage');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(testSpeechText);
      // Map 0-100 to pitch 0.5 - 1.5
      utterance.pitch = 0.5 + (pitch / 100);
      // Map 0-100 to rate 0.6 - 1.6
      utterance.rate = 0.6 + (speed / 100);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      triggerToast('info', 'AUDIO SYNTHESIZED', 'Audio timbre synthesized in memory.');
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSaveVoiceAsset = () => {
    addAsset({
      projectId: currentProject.id,
      name: `Voiceover: ${selectedVoice.split(' ')[0]} - Scene Log`,
      category: 'Voice',
      format: 'WAV 48kHz 24-bit',
      fileSize: '1.4 MB',
      duration: '00:00:18',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
      status: 'Ready',
    });
    triggerToast('success', 'VOICE ASSET SAVED', 'Voiceover stem saved to Media Vault.');
  };

  // =========================================================================
  // TAB 2: SOUNDTRACK & STEM MIXER STATE
  // =========================================================================
  const [stemLevels, setStemLevels] = useState<{ [key: string]: number }>({
    'Singularity Sub-Bass Pulse': 85,
    'Ergosphere Shimmer Drone': 70,
    'Cryogenic Chamber Chimes': 45,
    'Radio Static Pulsar': 30,
  });
  const [stemMutes, setStemMutes] = useState<{ [key: string]: boolean }>({});
  const [isPlayingAtmosphere, setIsPlayingAtmosphere] = useState(false);

  // Play Web Audio synthesized atmospheric tone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const toggleAtmosphericAudition = () => {
    if (isPlayingAtmosphere) {
      try {
        oscRef.current?.stop();
        oscRef.current?.disconnect();
      } catch (e) {}
      setIsPlayingAtmosphere(false);
      playCockpitBeep('click');
    } else {
      playCockpitBeep('engage');
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A2 cosmic hum
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscRef.current = osc;
        }
      } catch (e) {}
      setIsPlayingAtmosphere(true);
    }
  };

  useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop();
      } catch (e) {}
    };
  }, []);

  // =========================================================================
  // TAB 3: KINETIC CAPTIONS
  // =========================================================================
  const [hudPreset, setHudPreset] = useState<'Amber' | 'Cyan' | 'Emerald' | 'White'>('Cyan');
  const [captionAspectRatio, setCaptionAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [captionsList, setCaptionsList] = useState([
    { id: 'c1', tc: '00:00:02.100 --> 00:00:05.400', speaker: 'ELENA', text: 'Telemetry stabilized. We are riding the edge of the ergosphere.' },
    { id: 'c2', tc: '00:00:05.800 --> 00:00:09.120', speaker: 'IRIS', text: 'Radiation pressure exceeding standard tolerances by fourteen percent.' },
    { id: 'c3', tc: '00:00:09.600 --> 00:00:13.200', speaker: 'THORNE', text: 'Listen to the frequency modulation. That is not background cosmic noise.' },
    { id: 'c4', tc: '00:00:13.800 --> 00:00:18.500', speaker: 'ELENA', text: 'It is a mathematical sequence. It is counting down.' },
  ]);
  const [activePreviewCaptionIdx, setActivePreviewCaptionIdx] = useState(0);

  const captionLines: CaptionLine[] = captionsList.map((c, i) => ({
    id: c.id,
    startSec: i * 4 + 2,
    endSec: i * 4 + 5.5,
    text: c.text,
    speaker: c.speaker,
  }));

  const handleExportSrt = () => {
    playCockpitBeep('engage');
    const srtContent = generateSRT(captionLines);
    navigator.clipboard.writeText(srtContent);
    triggerToast('success', 'SRT EXPORTED', 'Subtitles copied to clipboard in SubRip (.srt) format.');
  };

  const handleDownloadSrt = () => {
    playCockpitBeep('engage');
    downloadCaptionFile(
      generateSRT(captionLines),
      `${(currentProject.name || 'subtitles').toLowerCase().replace(/\s+/g, '_')}_subtitles.srt`,
      'text/plain;charset=utf-8'
    );
    triggerToast('success', 'SRT DOWNLOADED', 'SubRip subtitle file saved.');
  };

  const handleDownloadVtt = () => {
    playCockpitBeep('engage');
    downloadCaptionFile(
      generateVTT(captionLines),
      `${(currentProject.name || 'subtitles').toLowerCase().replace(/\s+/g, '_')}_subtitles.vtt`,
      'text/vtt;charset=utf-8'
    );
    triggerToast('success', 'VTT DOWNLOADED', 'WebVTT subtitle file saved.');
  };

  // =========================================================================
  // TAB 4: VIDEO TIMELINE SEQUENCER
  // =========================================================================
  const timeline: TimelineConfig = currentProject.timelineData || {
    totalDuration: 180,
    currentTime: 14.5,
    isPlaying: false,
    zoomLevel: 100,
    aspectRatio: '16:9',
    resolution: '4K UHD',
    tracks: [
      {
        id: 'visual',
        name: 'V1 // VISUALS',
        type: 'video',
        muted: false,
        solo: false,
        volume: 100,
        clips: [
          { id: 'i1', trackId: 'visual', title: 'Shot 01: Deep Space Horizon', startTime: 0, duration: 30, color: '#06b6d4' },
          { id: 'i2', trackId: 'visual', title: 'Shot 02: Bridge Ergosphere Dive', startTime: 30, duration: 45, color: '#3b82f6' },
          { id: 'i3', trackId: 'visual', title: 'Shot 03: Black Hole Flare', startTime: 75, duration: 35, color: '#8b5cf6' },
        ],
      },
      {
        id: 'voice',
        name: 'A1 // VOICEOVER',
        type: 'audio',
        muted: false,
        solo: false,
        volume: 95,
        clips: [
          { id: 'v1', trackId: 'voice', title: 'Elena Narration: Log 4120', startTime: 2, duration: 25, color: '#10b981' },
          { id: 'v2', trackId: 'voice', title: 'IRIS Dialogue: Alert Sequence', startTime: 32, duration: 38, color: '#10b981' },
        ],
      },
      {
        id: 'audio',
        name: 'A2 // SOUNDTRACK',
        type: 'audio',
        muted: false,
        solo: false,
        volume: 80,
        clips: [
          { id: 'a1', trackId: 'audio', title: 'Singularity Resonance Bed (D Min)', startTime: 0, duration: 120, color: '#f59e0b' },
        ],
      },
      {
        id: 'captions',
        name: 'S1 // CAPTIONS',
        type: 'overlay',
        muted: false,
        solo: false,
        volume: 100,
        clips: [
          { id: 's1', trackId: 'captions', title: 'Synchronized HUD Subtitles', startTime: 2, duration: 90, color: '#ec4899' },
        ],
      },
    ],
  };

  const [currentPlaySec, setCurrentPlaySec] = useState<number>(timeline.currentTime || 14.5);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(timeline.zoomLevel);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  // Playhead scrubber timer
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setCurrentPlaySec((prev: number) => {
          if (prev >= 120) return 0;
          return Number((prev + 0.25).toFixed(2));
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  const handleCommenceRender = () => {
    playCockpitBeep('engage');
    setIsRenderingVideo(true);
    setRenderProgress(10);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRenderingVideo(false);
          playCockpitBeep('pulse');
          addAsset({
            projectId: currentProject.id,
            name: `${currentProject.name} - Master 4K ProRes Render`,
            category: 'Video',
            format: 'Apple ProRes 422 HQ',
            fileSize: '1.82 GB',
            duration: '00:02:00',
            resolution: '3840x2160 (4K)',
            url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
            status: 'Ready',
          });
          triggerToast('success', 'RENDER COMPLETE', 'Master 4K video render dispatched to Vault.');
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  // Format seconds to timecode
  const formatTimecode = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const frames = Math.floor((sec % 1) * 24);
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // TAB 5: THUMBNAIL COMPOSITOR & A/B LAB
  // =========================================================================
  const thumbConfig: ThumbnailConfig = currentProject.thumbnailData || {
    headlineText: 'DO NOT ENTER THE HORIZON',
    subText: 'The 1420 MHz Prime Signal Decoded',
    badgeText: 'CYGNUS X-1 CLASSIFIED',
    themeStyle: 'Electric Cyan & Event Horizon',
    aspectRatio: '16:9',
    currentVariantId: 'v-1',
    variants: [
      { id: 'v-1', name: 'Variant A', titleText: 'DO NOT ENTER THE HORIZON', colorScheme: 'Cyan & Void Purple', focalElement: 'Accretion Disk', predictedCtr: '11.8%', contrastRating: 'Exceptional', selected: true },
      { id: 'v-2', name: 'Variant B', titleText: 'WE LISTENED TO THE BLACK HOLE', colorScheme: 'Solar Flare Gold & Black', focalElement: 'Radio Wave Halo', predictedCtr: '10.2%', contrastRating: 'High', selected: false },
      { id: 'v-3', name: 'Variant C', titleText: 'THE SIGNAL WAS NOT NATURAL', colorScheme: 'Warning Red & Neon Cyan', focalElement: 'Cockpit Viewport', predictedCtr: '12.4%', contrastRating: 'Exceptional', selected: false },
    ],
  };

  const [activeHeadline, setActiveHeadline] = useState(thumbConfig.headlineText);
  const [activeBadge, setActiveBadge] = useState(thumbConfig.badgeText || 'CYGNUS X-1 CLASSIFIED');
  const [selectedVariantId, setSelectedVariantId] = useState(thumbConfig.currentVariantId || 'v-1');
  const [selectedStoryStyle, setSelectedStoryStyle] = useState<string>('Tech Explainer');

  const handleSelectVariant = (variant: typeof thumbConfig.variants[0]) => {
    playCockpitBeep('click');
    setSelectedVariantId(variant.id);
    setActiveHeadline(variant.titleText);
    updateThumbnailConfig({
      headlineText: variant.titleText,
      currentVariantId: variant.id,
    });
    triggerToast('info', 'THUMBNAIL UPDATED', `Loaded variant: "${variant.titleText}".`);
  };

  const handleSaveThumbnailAsset = () => {
    addAsset({
      projectId: currentProject.id,
      name: `Thumbnail: ${activeHeadline}`,
      category: 'Thumbnails',
      fileSize: '3.2 MB',
      resolution: '3840x2160 (4K)',
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      status: 'Ready',
    });
    triggerToast('success', 'THUMBNAIL SAVED', 'Vaulted high-gravity thumbnail into Media Vault.');
  };

  return (
    <div className="space-y-5">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Headphones className="w-4 h-4" />
            <span>// ACOUSTIC, OPTICAL & MULTI-TRACK ENGINE</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            VOICE, SOUNDTRACK & TIMELINE STUDIO
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Synthesize character voices, compose ambient stems, align kinetic subtitles, and orchestrate the multi-track timeline.
          </p>
        </div>

        {/* Sub-module Switcher */}
        <div className="flex items-center space-x-1.5 bg-[var(--dm-surface-elevated)] p-1 rounded-xl border border-[var(--dm-border)] overflow-x-auto">
          {[
            { id: 'voice', label: 'VOICE SYNTH', icon: Mic },
            { id: 'audio', label: 'SOUNDTRACK', icon: Headphones },
            { id: 'captions', label: 'CAPTIONS', icon: Subtitles },
            { id: 'video', label: 'TIMELINE & RENDER', icon: MonitorPlay },
            { id: 'thumbnail', label: 'THUMBNAIL LAB', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playCockpitBeep('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-display uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[var(--dm-accent)] text-black font-bold shadow-[0_0_12px_var(--dm-accent-soft)]'
                    : 'text-[var(--dm-text-secondary)] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VOICE SYNTHESIZER */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <HoloPanel title="SPEECH GENERATOR" subtitle="NEURAL TIMBRE SYNTHESIZER">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-[var(--dm-muted)] uppercase">
                    DIALOGUE OR SCRIPT PASSAGE
                  </label>
                  <button
                    onClick={() => {
                      if (currentProject.scenes.length > 0) {
                        setTestSpeechText(currentProject.scenes[0].content);
                        triggerToast('info', 'SCENE IMPORTED', 'Loaded scene screenplay text.');
                      }
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-2.5 h-2.5" /> LOAD FROM SCENE 1
                  </button>
                </div>

                <textarea
                  value={testSpeechText}
                  onChange={(e) => setTestSpeechText(e.target.value)}
                  className="w-full h-32 p-3 rounded-lg bg-black/60 border border-[var(--dm-border)] text-xs font-mono text-[var(--dm-text)] focus:border-[var(--dm-accent)] focus:outline-none leading-relaxed"
                  placeholder="Input script lines for voice generation..."
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    {isSpeaking ? (
                      <GlowButton
                        variant="secondary"
                        size="md"
                        icon={<Pause className="w-4 h-4 text-amber-400 fill-current" />}
                        onClick={handleStopSpeech}
                      >
                        HALT SPEECH
                      </GlowButton>
                    ) : (
                      <GlowButton
                        variant="primary"
                        size="md"
                        icon={<Play className="w-4 h-4 fill-current" />}
                        onClick={handleAuditionSpeech}
                      >
                        AUDITION TIMBRE (REAL SPEECH)
                      </GlowButton>
                    )}
                  </div>

                  <GlowButton
                    variant="outline"
                    size="md"
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleSaveVoiceAsset}
                  >
                    SAVE VOICE STEM TO VAULT
                  </GlowButton>
                </div>
              </div>
            </HoloPanel>
          </div>

          <div className="space-y-4">
            <HoloPanel
              title="ACOUSTIC TIMBRE PROFILES"
              subtitle="VOICE CHARACTER & MODEL SELECTION"
              headerRight={
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  EST: {calculateSpeechDuration(testSpeechText, 145)}s
                </span>
              }
            >
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                    CURATED VOICE MODEL ARCHETYPES
                  </label>
                  <div className="grid grid-cols-1 gap-1.5 mb-2.5 max-h-48 overflow-y-auto pr-1">
                    {VOICE_MODELS_CATALOG.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVoice(v.name);
                          setSpeed(Math.round((v.paceWPM / 200) * 100));
                          playCockpitBeep('click');
                        }}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedVoice.includes(v.name.split(' ')[0])
                            ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                            : 'bg-black/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[11px] text-cyan-300">{v.name}</span>
                          <span className="text-[9px] font-mono text-slate-500">{v.paceWPM} WPM</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{v.description}</p>
                      </button>
                    ))}
                  </div>

                  <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                    ACTIVE VOICE PERSONA
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-xs font-mono text-cyan-300 focus:outline-none"
                  >
                    <option value="Elena Vance (Calm Operator)">Elena Vance (Calm Operator)</option>
                    <option value="IRIS Core (Quantum Synthetic AI)">IRIS Core (Quantum Synthetic AI)</option>
                    <option value="Adam (Deep Baritone)">Adam (Deep Baritone)</option>
                    <option value="Rachel (Warm Narrative)">Rachel (Warm Narrative)</option>
                    <option value="Antoni (Modern Kinetic)">Antoni (Modern Kinetic)</option>
                    <option value="Bella (Intimate Chiaroscuro)">Bella (Intimate Chiaroscuro)</option>
                    <option value="Marcus (Theatrical Commander)">Marcus (Theatrical Commander)</option>
                    <option value="Commander Thorne (Deep Resonant)">Commander Thorne (Deep Resonant)</option>
                    <option value="Deep Space Relay 9 (Radio Filter)">Deep Space Relay 9 (Radio Filter)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--dm-divider)]">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                      <span>PITCH MODULATION</span>
                      <span>{pitch}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full accent-[var(--dm-accent)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                      <span>CADENCE / SPEED</span>
                      <span>{speed}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full accent-[var(--dm-accent)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[var(--dm-muted)] mb-1">
                      <span>HULL REVERBERATION</span>
                      <span>{reverb}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={reverb}
                      onChange={(e) => setReverb(Number(e.target.value))}
                      className="w-full accent-[var(--dm-accent)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOUNDTRACK GENERATOR & STEM MIXER */}
      {/* ========================================================================= */}
      {activeTab === 'audio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HoloPanel
            title="COSMIC ATMOSPHERE SUITE"
            subtitle="4-CHANNEL MULTI-STEM MIXER"
            headerRight={
              <button
                onClick={toggleAtmosphericAudition}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                  isPlayingAtmosphere
                    ? 'bg-red-500/20 text-red-300 border-red-500/60 animate-pulse'
                    : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/40'
                }`}
              >
                {isPlayingAtmosphere ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlayingAtmosphere ? 'HALT AUDITION' : 'AUDITION SYNTH'}</span>
              </button>
            }
          >
            <div className="space-y-3 text-xs">
              {Object.keys(stemLevels).map((stemName) => {
                const isMuted = stemMutes[stemName] || false;
                return (
                  <div key={stemName} className="p-3 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-[var(--dm-text)]">{stemName}</h4>
                        <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                          Analog Synthesizer // Low-Frequency Resonance
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setStemMutes({ ...stemMutes, [stemName]: !isMuted });
                          playCockpitBeep('click');
                        }}
                        className={`p-1.5 rounded border transition-colors cursor-pointer ${
                          isMuted
                            ? 'bg-red-950/60 text-red-400 border-red-500/40'
                            : 'bg-black text-slate-300 border-slate-700 hover:text-white'
                        }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-[10px] text-[var(--dm-muted)] w-8">
                        {isMuted ? 'MUTE' : `${stemLevels[stemName]}%`}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        disabled={isMuted}
                        value={stemLevels[stemName]}
                        onChange={(e) => setStemLevels({ ...stemLevels, [stemName]: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </HoloPanel>

          <HoloPanel title="DYNAMIC CUE COMPOSER" subtitle="TENSION ALIGNED WITH SCENES">
            <div className="p-4 rounded-xl bg-[var(--dm-surface)] border border-[var(--dm-border)] space-y-3 text-xs">
              <p className="text-[var(--dm-text-secondary)] leading-relaxed">
                Soundtrack tension automatically locks to the screenplay tension curve. Scene 1 begins with a low 35 dB ambient drone, crescendoing to a 98 dB singularity climax in Scene 2.
              </p>
              
              {/* Animated visualizer bars */}
              <div className="p-4 rounded-xl bg-black border border-[var(--dm-border)] space-y-2">
                <span className="font-mono text-[9px] text-cyan-400 uppercase font-bold block">
                  REAL-TIME FREQUENCY SPECTRUM (CYGNUS 1420 MHz)
                </span>
                <div className="flex items-end space-x-1.5 h-16 pt-2">
                  {[40, 65, 85, 30, 95, 75, 60, 45, 80, 90, 55, 70, 85, 40, 65, 90, 100, 80, 45, 35].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-cyan-950 via-cyan-500 to-cyan-300 rounded-t"
                      style={{ height: `${isPlayingAtmosphere ? (h * 0.9 + Math.random() * 10) : (h * 0.5)}%` }}
                    />
                  ))}
                </div>
              </div>

              <GlowButton
                variant="primary"
                size="sm"
                className="w-full"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => {
                  playCockpitBeep('engage');
                  triggerToast('success', 'SCORE SYNTHESIZED', 'Scene-aligned score generated and mapped to Scene 1 & 2.');
                }}
              >
                GENERATE SCENE-ALIGNED SCORE
              </GlowButton>
            </div>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KINETIC CAPTIONS & SUBTITLES */}
      {/* ========================================================================= */}
      {activeTab === 'captions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-4">
            <HoloPanel
              title="KINETIC SUBTITLE & TIMECODE EDITOR"
              subtitle="SPEECH RECOGNITION & SYNC MATRIX"
              headerRight={
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={handleDownloadSrt}
                    className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono hover:bg-cyan-900/60 flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3" /> .SRT
                  </button>
                  <button
                    onClick={handleDownloadVtt}
                    className="px-2.5 py-1 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono hover:bg-indigo-900/60 flex items-center gap-1 transition-all"
                  >
                    <Download className="w-3 h-3" /> .VTT
                  </button>
                  <button
                    onClick={handleExportSrt}
                    className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-mono hover:text-white flex items-center gap-1 transition-all"
                  >
                    <Copy className="w-3 h-3" /> COPY
                  </button>
                </div>
              }
            >
              <div className="space-y-3 text-xs font-mono">
                {captionsList.map((cap, i) => (
                  <div
                    key={cap.id}
                    onClick={() => setActivePreviewCaptionIdx(i)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      activePreviewCaptionIdx === i
                        ? 'border-cyan-400 bg-cyan-950/30'
                        : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="text-amber-400 font-bold mr-2">[{cap.speaker}]</span>
                      <span className="text-slate-200">{cap.text}</span>
                    </div>
                    <span className="text-[10px] text-[var(--dm-muted)] shrink-0">{cap.tc}</span>
                  </div>
                ))}
              </div>
            </HoloPanel>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <HoloPanel
              title="OPTICAL HUD OVERLAY PREVIEW"
              subtitle="VIEWPORT SIMULATOR"
              headerRight={
                <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => setCaptionAspectRatio('16:9')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                      captionAspectRatio === '16:9'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tv className="w-2.5 h-2.5" /> 16:9
                  </button>
                  <button
                    onClick={() => setCaptionAspectRatio('9:16')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all ${
                      captionAspectRatio === '9:16'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-2.5 h-2.5" /> 9:16
                  </button>
                </div>
              }
            >
              {/* Video preview with overlay text */}
              <div
                className={`relative w-full rounded-xl bg-black border-2 border-slate-800 overflow-hidden flex items-end justify-center p-4 transition-all duration-300 ${
                  captionAspectRatio === '9:16'
                    ? 'aspect-[9/16] max-w-[230px] mx-auto min-h-[380px]'
                    : 'aspect-video w-full'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/50 via-black to-slate-900" />
                <div className="absolute top-3 left-3 text-[9px] font-mono text-cyan-400">
                  REC // {captionAspectRatio === '9:16' ? 'VERTICAL SHORTS' : '4K 24FPS'}
                </div>

                {/* Subtitle text */}
                <div className="relative z-10 text-center max-w-sm pb-2">
                  <span
                    className={`inline-block font-display font-bold text-xs sm:text-sm px-3 py-1 rounded tracking-wide shadow-2xl ${
                      hudPreset === 'Amber'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                        : hudPreset === 'Emerald'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                        : hudPreset === 'White'
                        ? 'bg-black/80 text-white border border-slate-700'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                    }`}
                  >
                    [{captionsList[activePreviewCaptionIdx]?.speaker}] {captionsList[activePreviewCaptionIdx]?.text}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <span className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block">
                  HUD SUBTITLE STYLING PRESET
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Cyan', 'Amber', 'Emerald', 'White'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setHudPreset(preset)}
                      className={`py-1 rounded text-xs font-mono uppercase border transition-colors cursor-pointer ${
                        hudPreset === preset
                          ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold'
                          : 'border-slate-800 bg-black text-slate-400'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </HoloPanel>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VIDEO TIMELINE SEQUENCER & RENDER */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          {/* Top Row: Master Render Viewport & Codec Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <HoloPanel title="MASTER RENDER MONITOR" subtitle="4K PRORES 4444 XQ">
                <div className="relative aspect-video w-full rounded-xl bg-black border border-[var(--dm-border)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-black to-purple-950/40" />
                  
                  {/* Top HUD overlay */}
                  <div className="absolute top-3 inset-x-3 flex justify-between items-center text-[10px] font-mono text-cyan-400">
                    <span>TC: {formatTimecode(currentPlaySec)}</span>
                    <span>RESOLUTION: 3840 × 2160 (16:9)</span>
                  </div>

                  <div className="relative z-10 text-center space-y-2">
                    <MonitorPlay className="w-12 h-12 text-[var(--dm-accent)] mx-auto opacity-70 animate-pulse" />
                    <span className="font-mono text-xs text-white block uppercase tracking-widest">
                      {isPlayingTimeline ? 'PLAYING TIMELINE' : 'OPTICAL PREVIEW // READY'}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--dm-muted)]">
                      COLOR PROFILE: ACEScg // BIT DEPTH: 12-BIT
                    </span>
                  </div>
                </div>
              </HoloPanel>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <HoloPanel title="EXPORT MANIFEST" subtitle="GPU RENDER PARAMETERS">
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                    <span className="text-[var(--dm-muted)]">CODEC</span>
                    <span className="text-white">ProRes 4444 XQ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                    <span className="text-[var(--dm-muted)]">FPS</span>
                    <span className="text-white">24.000 fps</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                    <span className="text-[var(--dm-muted)]">COLOR SPACE</span>
                    <span className="text-white">Rec.709 / ACES</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[var(--dm-divider)]">
                    <span className="text-[var(--dm-muted)]">EST. FILE SIZE</span>
                    <span className="text-cyan-400">1.82 GB</span>
                  </div>

                  {isRenderingVideo ? (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-cyan-400 animate-pulse">DISPATCHING GPU NODES...</span>
                        <span className="text-white font-bold">{renderProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${renderProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <GlowButton
                      variant="primary"
                      size="md"
                      className="w-full mt-3"
                      icon={<Download className="w-4 h-4" />}
                      onClick={handleCommenceRender}
                    >
                      COMMENCE MASTER RENDER
                    </GlowButton>
                  )}
                </div>
              </HoloPanel>
            </div>
          </div>

          {/* Bottom Row: Multi-Track Timeline Sequencer */}
          <HoloPanel
            title="MULTI-TRACK TIMELINE SEQUENCER"
            subtitle="NON-LINEAR SYNCHRONIZATION"
            headerRight={
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                  className="flex items-center space-x-1 px-3 py-1 rounded text-xs font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 cursor-pointer"
                >
                  {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingTimeline ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <span className="font-mono text-xs text-white px-2 py-1 rounded bg-black border border-slate-800">
                  {formatTimecode(currentPlaySec)}
                </span>
              </div>
            }
          >
            <div className="space-y-2 select-none">
              {/* Timecode Ruler */}
              <div className="flex justify-between text-[9px] font-mono text-[var(--dm-muted)] border-b border-slate-800 pb-1">
                <span>00:00:00</span>
                <span>00:00:30</span>
                <span>00:01:00</span>
                <span>00:01:30</span>
                <span>00:02:00</span>
              </div>

              {/* Tracks */}
              {timeline.tracks.map((track) => (
                <div key={track.id} className="flex items-stretch border border-slate-800/80 rounded-lg overflow-hidden bg-black/50">
                  {/* Track header label */}
                  <div className="w-28 sm:w-36 p-2.5 bg-slate-950 border-r border-slate-800 flex items-center justify-between shrink-0">
                    <span className="font-mono text-[10px] font-bold text-slate-300 truncate">{track.name}</span>
                  </div>

                  {/* Track lane with blocks */}
                  <div className="flex-1 relative h-10 bg-slate-950/30 p-1 flex items-center overflow-hidden">
                    {/* Scrub line indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                      style={{ left: `${(currentPlaySec / 120) * 100}%` }}
                    />

                    {track.clips.map((clip) => {
                      const leftPercent = (clip.startTime / 120) * 100;
                      const widthPercent = (clip.duration / 120) * 100;
                      return (
                        <div
                          key={clip.id}
                          className="absolute h-8 rounded px-2 flex items-center truncate text-[10px] font-mono font-bold text-black border border-black/30 shadow"
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            backgroundColor: clip.color || '#06b6d4',
                          }}
                        >
                          <span className="truncate">{clip.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </HoloPanel>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: THUMBNAIL COMPOSITOR & A/B LAB */}
      {/* ========================================================================= */}
      {activeTab === 'thumbnail' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 Cols: Live Thumbnail Canvas Preview */}
            <div className="lg:col-span-7 space-y-3">
              <HoloPanel
                title="HIGH-GRAVITY THUMBNAIL COMPOSITOR"
                subtitle="YOUTUBE 4K / STREAM HERO"
                headerRight={
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-bold">
                    STYLE: {thumbConfig.themeStyle}
                  </span>
                }
              >
                <div className="aspect-video w-full rounded-xl bg-black border-2 border-[var(--dm-accent)] relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
                  {/* Cosmic backdrop simulation */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-black to-cyan-950/70" />
                  
                  {/* Glowing Event Horizon Ring simulation */}
                  <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full border-4 border-cyan-400/60 blur-[2px] opacity-70" />
                  <div className="absolute right-[-5%] top-[-15%] w-60 h-60 rounded-full border-2 border-amber-400/80 blur-[1px] opacity-80" />

                  {/* Top Badge */}
                  <div className="relative z-10">
                    <span className="inline-block font-mono text-xs px-2.5 py-1 rounded bg-red-600 text-white font-black uppercase tracking-widest shadow-lg">
                      {activeBadge}
                    </span>
                  </div>

                  {/* Center/Bottom Big Typography */}
                  <div className="relative z-10 space-y-1">
                    <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-wider uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                      {activeHeadline}
                    </h2>
                    <p className="font-mono text-xs font-bold text-cyan-300 drop-shadow">
                      {thumbConfig.subText}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <GlowButton
                    variant="primary"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={handleSaveThumbnailAsset}
                  >
                    SAVE THUMBNAIL ASSET TO VAULT
                  </GlowButton>
                </div>
              </HoloPanel>

              {/* StoryMode Visual Packaging & Prompt Studio */}
              <HoloPanel
                title="STORYMODE VISUAL PACKAGING & PROMPTS"
                subtitle="MIDJOURNEY v6 / FLUX PRODUCTION PROFILES"
                headerRight={
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                    4K PRORES READY
                  </span>
                }
              >
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1.5">
                      SELECT GENRE VISUAL ARCHETYPE
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {Object.keys(STORY_MODE_THUMBNAIL_STYLES).map((styleName) => (
                        <button
                          key={styleName}
                          type="button"
                          onClick={() => {
                            setSelectedStoryStyle(styleName);
                            playCockpitBeep('click');
                          }}
                          className={`p-1.5 rounded text-[10px] font-mono text-center border transition-all cursor-pointer truncate ${
                            selectedStoryStyle === styleName
                              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                              : 'bg-black/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {styleName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle] && (
                    <div className="p-3 rounded-lg bg-black/70 border border-slate-800 space-y-2 font-mono text-[11px]">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                        <span className="text-cyan-300 font-bold">
                          {selectedStoryStyle.toUpperCase()} SPECIFICATION
                        </span>
                        <span className="text-[9px] text-slate-500">
                          HOOKS: {STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].contrastKeywords.slice(0, 2).join(' / ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-500 block">LIGHTING:</span>
                          <span className="text-slate-300">{STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].lighting}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">COLOR PALETTE:</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].palette.map((c) => (
                              <span
                                key={c}
                                className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                            <span className="text-slate-400 text-[9px] ml-1">
                              {STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].palette.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          PROMPT TARGET: {selectedStoryStyle} 4K Keyframe
                        </span>
                        <button
                          onClick={() => {
                            const p = `Cinematic 4K YouTube thumbnail for ${activeHeadline}, ${STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].lighting}, styled in ${STORY_MODE_THUMBNAIL_STYLES[selectedStoryStyle].palette.join(' and ')}, extreme focal contrast, volumetric atmosphere, octane render, 8k --ar 16:9 --v 6.0`;
                            navigator.clipboard.writeText(p);
                            playCockpitBeep('engage');
                            triggerToast('success', 'PROMPT COPIED', 'Midjourney v6 prompt copied to clipboard.');
                          }}
                          className="px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono hover:bg-cyan-900/60 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Copy className="w-2.5 h-2.5" /> COPY MJ v6 PROMPT
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </HoloPanel>
            </div>

            {/* Right 5 Cols: Controls & A/B Variants */}
            <div className="lg:col-span-5 space-y-4">
              <HoloPanel title="THUMBNAIL HEADLINE & ACCENTS" subtitle="CLICKABILITY PARAMETERS">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                      PRIMARY HEADLINE
                    </label>
                    <input
                      type="text"
                      value={activeHeadline}
                      onChange={(e) => setActiveHeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-white font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[var(--dm-muted)] uppercase block mb-1">
                      BADGE TEXT
                    </label>
                    <input
                      type="text"
                      value={activeBadge}
                      onChange={(e) => setActiveBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--dm-border)] bg-black text-red-400 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </HoloPanel>

              {/* A/B Test Variations */}
              <HoloPanel title="A/B TESTING VARIANT MATRIX" subtitle="AI CONTRAST PREDICTIONS">
                <div className="space-y-2 text-xs">
                  {thumbConfig.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => handleSelectVariant(v)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-hover)]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase">
                            CTR: {v.predictedCtr} // CONTRAST: {v.contrastRating}
                          </span>
                          {isSelected && (
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-white">
                          "{v.titleText}"
                        </h4>
                        <span className="text-[10px] font-mono text-[var(--dm-muted)]">
                          Focal: {v.focalElement} // Palette: {v.colorScheme}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </HoloPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
