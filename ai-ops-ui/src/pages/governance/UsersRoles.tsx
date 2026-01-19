import { 
  Plus, 
  Search, 
  Filter,
  User,
  Shield,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const users = [
  { id: '1', name: 'JaeMyeong Lee', email: 'jaemyeong@company.com', role: 'Admin', lastActive: '2 min ago', status: 'active' },
  { id: '2', name: 'Alice Kim', email: 'alice@company.com', role: 'MLEngineer', lastActive: '1 hour ago', status: 'active' },
  { id: '3', name: 'Bob Park', email: 'bob@company.com', role: 'DataScientist', lastActive: '3 hours ago', status: 'active' },
  { id: '4', name: 'Charlie Choi', email: 'charlie@company.com', role: 'Viewer', lastActive: '2 days ago', status: 'inactive' },
];

const roles = [
  { name: 'Admin', count: 2, permissions: ['All'] },
  { name: 'MLEngineer', count: 5, permissions: ['pipelines:*', 'runs:*', 'models:*', 'deployments:*'] },
  { name: 'DataScientist', count: 8, permissions: ['experiments:*', 'data:read', 'models:read'] },
  { name: 'Viewer', count: 12, permissions: ['*:read'] },
];

const roleColors: Record<string, string> = {
  Admin: 'bg-red-500/10 text-red-400',
  MLEngineer: 'bg-blue-500/10 text-blue-400',
  DataScientist: 'bg-violet-500/10 text-violet-400',
  Viewer: 'bg-zinc-500/10 text-zinc-400',
};

export function UsersRoles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Users & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage access control</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Shield size={14} />}>Manage Roles</Button>
          <Button leftIcon={<Plus size={14} />}>Invite User</Button>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={cn('px-2 py-0.5 text-xs font-medium rounded', roleColors[role.name])}>
                  {role.name}
                </span>
                <span className="text-lg font-semibold text-foreground">{role.count}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{role.permissions.join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full h-9 pl-9 pr-4 rounded-md bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>Role</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded', roleColors[user.role])}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded',
                      user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-500/10 text-zinc-400'
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit size={12} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:text-red-400">
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
