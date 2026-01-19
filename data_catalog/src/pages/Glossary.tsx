import { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Link2,
  FileText,
  Tag,
  Clock,
  Users,
  ExternalLink,
  BookMarked,
  Hash
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

// 더미 데이터 - 카테고리
const categories = [
  { id: 'all', name: 'All Terms', count: 89 },
  { id: 'metrics', name: 'Metrics', count: 24 },
  { id: 'dimensions', name: 'Dimensions', count: 18 },
  { id: 'entities', name: 'Entities', count: 15 },
  { id: 'business', name: 'Business Terms', count: 22 },
  { id: 'technical', name: 'Technical Terms', count: 10 },
];

// 더미 데이터 - 알파벳 인덱스
const alphabetIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// 더미 데이터 - 용어집
const glossaryTerms = [
  {
    id: 1,
    term: 'Active User',
    abbreviation: 'AU',
    category: 'metrics',
    definition: 'A user who has performed at least one meaningful action within the specified time period (daily, weekly, monthly).',
    relatedTerms: ['DAU', 'MAU', 'WAU', 'Engagement'],
    linkedTables: ['users', 'user_sessions', 'daily_active_users'],
    owner: 'Product Analytics',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    status: 'approved',
  },
  {
    id: 2,
    term: 'Conversion Rate',
    abbreviation: 'CVR',
    category: 'metrics',
    definition: 'The percentage of users who complete a desired action out of the total number of users who had the opportunity to complete that action.',
    relatedTerms: ['Funnel', 'Click-through Rate', 'Retention'],
    linkedTables: ['conversions', 'funnel_events'],
    owner: 'Growth Team',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-15',
    status: 'approved',
  },
  {
    id: 3,
    term: 'Customer',
    abbreviation: null,
    category: 'entities',
    definition: 'An individual or organization that has completed at least one purchase or transaction with the company.',
    relatedTerms: ['User', 'Account', 'Lead'],
    linkedTables: ['customers', 'accounts', 'orders'],
    owner: 'Data Governance',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    status: 'approved',
  },
  {
    id: 4,
    term: 'DAU',
    abbreviation: null,
    category: 'metrics',
    definition: 'Daily Active Users - The count of unique users who engage with the product on a given day.',
    relatedTerms: ['Active User', 'MAU', 'WAU'],
    linkedTables: ['daily_active_users', 'user_metrics'],
    owner: 'Product Analytics',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    status: 'approved',
  },
  {
    id: 5,
    term: 'GMV',
    abbreviation: 'Gross Merchandise Value',
    category: 'metrics',
    definition: 'The total value of merchandise sold through the marketplace over a given period, before deducting fees and returns.',
    relatedTerms: ['Revenue', 'Net Revenue', 'AOV'],
    linkedTables: ['orders', 'transactions', 'gmv_daily'],
    owner: 'Finance Team',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-28',
    status: 'approved',
  },
  {
    id: 6,
    term: 'Lead',
    abbreviation: null,
    category: 'entities',
    definition: 'A potential customer who has shown interest in the company\'s products or services but has not yet made a purchase.',
    relatedTerms: ['Customer', 'Prospect', 'MQL', 'SQL'],
    linkedTables: ['leads', 'marketing_qualified_leads'],
    owner: 'Sales Operations',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-10',
    status: 'approved',
  },
  {
    id: 7,
    term: 'LTV',
    abbreviation: 'Lifetime Value',
    category: 'metrics',
    definition: 'The predicted net profit attributed to the entire future relationship with a customer.',
    relatedTerms: ['CAC', 'Retention', 'Churn'],
    linkedTables: ['customer_ltv', 'cohort_analysis'],
    owner: 'Finance Team',
    createdAt: '2024-02-05',
    updatedAt: '2024-03-15',
    status: 'approved',
  },
  {
    id: 8,
    term: 'Churn Rate',
    abbreviation: null,
    category: 'metrics',
    definition: 'The percentage of customers who stop using a product or service during a given time period.',
    relatedTerms: ['Retention', 'LTV', 'MRR'],
    linkedTables: ['churn_events', 'subscription_status'],
    owner: 'Customer Success',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
    status: 'draft',
  },
];

// 더미 데이터 - 최근 업데이트
const recentUpdates = [
  { term: 'Active User', action: 'Updated', time: '2 hours ago' },
  { term: 'Churn Rate', action: 'Created', time: '1 day ago' },
  { term: 'LTV', action: 'Updated', time: '2 days ago' },
  { term: 'GMV', action: 'Approved', time: '3 days ago' },
];

const Glossary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = !selectedLetter || term.term.charAt(0).toUpperCase() === selectedLetter;
    return matchesCategory && matchesSearch && matchesLetter;
  });

  return (
    <Layout title="Glossary" subtitle="Business terms and definitions for data literacy">
      <div className="space-y-6 animate-fade-in">
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search terms..."
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
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Term
          </button>
        </div>

        {/* 알파벳 인덱스 */}
        <Card className="p-3">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedLetter === null
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              All
            </button>
            {alphabetIndex.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? 'bg-brand-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </Card>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 카테고리 */}
            <Card>
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
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

            {/* 최근 업데이트 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">Recent Updates</h3>
              </div>
              <div className="space-y-3">
                {recentUpdates.map((update, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-colors">
                    <div>
                      <p className="text-sm font-medium text-white">{update.term}</p>
                      <p className="text-xs text-slate-500">{update.action}</p>
                    </div>
                    <span className="text-xs text-slate-500">{update.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 통계 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-white">Statistics</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Terms</span>
                  <span className="text-sm font-medium text-white">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Approved</span>
                  <span className="text-sm font-medium text-emerald-400">82</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Draft</span>
                  <span className="text-sm font-medium text-amber-400">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Linked Tables</span>
                  <span className="text-sm font-medium text-white">234</span>
                </div>
              </div>
            </Card>
          </div>

          {/* 용어 목록 */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-400" />
                  <h3 className="font-semibold text-white">
                    {selectedCategory === 'all' ? 'All Terms' : categories.find(c => c.id === selectedCategory)?.name}
                    {selectedLetter && ` - ${selectedLetter}`}
                  </h3>
                  <span className="text-sm text-slate-500">({filteredTerms.length})</span>
                </div>
                <button className="btn-ghost text-sm flex items-center gap-1">
                  Sort by <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredTerms.map((term) => (
                  <div
                    key={term.id}
                    className="rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 transition-all duration-200 overflow-hidden"
                  >
                    {/* 헤더 */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button className="mt-1">
                            {expandedTerm === term.id ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-lg font-semibold text-white">{term.term}</h4>
                              {term.abbreviation && (
                                <span className="text-sm text-slate-500">({term.abbreviation})</span>
                              )}
                              <Badge variant={term.status === 'approved' ? 'emerald' : 'amber'}>
                                {term.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                              {term.definition}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 rounded hover:bg-slate-700/50">
                            <Edit2 className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1 rounded hover:bg-slate-700/50">
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 확장 내용 */}
                    {expandedTerm === term.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 mt-0">
                        <div className="pt-4 space-y-4">
                          {/* 전체 정의 */}
                          <div>
                            <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Full Definition
                            </h5>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              {term.definition}
                            </p>
                          </div>

                          {/* 관련 용어 */}
                          <div>
                            <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                              <Link2 className="w-4 h-4" />
                              Related Terms
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {term.relatedTerms.map((related) => (
                                <span
                                  key={related}
                                  className="px-2 py-1 rounded-lg bg-slate-700/50 text-xs text-slate-300 hover:bg-slate-700 cursor-pointer transition-colors"
                                >
                                  {related}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 연결된 테이블 */}
                          <div>
                            <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              Linked Tables
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {term.linkedTables.map((table) => (
                                <span
                                  key={table}
                                  className="px-2 py-1 rounded-lg bg-brand-500/20 text-xs text-brand-300 hover:bg-brand-500/30 cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  {table}
                                  <ExternalLink className="w-3 h-3" />
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 메타 정보 */}
                          <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {term.owner}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created {term.createdAt}
                              </span>
                            </div>
                            <span>Last updated {term.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Glossary;
