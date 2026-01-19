import { useState } from 'react';
import { 
  Search as SearchIcon, 
  Filter,
  X,
  Table2,
  Database,
  Columns,
  Tag,
  Clock,
  ChevronDown,
  Check,
  Sparkles
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge, QualityBadge, TagList } from '../components/common/Badge';

// 더미 검색 결과 데이터
const searchResults = [
  {
    id: 1,
    type: 'table',
    name: 'users',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    platform: 'snowflake',
    description: 'Core user table containing all registered user information including profile data, preferences, and account status.',
    tags: ['PII', 'Core', 'Production'],
    quality: 95,
    columns: 12,
    lastUpdated: '2 hours ago',
    matchedOn: ['name', 'description'],
  },
  {
    id: 2,
    type: 'table',
    name: 'user_events',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    platform: 'snowflake',
    description: 'Event tracking table for all user interactions and behaviors in the platform.',
    tags: ['Events', 'Tracking'],
    quality: 88,
    columns: 24,
    lastUpdated: '30 min ago',
    matchedOn: ['name'],
  },
  {
    id: 3,
    type: 'table',
    name: 'user_sessions',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    platform: 'snowflake',
    description: 'Session data for user visits including session duration, pages viewed, and conversion events.',
    tags: ['Sessions', 'Analytics'],
    quality: 92,
    columns: 18,
    lastUpdated: '1 hour ago',
    matchedOn: ['name', 'description'],
  },
  {
    id: 4,
    type: 'column',
    name: 'user_id',
    parentTable: 'orders',
    catalog: 'commerce_dw',
    database: 'commerce_core',
    platform: 'bigquery',
    description: 'Foreign key reference to users table',
    dataType: 'VARCHAR(36)',
    tags: ['FK', 'PII'],
    matchedOn: ['name'],
  },
  {
    id: 5,
    type: 'table',
    name: 'user_preferences',
    catalog: 'crm_database',
    database: 'public',
    platform: 'postgresql',
    description: 'User preference settings including notification preferences, privacy settings, and UI customizations.',
    tags: ['Settings', 'PII'],
    quality: 78,
    columns: 8,
    lastUpdated: '5 hours ago',
    matchedOn: ['name', 'description'],
  },
  {
    id: 6,
    type: 'table',
    name: 'user_segments',
    catalog: 'analytics_prod',
    database: 'ANALYTICS',
    platform: 'snowflake',
    description: 'User segmentation data for marketing and product analytics purposes.',
    tags: ['Segments', 'Marketing'],
    quality: 85,
    columns: 6,
    lastUpdated: '3 hours ago',
    matchedOn: ['name'],
  },
];

const filterOptions = {
  type: ['All', 'Tables', 'Columns', 'Dashboards'],
  platform: ['All Platforms', 'Snowflake', 'BigQuery', 'PostgreSQL', 'Databricks'],
  tags: ['PII', 'Core', 'Production', 'Events', 'Analytics', 'Marketing'],
  quality: ['All Quality', '90%+', '70-89%', 'Below 70%'],
};

