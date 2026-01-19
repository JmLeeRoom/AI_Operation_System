import { 
  FileText,
  Plus,
  Save,
  Eye,
  RefreshCw,
  Settings,
  BookOpen,
  Languages,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export function TTSNormalization() {
  const [activeTab, setActiveTab] = useState<'rules' | 'g2p' | 'lexicon'>('rules');

  const normalizationRules = [
    { id: 1, pattern: '\\d+', replacement: 'number_to_words()', example: '123 → 백이십삼', enabled: true },
    { id: 2, pattern: '\\$\\d+', replacement: 'currency_to_words()', example: '$50 → 오십 달러', enabled: true },
    { id: 3, pattern: '\\d+%', replacement: 'percent_to_words()', example: '50% → 오십 퍼센트', enabled: true },
    { id: 4, pattern: '\\d{4}-\\d{2}-\\d{2}', replacement: 'date_to_words()', example: '2024-01-15 → 이천이십사년 일월 십오일', enabled: true },
    { id: 5, pattern: 'Dr\\.', replacement: '닥터', example: 'Dr. Kim → 닥터 김', enabled: false },
    { id: 6, pattern: 'e\\.g\\.', replacement: '예를 들어', example: 'e.g. → 예를 들어', enabled: true },
  ];

  const g2pExamples = [
    { text: '안녕하세요', phonemes: 'a n nj ʌ ŋ h a s e j o' },
    { text: '감사합니다', phonemes: 'k a m s a h a m n i t a' },
    { text: 'Hello', phonemes: 'h ɛ l oʊ' },
  ];

  const lexiconEntries = [
    { word: '테슬라', pronunciation: '테슬라', phoneme: 't e s ɯ l l a', language: 'ko' },
    { word: 'NVIDIA', pronunciation: '엔비디아', phoneme: 'e n b i d i a', language: 'en' },
    { word: '삼성', pronunciation: '삼성', phoneme: 's a m s ʌ ŋ', language: 'ko' },
    { word: 'iPhone', pronunciation: '아이폰', phoneme: 'a i p o n', language: 'en' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Text Normalization & G2P</h1>
          <p className="text-slate-400 mt-1">TTS 입력 텍스트 정규화 및 음소 변환</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* 탭 */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg w-fit">
        {[
          { key: 'rules', label: 'Normalization Rules', icon: Settings },
          { key: 'g2p', label: 'G2P Settings', icon: Languages },
          { key: 'lexicon', label: 'Lexicon', icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽: 설정 */}
        <div className="col-span-2">
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-400" />
                  Text Normalization Rules
                </h2>
                <button className="btn-ghost text-sm">
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-700/50">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pattern</th>
                      <th>Replacement</th>
                      <th>Example</th>
                      <th>Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizationRules.map((rule) => (
                      <tr key={rule.id} className="cursor-pointer">
                        <td className="font-mono text-cyan-400 text-sm">{rule.pattern}</td>
                        <td className="font-mono text-slate-300 text-sm">{rule.replacement}</td>
                        <td className="text-slate-400 text-sm">{rule.example}</td>
                        <td>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* G2P Tab */}
          {activeTab === 'g2p' && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-cyan-400" />
                Grapheme-to-Phoneme Settings
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">G2P Engine</label>
                    <select className="input-field">
                      <option>espeak-ng</option>
                      <option>phonemizer (neural)</option>
                      <option>g2pK (Korean)</option>
                      <option>Custom model</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Language</label>
                    <select className="input-field">
                      <option>Korean (ko)</option>
                      <option>English (en)</option>
                      <option>Multi-lingual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phoneme Set</label>
                  <select className="input-field">
                    <option>IPA (International Phonetic Alphabet)</option>
                    <option>ARPABET (CMU)</option>
                    <option>Custom phoneme set</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span className="text-slate-300">Preserve punctuation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-brand-500" />
                    <span className="text-slate-300">Use lexicon fallback</span>
                  </label>
                </div>

                {/* G2P Preview */}
                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">G2P Preview</h3>
                  <input 
                    type="text" 
                    className="input-field mb-3" 
                    placeholder="Enter text to convert..."
                    defaultValue="안녕하세요"
                  />
                  <div className="space-y-2">
                    {g2pExamples.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-2 bg-slate-800/50 rounded">
                        <span className="text-slate-200 w-32">{ex.text}</span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        <span className="text-cyan-400 font-mono text-sm">{ex.phonemes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lexicon Tab */}
          {activeTab === 'lexicon' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Pronunciation Lexicon
                </h2>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-sm">
                    Import CSV
                  </button>
                  <button className="btn-ghost text-sm">
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-700/50">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Word</th>
                      <th>Pronunciation</th>
                      <th>Phonemes</th>
                      <th>Lang</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lexiconEntries.map((entry, idx) => (
                      <tr key={idx} className="cursor-pointer">
                        <td className="font-medium text-slate-200">{entry.word}</td>
                        <td className="text-slate-300">{entry.pronunciation}</td>
                        <td className="font-mono text-cyan-400 text-sm">{entry.phoneme}</td>
                        <td>
                          <span className="badge badge-slate">{entry.language}</span>
                        </td>
                        <td>
                          <button className="btn-ghost text-sm py-1">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-slate-400">
                {lexiconEntries.length} entries • Last updated: 2 hours ago
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: Preview & Info */}
        <div className="space-y-6">
          {/* Live Preview */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-400" />
              Live Preview
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Input Text</label>
                <textarea 
                  className="input-field min-h-[80px] text-sm"
                  defaultValue="Dr. Kim의 연봉은 $120,000이며, 이는 전년 대비 15% 상승입니다."
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Normalized Text</label>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300">
                  닥터 김의 연봉은 십이만 달러이며, 이는 전년 대비 십오 퍼센트 상승입니다.
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Phonemes</label>
                <div className="p-3 bg-slate-800/50 rounded-lg text-xs text-cyan-400 font-mono">
                  t a k t ʌ k i m ɰ i j ʌ n b o ŋ ɯ n s i p i m a n t a l l ʌ i m j ʌ ...
                </div>
              </div>

              <button className="btn-primary w-full">
                <RefreshCw className="w-4 h-4" />
                Process
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Normalization Rules</span>
                <span className="text-white">{normalizationRules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Rules</span>
                <span className="text-emerald-400">{normalizationRules.filter(r => r.enabled).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lexicon Entries</span>
                <span className="text-white">{lexiconEntries.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
