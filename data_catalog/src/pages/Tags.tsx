import { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Table2,
  MoreVertical,
  Hash,
  Palette,
  ChevronDown,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

// 더미 데이터 - 태그 카테고리
const tagCategories = [
  { id: 'all', name: 'All Tags', count: 156 },
  { id: 'classification', name: 'Classification', count: 24 },
  { id: 'pii', name: 'PII/Sensitive', count: 18 },
  { id: 'domain', name: 'Domain', count: 32 },
  { id: 'status', name: 'Status', count: 12 },
  { id: 'quality', name: 'Quality', count: 28 },
  { id: 'custom', name: 'Custom', count: 42 },
];

// 더미 데이터 - 태그 목록
const tags = [
  {
    id: 1,
    name: 'PII',
    category: 'pii',
    color: 'rose',
    description: 'Contains personally identifiable information',
    usageCount: 245,
    tables: ['users', 'customers', 'employees'],
    createdBy: 'Data Governance Team',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Core',
    category: 'classification',
    color: 'cyan',
    description: 'Core business data that is critical for operations',
    usageCount: 189,
    tables: ['orders', 'products', 'inventory'],
    createdBy: 'Data Platform Team',
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    name: 'Revenue',
    category: 'domain',
    color: 'emerald',
    description: 'Revenue and financial metrics data',
    usageCount: 156,
    tables: ['transactions', 'invoices', 'subscriptions'],
    createdBy: 'Finance Team',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    name: 'Deprecated',
    category: 'status',
    color: 'amber',
    description: 'Marked for deprecation, do not use in new projects',
    usageCount: 34,
    tables: ['legacy_users', 'old_orders'],
    createdBy: 'Data Platform Team',
    createdAt: '2024-03-05',
  },
  {
    id: 5,
    name: 'Verified',
    category: 'quality',
    color: 'emerald',
    description: 'Data quality verified and approved',
    usageCount: 278,
    tables: ['users', 'orders', 'products'],
    createdBy: 'Data Quality Team',
    createdAt: '2024-01-20',
  },
  {
    id: 6,
    name: 'ML-Ready',
    category: 'custom',
    color: 'violet',
    description: 'Preprocessed and ready for machine learning',
    usageCount: 67,
    tables: ['feature_store', 'embeddings'],
    createdBy: 'ML Team',
    createdAt: '2024-02-15',
  },
  {
    id: 7,
    name: 'GDPR',
    category: 'pii',
    color: 'rose',
    description: 'Subject to GDPR compliance requirements',
    usageCount: 123,
    tables: ['eu_users', 'consent_logs'],
    createdBy: 'Legal Team',
    createdAt: '2024-01-25',
  },
  {
    id: 8,
    name: 'Real-time',
    category: 'classification',
    color: 'cyan',
    description: 'Real-time streaming data source',
    usageCount: 45,
    tables: ['events_stream', 'clickstream'],
    createdBy: 'Data Engineering Team',
    createdAt: '2024-02-28',
  },
];

// 더미 데이터 - 인기 태그
const popularTags = [
  { name: 'Core', count: 189, trend: '+12%' },
  { name: 'PII', count: 245, trend: '+8%' },
  { name: 'Verified', count: 278, trend: '+23%' },
  { name: 'Revenue', count: 156, trend: '+5%' },
];

const colorOptions = [
  { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
  { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500' },
  { name: 'Amber', value: 'amber', class: 'bg-amber-500' },
  { name: 'Rose', value: 'rose', class: 'bg-rose-500' },
  { name: 'Violet', value: 'violet', class: 'bg-violet-500' },
];

const Tags = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTags = tags.filter(tag => {
    const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tag.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout title="Tags" subtitle="Manage and organize your data with tags">
      <div className="space-y-6 animate-fade-in">
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-64"
              />
            </div>
            <button className="btn-ghost flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-slate-800/50 border border-slate-700/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Hash className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Table2 className="w-4 h-4" />
              </button>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Tag
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 카테고리 */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-1">
                {tagCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-brand-500/30 text-brand-300'
                        : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* 인기 태그 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Popular Tags</h3>
              </div>
              <div className="space-y-3">
                {popularTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{tag.count}</span>
                      <span className="text-xs text-emerald-400">{tag.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 색상 가이드 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold text-white">Color Guide</h3>
              </div>
              <div className="space-y-2">
                {colorOptions.map((color) => (
                  <div key={color.value} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${color.class}`} />
                    <span className="text-sm text-slate-400">{color.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 태그 목록 */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand-400" />
                  <h3 className="font-semibold text-white">
                    {selectedCategory === 'all' ? 'All Tags' : tagCategories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <span className="text-sm text-slate-500">({filteredTags.length})</span>
                </div>
                <button className="btn-ghost text-sm flex items-center gap-1">
                  Sort by <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant={tag.color as any}>{tag.name}</Badge>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/50 transition-all">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{tag.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Table2 className="w-3 h-3" />
                          <span>{tag.usageCount} tables</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{tag.createdAt}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          <span>{tag.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 rounded hover:bg-slate-700/50">
                            <Edit2 className="w-3 h-3 text-slate-400" />
                          </button>
                          <button className="p-1 rounded hover:bg-slate-700/50">
                            <Trash2 className="w-3 h-3 text-rose-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tag</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Description</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Usage</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Created</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTags.map((tag) => (
                        <tr key={tag.id} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <Badge variant={tag.color as any}>{tag.name}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-400 capitalize">{tag.category}</td>
                          <td className="py-3 px-4 text-sm text-slate-400 max-w-xs truncate">{tag.description}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">{tag.usageCount} tables</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{tag.createdAt}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1 rounded hover:bg-slate-700/50">
                                <Edit2 className="w-4 h-4 text-slate-400" />
                              </button>
                              <button className="p-1 rounded hover:bg-slate-700/50">
                                <Trash2 className="w-4 h-4 text-rose-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Tags;
