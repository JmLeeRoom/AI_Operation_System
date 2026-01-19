import { 
  Music,
  Plus,
  Search,
  Play,
  Pause,
  Filter,
  Tag,
  Clock,
  Disc,
  RefreshCw,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export function MusicDataset() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const clips = [
    { 
      id: 1, 
      name: 'ambient_001.wav', 
      genre: 'Ambient', 
      mood: 'Calm', 
      tempo: 80,
      key: 'C Major',
      duration: '32s',
      source: 'Licensed',
      quality: 'excellent'
    },
    { 
      id: 2, 
      name: 'electronic_042.wav', 
      genre: 'Electronic', 
      mood: 'Energetic', 
      tempo: 128,
      key: 'A Minor',
      duration: '45s',
      source: 'Internal',
      quality: 'good'
    },
    { 
      id: 3, 
      name: 'jazz_015.flac', 
      genre: 'Jazz', 
      mood: 'Relaxing', 
      tempo: 95,
      key: 'Bb Major',
      duration: '58s',
      source: 'Licensed',
      quality: 'excellent'
    },
    { 
      id: 4, 
      name: 'rock_088.wav', 
      genre: 'Rock', 
      mood: 'Aggressive', 
      tempo: 145,
      key: 'E Minor',
      duration: '41s',
      source: 'Internal',
      quality: 'good'
    },
    { 
      id: 5, 
      name: 'classical_005.flac', 
      genre: 'Classical', 
      mood: 'Dramatic', 
      tempo: 72,
      key: 'D Minor',
      duration: '120s',
      source: 'Public Domain',
      quality: 'excellent'
    },
  ];

  const stats = {
    genres: ['Ambient', 'Electronic', 'Jazz', 'Rock', 'Classical', 'Pop', 'Hip-Hop'],
    moods: ['Calm', 'Energetic', 'Relaxing', 'Aggressive', 'Dramatic', 'Happy', 'Sad'],
  };

  const getGenreBadge = (genre: string) => {
    const colors: Record<string, string> = {
      'Ambient': 'badge-cyan',
      'Electronic': 'badge-violet',
      'Jazz': 'badge-amber',
      'Rock': 'badge-rose',
      'Classical': 'badge-emerald',
      'Pop': 'badge-blue',
      'Hip-Hop': 'badge-slate',
    };
    return colors[genre] || 'badge-slate';
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      'Calm': 'text-cyan-400',
      'Energetic': 'text-amber-400',
      'Relaxing': 'text-emerald-400',
      'Aggressive': 'text-rose-400',
      'Dramatic': 'text-violet-400',
      'Happy': 'text-yellow-400',
      'Sad': 'text-blue-400',
    };
    return colors[mood] || 'text-slate-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            Music Dataset & Tags
          </h1>
          <p className="text-slate-400 mt-1">음악 클립 데이터 및 태그 관리</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Import Clips
        </button>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">45,000</p>
          <p className="text-sm text-slate-400">Total Clips</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-white">200h</p>
          <p className="text-sm text-slate-400">Total Duration</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-cyan-400">7</p>
          <p className="text-sm text-slate-400">Genres</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-violet-400">7</p>
          <p className="text-sm text-slate-400">Moods</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-amber-400">95%</p>
          <p className="text-sm text-slate-400">Tagged</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Filters */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-400" />
            Filters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {stats.genres.map((genre) => (
                  <button key={genre} className={`badge ${getGenreBadge(genre)} cursor-pointer hover:opacity-80`}>
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {stats.moods.map((mood) => (
                  <button key={mood} className="badge badge-slate cursor-pointer hover:opacity-80">
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Tempo (BPM)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="input-field py-2 text-sm" placeholder="Min" defaultValue={60} />
                <input type="number" className="input-field py-2 text-sm" placeholder="Max" defaultValue={180} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Duration (sec)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="input-field py-2 text-sm" placeholder="Min" defaultValue={10} />
                <input type="number" className="input-field py-2 text-sm" placeholder="Max" defaultValue={120} />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Source</label>
              <select className="input-field py-2 text-sm">
                <option>All Sources</option>
                <option>Licensed</option>
                <option>Internal</option>
                <option>Public Domain</option>
              </select>
            </div>

            <button className="btn-primary w-full">Apply Filters</button>
          </div>
        </div>

        {/* Clip List */}
        <div className="col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Music Clips</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="input-field pl-10 py-2 text-sm w-48"
              />
            </div>
          </div>

          <div className="space-y-3">
            {clips.map((clip) => (
              <div 
                key={clip.id}
                className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Play Button */}
                  <button 
                    className="btn-ghost p-2"
                    onClick={() => setIsPlaying(isPlaying === clip.id ? null : clip.id)}
                  >
                    {isPlaying === clip.id ? (
                      <Pause className="w-5 h-5 text-brand-400" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  {/* Waveform */}
                  <div className="w-32 h-10 bg-slate-700/50 rounded flex items-center px-2">
                    <div className="flex items-center gap-0.5 h-8 flex-1">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-0.5 rounded-full ${isPlaying === clip.id ? 'bg-brand-400' : 'bg-slate-500'}`}
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-200">{clip.name}</p>
                      <span className={`badge ${getGenreBadge(clip.genre)}`}>{clip.genre}</span>
                      <span className={`text-xs ${getMoodColor(clip.mood)}`}>{clip.mood}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Disc className="w-3 h-3" />
                        {clip.tempo} BPM
                      </span>
                      <span>{clip.key}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {clip.duration}
                      </span>
                      <span>{clip.source}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost text-sm py-1.5">
                      <Tag className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost text-sm py-1.5">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">Showing 5 of 45,000 clips</p>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-sm">← Prev</button>
              <span className="text-sm text-slate-400">1 / 9000</span>
              <button className="btn-ghost text-sm">Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="glass-card p-4 border-amber-500/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-sm text-slate-200">Copyright & Licensing Notice</p>
            <p className="text-xs text-slate-400">
              All music clips must have proper licensing documentation. Unlicensed content will be flagged for review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
