import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { HoloPanel } from '../../components/common/HoloPanel';
import { Script } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  FlipHorizontal, 
  Type, 
  Gauge, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';

interface ScriptTeleprompterModalProps {
  isOpen: boolean;
  script: Script;
  onClose: () => void;
}

export const ScriptTeleprompterModal: React.FC<ScriptTeleprompterModalProps> = ({
  isOpen,
  script,
  onClose,
}) => {
  const { playCockpitBeep } = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 - 5
  const [fontSize, setFontSize] = useState<number>(24); // px
  const [isMirrored, setIsMirrored] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const scrollLoop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed * 0.75;
      }
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  if (!isOpen) return null;

  const handleReset = () => {
    playCockpitBeep('click');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    playCockpitBeep('click');
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-slate-100 backdrop-blur-lg animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Teleprompter HUD Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              TELEPROMPTER HUD // {script.title}
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Sections: {script.sections.length} | Est: {script.settings.duration}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Mirror Toggle */}
            <button
              onClick={() => {
                playCockpitBeep('click');
                setIsMirrored(!isMirrored);
              }}
              className={`p-1.5 rounded border text-xs flex items-center gap-1 transition-colors ${
                isMirrored 
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300' 
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Mirror Display (Teleprompter Rig)"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">MIRROR</span>
            </button>

            {/* Font Size */}
            <div className="flex items-center border border-slate-800 bg-slate-900 rounded px-1.5 py-0.5">
              <Type className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <button
                onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                className="px-1 text-slate-400 hover:text-white"
              >
                -
              </button>
              <span className="px-1 text-cyan-300 font-bold">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(48, s + 2))}
                className="px-1 text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center border border-slate-800 bg-slate-900 rounded px-1.5 py-0.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <button
                onClick={() => setScrollSpeed((s) => Math.max(1, s - 1))}
                className="px-1 text-slate-400 hover:text-white"
              >
                -
              </button>
              <span className="px-1 text-cyan-300 font-bold">{scrollSpeed}x</span>
              <button
                onClick={() => setScrollSpeed((s) => Math.min(8, s + 1))}
                className="px-1 text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              title="Rewind to Top"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlaying ? 'PAUSE' : 'SCROLL'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Propmter Area */}
        <div 
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto px-6 py-12 scroll-smooth select-none ${
            isMirrored ? '-scale-x-100' : ''
          }`}
          style={{
            scrollbarWidth: 'none',
          }}
        >
          {/* Eyeline marker */}
          <div className="fixed top-1/2 left-4 right-4 pointer-events-none border-t border-dashed border-cyan-500/20 flex justify-between text-[9px] font-mono text-cyan-500/40">
            <span>READING FOCUS LINE</span>
            <span>EYELINE</span>
          </div>

          <div className="space-y-12 max-w-3xl mx-auto">
            {script.sections.map((section, idx) => (
              <div key={section.id || idx} className="space-y-4">
                <div className="border-b border-cyan-500/30 pb-1 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="font-bold">
                    [{idx + 1}] {section.name.toUpperCase()}
                  </span>
                  <span>{section.targetDuration || '1m 00s'}</span>
                </div>

                {section.visualDescription && (
                  <p className="font-mono text-xs text-indigo-300/80 bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/20 italic">
                    [VISUAL CUE]: {section.visualDescription}
                  </p>
                )}

                <p 
                  className="font-sans font-medium text-slate-100 leading-relaxed tracking-wide"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
                >
                  {section.narration || section.content}
                </p>
              </div>
            ))}
          </div>

          {/* End of broadcast marker */}
          <div className="pt-24 pb-48 text-center font-mono text-sm text-cyan-500/60 border-t border-slate-800 mt-12">
            /// TRANSMISSION TERMINATED // END OF SCRIPT ///
          </div>
        </div>
      </div>
    </div>
  );
};
