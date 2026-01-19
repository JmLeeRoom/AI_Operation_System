import { useState } from 'react';
import {
  Users,
  UserCircle,
  Building2,
  Search,
  Filter,
  Plus,
  Mail,
  Table2,
  Database,
  Shield,
  ChevronDown,
  MoreVertical,
  Star,
  ExternalLink,
  Clock
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge, PlatformBadge } from '../components/common/Badge';

// 더미 데이터 - 팀/그룹
const teams = [
  { id: 'all', name: 'All Owners', count: 48 },
  { id: 'data-platform', name: 'Data Platform', count: 8, color: 'bg-brand-500' },
  { id: 'analytics', name: 'Analytics', count: 12, color: 'bg-emerald-500' },
  { id: 'commerce', name: 'Commerce', count: 6, color: 'bg-amber-500' },
  { id: 'finance', name: 'Finance', count: 5, color: 'bg-violet-500' },
  { id: 'ml', name: 'ML Engineering', count: 7, color: 'bg-cyan-500' },
  { id: 'product', name: 'Product', count: 6, color: 'bg-rose-500' },
  { id: 'security', name: 'Security', count: 4, color: 'bg-slate-500' },
];

// 더미 데이터 - 오너 목록
const owners = [
  {
    id: 1,
    name: 'Alice Kim',
    email: 'alice.kim@company.com',
    team: 'Data Platform',
    teamId: 'data-platform',
    role: 'Lead Engineer',
    avatar: 'AK',
    tablesOwned: 45,
    catalogsOwned: 3,
    recentActivity: '2 hours ago',
    status: 'active',
    topTables: ['users', 'events', 'sessions'],
  },
  {
    id: 2,
    name: 'Bob Park',
    email: 'bob.park@company.com',
    team: 'Analytics',
    teamId: 'analytics',
    role: 'Senior Analyst',
    avatar: 'BP',
    tablesOwned: 32,
    catalogsOwned: 2,
    recentActivity: '30 min ago',
    status: 'active',
    topTables: ['daily_metrics', 'user_cohorts'],
  },
  {
    id: 3,
    name: 'Charlie Lee',
    email: 'charlie.lee@company.com',
    team: 'Commerce',
    teamId: 'commerce',
    role: 'Data Engineer',
    avatar: 'CL',
    tablesOwned: 28,
    catalogsOwned: 2,
    recentActivity: '1 day ago',
    status: 'active',
    topTables: ['orders', 'products', 'inventory'],
  },
  {
    id: 4,
    name: 'Diana Choi',
    email: 'diana.choi@company.com',
    team: 'Finance',
    teamId: 'finance',
    role: 'Finance Analyst',
    avatar: 'DC',
    tablesOwned: 18,
    catalogsOwned: 1,
    recentActivity: '3 hours ago',
    status: 'active',
    topTables: ['transactions', 'invoices'],
  },
  {
    id: 5,
    name: 'Eric Jung',
    email: 'eric.jung@company.com',
    team: 'ML Engineering',
    teamId: 'ml',
    role: 'ML Engineer',
    avatar: 'EJ',
    tablesOwned: 24,
    catalogsOwned: 2,
    recentActivity: '5 hours ago',
    status: 'active',
    topTables: ['feature_store', 'embeddings', 'predictions'],
  },
  {
    id: 6,
    name: 'Fiona Han',
    email: 'fiona.han@company.com',
    team: 'Product',
    teamId: 'product',
    role: 'Product Manager',
    avatar: 'FH',
    tablesOwned: 12,
    catalogsOwned: 1,
    recentActivity: '1 week ago',
    status: 'inactive',
    topTables: ['ab_tests', 'experiments'],
  },
  {
    id: 7,
    name: 'George Yoon',
    email: 'george.yoon@company.com',
    team: 'Security',
    teamId: 'security',
    role: 'Security Engineer',
    avatar: 'GY',
    tablesOwned: 15,
    catalogsOwned: 1,
    recentActivity: '4 hours ago',
    status: 'active',
    topTables: ['audit_logs', 'access_controls'],
  },
  {
    id: 8,
    name: 'Hannah Shin',
    email: 'hannah.shin@company.com',
    team: 'Data Platform',
    teamId: 'data-platform',
    role: 'Staff Engineer',
    avatar: 'HS',
    tablesOwned: 56,
    catalogsOwned: 5,
    recentActivity: '1 hour ago',
    status: 'active',
    topTables: ['raw_events', 'dim_users', 'fact_orders'],
  },
];

