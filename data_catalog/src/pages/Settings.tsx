import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Mail,
  Slack,
  Save,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Info
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

// 설정 메뉴 항목
const settingsMenu = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'connections', name: 'Connections', icon: Database },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'api', name: 'API Keys', icon: Key },
];

// 더미 데이터 - 연결된 데이터 소스
const connectedSources = [
  { name: 'Snowflake Production', type: 'snowflake', status: 'connected', lastSync: '5 min ago' },
  { name: 'BigQuery Analytics', type: 'bigquery', status: 'connected', lastSync: '10 min ago' },
  { name: 'PostgreSQL CRM', type: 'postgresql', status: 'error', lastSync: '2 hours ago' },
  { name: 'MySQL Legacy', type: 'mysql', status: 'disconnected', lastSync: 'Never' },
];

// 더미 데이터 - API 키
const apiKeys = [
  { name: 'Production API Key', prefix: 'dc_prod_***', created: '2024-01-15', lastUsed: '2 min ago', status: 'active' },
  { name: 'Development Key', prefix: 'dc_dev_***', created: '2024-02-20', lastUsed: '1 day ago', status: 'active' },
  { name: 'CI/CD Pipeline', prefix: 'dc_ci_***', created: '2024-03-01', lastUsed: '5 hours ago', status: 'active' },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    browser: false,
    schemaChanges: true,
    qualityAlerts: true,
    ownershipChanges: false,
    weeklyDigest: true,
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                  JL
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue="JaeMyeong"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Lee"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="jaemyeong.lee@company.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Team</label>
                    <select className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-brand-500 focus:outline-none">
                      <option>Data Platform</option>
                      <option>Analytics</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Role</label>
                    <input
                      type="text"
                      defaultValue="Data Engineer"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700/50 flex justify-end gap-3">
              <button className="btn-ghost">Cancel</button>
              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, email: !n.email }))}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-brand-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Slack className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">Slack Notifications</p>
                      <p className="text-sm text-slate-500">Get alerts in Slack</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, slack: !n.slack }))}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.slack ? 'bg-brand-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.slack ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-white">Browser Notifications</p>
                      <p className="text-sm text-slate-500">Push notifications in browser</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, browser: !n.browser }))}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications.browser ? 'bg-brand-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${notifications.browser ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Notification Types</h3>
              <div className="space-y-3">
                {[
                  { key: 'schemaChanges', label: 'Schema Changes', desc: 'When table schemas are modified' },
                  { key: 'qualityAlerts', label: 'Quality Alerts', desc: 'Data quality issues detected' },
                  { key: 'ownershipChanges', label: 'Ownership Changes', desc: 'When ownership is transferred' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of catalog activity' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))}
                      className={`w-10 h-5 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-slate-600'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'System' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as typeof theme)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === option.id
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${theme === option.id ? 'text-brand-400' : 'text-slate-400'}`} />
                    <p className={`text-sm font-medium ${theme === option.id ? 'text-brand-400' : 'text-slate-400'}`}>
                      {option.label}
                    </p>
                    {theme === option.id && (
                      <Check className="w-4 h-4 text-brand-400 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Display Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">Compact Mode</p>
                    <p className="text-xs text-slate-500">Reduce spacing and padding</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-slate-600">
                    <div className="w-4 h-4 rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">Show Table Previews</p>
                    <p className="text-xs text-slate-500">Preview data on hover</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-brand-500">
                    <div className="w-4 h-4 rounded-full bg-white translate-x-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">Animation Effects</p>
                    <p className="text-xs text-slate-500">Enable UI animations</p>
                  </div>
                  <button className="w-10 h-5 rounded-full bg-brand-500">
                    <div className="w-4 h-4 rounded-full bg-white translate-x-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Data Source Connections</h3>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Database className="w-4 h-4" />
                Add Connection
              </button>
            </div>
            <div className="space-y-3">
              {connectedSources.map((source, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        source.type === 'snowflake' ? 'bg-cyan-500/20' :
                        source.type === 'bigquery' ? 'bg-blue-500/20' :
                        source.type === 'postgresql' ? 'bg-indigo-500/20' :
                        'bg-orange-500/20'
                      }`}>
                        <Database className={`w-5 h-5 ${
                          source.type === 'snowflake' ? 'text-cyan-400' :
                          source.type === 'bigquery' ? 'text-blue-400' :
                          source.type === 'postgresql' ? 'text-indigo-400' :
                          'text-orange-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{source.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{source.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={
                          source.status === 'connected' ? 'emerald' :
                          source.status === 'error' ? 'rose' : 'slate'
                        }>
                          {source.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">Last sync: {source.lastSync}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-slate-700/50">
                          <RefreshCw className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50">
                          <SettingsIcon className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {source.status === 'error' && (
                    <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-sm text-rose-400">Connection failed: Authentication error</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge variant="emerald">Enabled</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-white">Password</p>
                        <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button className="btn-ghost text-sm">Change</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sessions</h3>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Active Sessions</p>
                    <p className="text-sm text-slate-500">You're logged in on 2 devices</p>
                  </div>
                  <button className="btn-ghost text-sm text-rose-400 hover:text-rose-300">
                    Sign out all devices
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium text-amber-400">Security Recommendation</p>
                <p className="text-sm text-amber-400/80 mt-1">
                  Consider enabling SSO for better security and easier access management.
                </p>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">API Keys</h3>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Key className="w-4 h-4" />
                Generate New Key
              </button>
            </div>

            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-400 mt-0.5" />
              <div>
                <p className="text-sm text-brand-400">
                  API keys allow programmatic access to the Data Catalog. Keep them secure and never share them publicly.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {apiKeys.map((key, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{key.name}</p>
                        <Badge variant={key.status === 'active' ? 'emerald' : 'slate'}>{key.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 font-mono mt-1">{key.prefix}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-slate-400">Created: {key.created}</p>
                        <p className="text-slate-500">Last used: {key.lastUsed}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-slate-700/50">
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-700/50 text-rose-400 hover:text-rose-300">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드 메뉴 */}
          <Card className="h-fit">
            <nav className="space-y-1">
              {settingsMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === item.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
            </nav>
          </Card>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <Card>
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
