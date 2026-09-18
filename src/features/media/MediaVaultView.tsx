import React, { useState } from 'react';
import { useApp } from '../../core/AppContext';
import { useTheme } from '../../theme/ThemeContext';
import { GlowButton } from '../../components/common/GlowButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AssetCategory } from '../../types';
import { 
  Film, 
  Image as ImageIcon, 
  Mic, 
  Subtitles, 
  FileCode, 
  Play, 
  Pause,
  Download, 
  Upload,
  Music,
  Trash2,
  Plus
} from 'lucide-react';

export const MediaVaultView: React.FC = () => {
  const { currentProject, addNewAsset, deleteAsset, triggerToast, requestConfirmation } = useApp();
  const { playCockpitBeep } = useTheme();

  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);

  // Ingest form state
  const [ingestForm, setIngestForm] = useState({
    name: '',
    category: 'Images' as AssetCategory,
    fileSize: '4.2 MB',
    resolution: '3840x2160',
    duration: '00:15',
  });

  const filters: (AssetCategory | 'ALL')[] = [
    'ALL', 
    'Video', 
    'Images', 
    'Audio', 
    'Voice', 
    'Music', 
    'SFX', 
    'Captions', 
    'Thumbnails'
  ];

  const filteredAssets = activeCategory === 'ALL'
    ? currentProject.assets
    : currentProject.assets.filter((a) => a.category === activeCategory);

  const getAssetIcon = (category: AssetCategory) => {
    switch (category) {
      case 'Video': return <Film className="w-4 h-4 text-cyan-400" />;
      case 'Images':
      case 'Thumbnails': return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'Voice': return <Mic className="w-4 h-4 text-amber-400" />;
      case 'Music':
      case 'Audio':
      case 'SFX': return <Music className="w-4 h-4 text-purple-400" />;
      case 'Captions': return <Subtitles className="w-4 h-4 text-pink-400" />;
      default: return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleTogglePlay = (id: string) => {
    playCockpitBeep('pulse');
    setPlayingAudioId(playingAudioId === id ? null : id);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestForm.name.trim()) return;

    addNewAsset({
      name: ingestForm.name.trim(),
      category: ingestForm.category,
      fileSize: ingestForm.fileSize,
      resolution: ingestForm.category === 'Video' || ingestForm.category === 'Images' || ingestForm.category === 'Thumbnails' ? ingestForm.resolution : undefined,
      duration: ingestForm.category === 'Audio' || ingestForm.category === 'Voice' || ingestForm.category === 'Music' || ingestForm.category === 'Video' ? ingestForm.duration : undefined,
      status: 'Ready',
      url: '#',
    });

    setIngestForm({
      name: '',
      category: 'Images',
      fileSize: '4.2 MB',
      resolution: '3840x2160',
      duration: '00:15',
    });
    setIsIngesting(false);
  };

  const handleDeleteAsset = (id: string, name: string) => {
    requestConfirmation({
      title: 'PURGE MEDIA ASSET',
      message: `Erase media asset "${name}" from vault?`,
      isDanger: true,
      confirmLabel: 'PURGE ASSET',
      onConfirm: () => {
        deleteAsset(id);
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--dm-divider)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--dm-accent)] uppercase">
            <Film className="w-4 h-4" />
            <span>// QUANTUM ASSET VAULT</span>
          </div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[var(--dm-text)]">
            MEDIA LIBRARY & STEM REPOSITORY
          </h1>
          <p className="text-xs text-[var(--dm-text-secondary)] mt-0.5">
            Store 4K camera plates, isolated dialogue tracks, generative music stems, and sync files.
          </p>
        </div>

        <GlowButton
          variant="primary"
          size="sm"
          icon={isIngesting ? <Plus className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
          onClick={() => {
            playCockpitBeep('engage');
            setIsIngesting(!isIngesting);
          }}
        >
          {isIngesting ? 'CANCEL INGEST' : 'INGEST NEW ASSET'}
        </GlowButton>
      </div>

      {/* Ingest Form Drawer */}
      {isIngesting && (
        <form
          onSubmit={handleCreateAsset}
          className="p-4 rounded-xl border border-cyan-500/50 bg-slate-950/90 space-y-3"
        >
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
            INGEST ASSET INTO QUANTUM STORAGE VAULT
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">ASSET IDENTIFIER</label>
              <input
                type="text"
                required
                placeholder="e.g. event_horizon_plate_01.exr"
                value={ingestForm.name}
                onChange={(e) => setIngestForm({ ...ingestForm, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-black border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
              <select
                value={ingestForm.category}
                onChange={(e) => setIngestForm({ ...ingestForm, category: e.target.value as AssetCategory })}
                className="w-full px-3 py-1.5 rounded bg-black border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Images">Images</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Voice">Voice</option>
                <option value="Music">Music</option>
                <option value="SFX">SFX</option>
                <option value="Captions">Captions</option>
                <option value="Thumbnails">Thumbnails</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">FILE SIZE</label>
              <input
                type="text"
                value={ingestForm.fileSize}
                onChange={(e) => setIngestForm({ ...ingestForm, fileSize: e.target.value })}
                className="w-full px-3 py-1.5 rounded bg-black border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsIngesting(false)}
              className="px-3 py-1 text-xs font-mono text-slate-400"
            >
              CANCEL
            </button>
            <GlowButton type="submit" size="sm" variant="primary">
              COMMIT INGEST
            </GlowButton>
          </div>
        </form>
      )}

      {/* Asset Type Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="font-mono text-[10px] text-[var(--dm-muted)] uppercase shrink-0">
          FILTER TYPE:
        </span>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              playCockpitBeep('click');
              setActiveCategory(f);
            }}
            className={`px-3 py-1 text-xs font-display uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              activeCategory === f
                ? 'border-[var(--dm-accent)] bg-[var(--dm-accent-soft)] text-white font-semibold'
                : 'border-[var(--dm-border)] text-[var(--dm-text-secondary)] hover:text-white hover:bg-[var(--dm-surface-hover)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredAssets.map((asset) => {
          const isPlaying = playingAudioId === asset.id;

          return (
            <div
              key={asset.id}
              className="p-4 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-surface)] hover:bg-[var(--dm-surface-elevated)] hover:border-[var(--dm-border-bright)] transition-all flex flex-col justify-between select-none group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-[var(--dm-surface-elevated)] border border-[var(--dm-border)]">
                      {getAssetIcon(asset.category)}
                    </div>
                    <span className="font-mono text-[9px] uppercase text-[var(--dm-muted)]">
                      {asset.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={asset.status} size="sm" />
                    <button
                      onClick={() => handleDeleteAsset(asset.id, asset.name)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 rounded transition-opacity"
                      title="Purge Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-display text-sm font-bold text-[var(--dm-text)] truncate mt-1">
                  {asset.name}
                </h4>

                <div className="mt-2 text-[10px] font-mono text-[var(--dm-muted)] space-y-0.5">
                  <div className="flex justify-between">
                    <span>SIZE:</span>
                    <span className="text-slate-300">{asset.fileSize}</span>
                  </div>
                  {asset.duration && (
                    <div className="flex justify-between">
                      <span>DURATION:</span>
                      <span className="text-slate-300">{asset.duration}</span>
                    </div>
                  )}
                  {asset.resolution && (
                    <div className="flex justify-between">
                      <span>RESOLUTION:</span>
                      <span className="text-slate-300">{asset.resolution}</span>
                    </div>
                  )}
                </div>

                {/* Simulated Audio Waveform Bar */}
                {(asset.category === 'Audio' || asset.category === 'Voice' || asset.category === 'Music' || asset.category === 'SFX') && (
                  <div className="mt-3 p-2 rounded-lg bg-black border border-[var(--dm-border)] flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePlay(asset.id)}
                      className="p-1 rounded-full bg-[var(--dm-accent)] text-black hover:scale-105 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                    </button>
                    <div className="flex-1 flex items-center gap-0.5 h-4">
                      {[40, 70, 25, 90, 60, 30, 85, 45, 95, 20, 65, 80, 50, 35].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${isPlaying ? Math.max(20, (h * Math.random()) + 20) : h}%` }}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlaying ? 'bg-[var(--dm-accent)]' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--dm-divider)] mt-3 flex items-center justify-between text-xs">
                <span className="font-mono text-[9px] text-[var(--dm-muted)]">
                  READY FOR COMP
                </span>
                <button
                  onClick={() => {
                    playCockpitBeep('click');
                    triggerToast('info', 'DOWNLOAD INITIALIZED', `Preparing download for ${asset.name}`);
                  }}
                  className="p-1 rounded text-[var(--dm-muted)] hover:text-white cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