// 더미 데이터 - 통계
const ownershipStats = [
  { label: 'Total Owners', value: '48', icon: Users },
  { label: 'Active Teams', value: '12', icon: Building2 },
  { label: 'Tables Assigned', value: '1,156', icon: Table2 },
  { label: 'Avg Tables/Owner', value: '24', icon: Database },
];

// 더미 데이터 - Top Contributors
const topContributors = [
  { name: 'Hannah Shin', tables: 56, changes: 234 },
  { name: 'Alice Kim', tables: 45, changes: 189 },
  { name: 'Bob Park', tables: 32, changes: 156 },
  { name: 'Charlie Lee', tables: 28, changes: 98 },
];

const Owners = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredOwners = owners.filter(owner => {
    const matchesTeam = selectedTeam === 'all' || owner.teamId === selectedTeam;
    const matchesSearch = owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          owner.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const getTeamColor = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.color || 'bg-slate-500';
  };

  return (
    <Layout title="Owners" subtitle="Manage data ownership and responsibilities">
      <div className="space-y-6 animate-fade-in">
        {/* 상단 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ownershipStats.map((stat, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <stat.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search owners..."
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
                <Users className="w-4 h-4" />
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
              Add Owner
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 - 팀 필터 */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-white mb-4">Teams</h3>
              <div className="space-y-1">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTeam === team.id
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {team.color && (
                        <div className={`w-2 h-2 rounded-full ${team.color}`} />
                      )}
                      <span>{team.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedTeam === team.id
                        ? 'bg-brand-500/30 text-brand-300'
                        : 'bg-slate-700/50 text-slate-500'
                    }`}>
                      {team.count}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Top Contributors */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {topContributors.map((contributor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-medium">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{contributor.name}</p>
                        <p className="text-xs text-slate-500">{contributor.tables} tables</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400">+{contributor.changes}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 오너 목록 */}
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-400" />
                  <h3 className="font-semibold text-white">
                    {selectedTeam === 'all' ? 'All Owners' : teams.find(t => t.id === selectedTeam)?.name}
                  </h3>
                  <span className="text-sm text-slate-500">({filteredOwners.length})</span>
                </div>
                <button className="btn-ghost text-sm flex items-center gap-1">
                  Sort by <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredOwners.map((owner) => (
                    <div
                      key={owner.id}
                      className="p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${getTeamColor(owner.teamId)} bg-opacity-20 flex items-center justify-center text-white font-semibold`}>
                            {owner.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{owner.name}</p>
                            <p className="text-xs text-slate-500">{owner.role}</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/50 transition-all">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="cyan">{owner.team}</Badge>
                        <div className={`w-2 h-2 rounded-full ${owner.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-slate-800/50">
                          <p className="text-lg font-bold text-white">{owner.tablesOwned}</p>
                          <p className="text-xs text-slate-500">Tables</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/50">
                          <p className="text-lg font-bold text-white">{owner.catalogsOwned}</p>
                          <p className="text-xs text-slate-500">Catalogs</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>Active {owner.recentActivity}</span>
                      </div>

                      <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{owner.email}</span>
                        </div>
                        <button className="p-1 rounded hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3 text-brand-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Owner</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Team</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Tables</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Catalogs</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Last Active</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOwners.map((owner) => (
                        <tr key={owner.id} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${getTeamColor(owner.teamId)} bg-opacity-20 flex items-center justify-center text-white text-xs font-medium`}>
                                {owner.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{owner.name}</p>
                                <p className="text-xs text-slate-500">{owner.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="cyan">{owner.team}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-400">{owner.role}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">{owner.tablesOwned}</td>
                          <td className="py-3 px-4 text-sm text-slate-300">{owner.catalogsOwned}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${owner.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              <span className={`text-sm ${owner.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {owner.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">{owner.recentActivity}</td>
                          <td className="py-3 px-4 text-right">
                            <button className="p-1 rounded hover:bg-slate-700/50">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>
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

export default Owners;