const recentSearches = [
  'user tables', 'order analytics', 'revenue metrics', 'customer segmentation'
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('user');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedType('All');
    setSelectedPlatform('All Platforms');
    setSelectedTags([]);
  };

  const hasFilters = selectedType !== 'All' || selectedPlatform !== 'All Platforms' || selectedTags.length > 0;

  return (
    <Layout title="Search" subtitle="Find tables, columns, and data assets">
      <div className="space-y-6 animate-fade-in">
        {/* 검색 헤더 */}
        <Card className="!p-4">
          <div className="flex items-center gap-4">
            {/* 검색 입력 */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables, columns, tags, or descriptions..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-lg"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AI 검색 버튼 */}
            <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl text-violet-400 hover:from-violet-500/30 hover:to-purple-500/30 transition-all">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Ask AI</span>
            </button>

            {/* 필터 토글 */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters 
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {hasFilters && (
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                  {(selectedType !== 'All' ? 1 : 0) + (selectedPlatform !== 'All Platforms' ? 1 : 0) + selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* 필터 패널 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-slide-down">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* 타입 필터 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Type:</span>
                    <div className="flex gap-1">
                      {filterOptions.type.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                            selectedType === type
                              ? 'bg-brand-500 text-white'
                              : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 플랫폼 필터 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Platform:</span>
                    <div className="relative">
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-brand-500"
                      >
                        {filterOptions.platform.map((platform) => (
                          <option key={platform} value={platform}>{platform}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {hasFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-300"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* 태그 필터 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-slate-500">Tags:</span>
                {filterOptions.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* 최근 검색 (검색어가 없을 때) */}
        {!searchQuery && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        {searchQuery && (
          <div className="space-y-4">
            {/* 결과 요약 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Found <span className="text-white font-semibold">{searchResults.length}</span> results for 
                <span className="text-brand-400 font-medium"> "{searchQuery}"</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="appearance-none pl-3 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-brand-500">
                  <option>Relevance</option>
                  <option>Recently Updated</option>
                  <option>Most Popular</option>
                  <option>Quality Score</option>
                </select>
              </div>
            </div>

            {/* 결과 리스트 */}
            <div className="space-y-3">
              {searchResults.map((result, idx) => (
                <Card 
                  key={result.id} 
                  hover 
                  className={`cursor-pointer group animate-slide-up delay-${(idx % 5 + 1) * 100}`}
                >
                  <div className="flex items-start gap-4">
                    {/* 아이콘 */}
                    <div className={`p-3 rounded-xl ${
                      result.type === 'table' 
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-violet-500/20 text-violet-400'
                    }`}>
                      {result.type === 'table' ? (
                        <Table2 className="w-6 h-6" />
                      ) : (
                        <Columns className="w-6 h-6" />
                      )}
                    </div>

                    {/* 컨텐츠 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
                          {result.name}
                        </h3>
                        <Badge variant={result.type === 'table' ? 'cyan' : 'violet'}>
                          {result.type}
                        </Badge>
                        <PlatformBadge platform={result.platform} />
                        {result.type === 'table' && result.quality && (
                          <QualityBadge score={result.quality} />
                        )}
                      </div>

                      {/* 경로 */}
                      <p className="text-sm text-slate-500 mb-2">
                        {result.type === 'column' ? (
                          <>
                            <span>{result.catalog}</span>
                            <span className="mx-1">·</span>
                            <span>{result.parentTable}</span>
                            <span className="mx-1">·</span>
                            <span className="text-slate-400">{result.dataType}</span>
                          </>
                        ) : (
                          <>
                            <span>{result.catalog}</span>
                            <span className="mx-1">/</span>
                            <span>{result.database}</span>
                          </>
                        )}
                      </p>

                      {/* 설명 - 하이라이트 */}
                      <p className="text-sm text-slate-400 mb-3">
                        {result.description?.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <mark key={i} className="bg-brand-500/30 text-brand-300 px-0.5 rounded">
                              {part}
                            </mark>
                          ) : (
                            part
                          )
                        )}
                      </p>

                      {/* 태그 & 메타 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {result.tags && (
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-4 h-4 text-slate-500" />
                              <TagList tags={result.tags} max={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          {result.type === 'table' && result.columns && (
                            <span className="flex items-center gap-1">
                              <Columns className="w-4 h-4" />
                              {result.columns} columns
                            </span>
                          )}
                          {result.lastUpdated && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {result.lastUpdated}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 매치된 필드 */}
                      {result.matchedOn && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <p className="text-xs text-slate-600">
                            Matched on: {result.matchedOn.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-50" disabled>
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === 1
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-slate-500">...</span>
              <button className="w-10 h-10 rounded-lg text-sm text-slate-400 hover:bg-slate-800">
                12
              </button>
              <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
