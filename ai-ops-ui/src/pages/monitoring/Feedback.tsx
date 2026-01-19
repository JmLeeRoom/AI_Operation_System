import { 
  Search, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { cn } from '../../lib/utils';

const feedbackItems = [
  {
    id: '1',
    endpoint: 'cv-classifier-prod',
    type: 'positive',
    input: 'Image of a cat',
    prediction: 'cat (98.5%)',
    feedback: 'Correct classification',
    timestamp: '5 min ago',
    user: 'User_1234',
  },
  {
    id: '2',
    endpoint: 'llm-inference-prod',
    type: 'negative',
    input: 'How do I reset my password?',
    prediction: 'Please contact support for billing issues.',
    feedback: 'Wrong response - asked about password, got billing info',
    timestamp: '12 min ago',
    user: 'User_5678',
  },
  {
    id: '3',
    endpoint: 'cv-classifier-prod',
    type: 'negative',
    input: 'Image of a dog',
    prediction: 'cat (72.3%)',
    feedback: 'Misclassified as cat',
    timestamp: '1 hour ago',
    user: 'User_9012',
  },
];

const feedbackStats = [
  { endpoint: 'cv-classifier-prod', positive: 1245, negative: 23, rate: 98.2 },
  { endpoint: 'llm-inference-prod', positive: 892, negative: 156, rate: 85.1 },
  { endpoint: 'audio-transcriber-prod', positive: 2341, negative: 89, rate: 96.3 },
];

export function Feedback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">User Feedback</h1>
          <p className="text-sm text-muted-foreground mt-1">Track prediction feedback from users</p>
        </div>
        <Button variant="outline" leftIcon={<Download size={14} />}>Export Data</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Feedback', value: '4,746', icon: <MessageSquare size={16} />, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Positive', value: '4,478', icon: <ThumbsUp size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Negative', value: '268', icon: <ThumbsDown size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Avg Satisfaction', value: '94.3%', icon: <TrendingUp size={16} />, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg, stat.color)}>
                  {stat.icon}
                </div>
                <div>
                  <p className={cn('text-2xl font-semibold', stat.color)}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feedback by Endpoint */}
      <Card>
        <CardHeader title="Feedback by Endpoint" />
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Endpoint</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Positive</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Negative</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {feedbackStats.map((stat) => (
                <tr key={stat.endpoint} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{stat.endpoint}</td>
                  <td className="px-4 py-3 text-sm text-emerald-400">{stat.positive.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{stat.negative.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stat.rate}%` }} />
                      </div>
                      <span className={cn('text-sm font-medium', stat.rate >= 90 ? 'text-emerald-400' : 'text-amber-400')}>
                        {stat.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader title="Recent Feedback" action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-48 h-8 pl-9 pr-3 rounded-md bg-muted/50 border border-border text-xs focus:outline-none"
              />
            </div>
            <Button size="sm" variant="outline" leftIcon={<Filter size={12} />}>Filter</Button>
          </div>
        } />
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {feedbackItems.map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-muted/20">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-1.5 rounded',
                    item.type === 'positive' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  )}>
                    {item.type === 'positive' 
                      ? <ThumbsUp size={14} className="text-emerald-400" />
                      : <ThumbsDown size={14} className="text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{item.endpoint}</span>
                      <span className="text-xs text-muted-foreground">• {item.user}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      <span className="text-foreground">Input:</span> {item.input}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      <span className="text-foreground">Prediction:</span> {item.prediction}
                    </div>
                    <div className={cn(
                      'text-sm',
                      item.type === 'positive' ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {item.feedback}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
