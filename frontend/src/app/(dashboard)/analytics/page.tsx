'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats, Campaign } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Send, MessageSquare, UserCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data),
  });

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => api.get('/campaigns').then((r) => r.data),
  });

  const { data: dailyStats = [], isLoading: dailyLoading } = useQuery
    { day: string; connections: number; messages: number; replies: number }[]
  >({
    queryKey: ['daily-stats'],
    queryFn: () => api.get('/analytics/daily-stats?days=30').then((r) => r.data),
  });

  const isLoading = statsLoading || campaignsLoading || dailyLoading;

  // Real campaign performance from actual data
  const campaignPerfData = campaigns
    .filter((c) => c.connectionsSent > 0)
    .slice(0, 6)
    .map((c) => ({
      name: c.name.length > 16 ? c.name.slice(0, 16) + '...' : c.name,
      sent: c.connectionsSent,
      accepted: c.connectionsAccepted,
      replied: c.repliesReceived,
    }));

  // Real acceptance rates
  const acceptanceData = campaigns
    .filter((c) => c.connectionsSent > 0)
    .slice(0, 8)
    .map((c) => ({
      name: c.name,
      rate: Math.round((c.connectionsAccepted / c.connectionsSent) * 100),
      accepted: c.connectionsAccepted,
      sent: c.connectionsSent,
    }));

  const hasDaily = dailyStats.some(d => d.connections > 0 || d.messages > 0 || d.replies > 0);
  const hasCampaignData = campaignPerfData.length > 0;

  const STAT_CARDS = [
    {
      label: 'Acceptance Rate',
      value: `${stats?.acceptanceRate ?? 0}%`,
      icon: UserCheck,
      color: '#f97316',
      sub: `${formatNumber(stats?.totalConnectionsAccepted ?? 0)} of ${formatNumber(stats?.totalConnectionsSent ?? 0)} accepted`,
    },
    {
      label: 'Reply Rate',
      value: `${stats?.replyRate ?? 0}%`,
      icon: TrendingUp,
      color: '#22c55e',
      sub: `${formatNumber(stats?.totalReplies ?? 0)} total replies`,
    },
    {
      label: 'Connections Sent',
      value: formatNumber(stats?.totalConnectionsSent ?? 0),
      icon: Send,
      color: '#3b82f6',
      sub: `Across ${stats?.totalCampaigns ?? 0} campaigns`,
    },
    {
      label: 'Messages Sent',
      value: formatNumber(stats?.totalMessages ?? 0),
      icon: MessageSquare,
      color: '#eab308',
      sub: 'All time total',
    },
  ];

  const TooltipStyle = {
    contentStyle: {
      background: '#111',
      border: '1px solid #222',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '12px',
    },
  };

  const EmptyState = ({ message, sub }: { message: string; sub: string }) => (
    <div className="flex flex-col items-center justify-center h-48 gap-2">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Real-time performance across {stats?.totalCampaigns ?? 0} campaigns
          and {stats?.totalAccounts ?? 0} accounts
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, color }}>
                <Icon size={19} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* 30-day trend — REAL DATA from activity logs */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>30-Day Trend</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Based on actual automation activity logs
            </p>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {[['Connections', '#f97316'], ['Messages', '#22c55e'], ['Replies', '#3b82f6']].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        {!hasDaily ? (
          <EmptyState
            message="No activity recorded yet"
            sub="Activity appears here as your automation runs"
          />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyStats}>
              <defs>
                {[['o', '#f97316'], ['g', '#22c55e'], ['b', '#3b82f6']].map(([id, color]) => (
                  <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#555', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TooltipStyle} />
              <Area type="monotone" dataKey="connections" stroke="#f97316" fill="url(#go)" strokeWidth={2} dot={false} name="Connections" />
              <Area type="monotone" dataKey="messages" stroke="#22c55e" fill="url(#gg)" strokeWidth={2} dot={false} name="Messages" />
              <Area type="monotone" dataKey="replies" stroke="#3b82f6" fill="url(#gb)" strokeWidth={2} dot={false} name="Replies" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Campaign Performance — REAL DATA */}
        <div className="card p-5">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Campaign Performance</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            Connections sent vs accepted vs replied per campaign
          </p>
          {!hasCampaignData ? (
            <EmptyState
              message="No campaign data yet"
              sub="Send connections to see performance here"
            />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campaignPerfData} layout="vertical">
                <XAxis type="number" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip {...TooltipStyle} />
                <Bar dataKey="sent" fill="rgba(249,115,22,0.15)" radius={[0, 4, 4, 0]} name="Sent" />
                <Bar dataKey="accepted" fill="#f97316" radius={[0, 4, 4, 0]} name="Accepted" />
                <Bar dataKey="replied" fill="#22c55e" radius={[0, 4, 4, 0]} name="Replied" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Acceptance Rate — REAL DATA */}
        <div className="card p-5">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Acceptance Rate by Campaign</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
            Percentage of connection requests accepted
          </p>
          {acceptanceData.length === 0 ? (
            <EmptyState
              message="No acceptance data yet"
              sub="Rates appear after connections are sent and accepted"
            />
          ) : (
            <div className="space-y-4">
              {acceptanceData.map(({ name, rate, accepted, sent }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                      {name}
                    </span>
                    <span style={{
                      color: rate >= 40 ? '#22c55e' : rate >= 20 ? '#f97316' : '#ef4444',
                      fontWeight: 600,
                    }}>
                      {rate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(rate, 100)}%`,
                        background: rate >= 40 ? '#22c55e' : rate >= 20 ? '#f97316' : '#ef4444',
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {accepted} accepted of {sent} sent
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full campaign table */}
      {campaigns.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>All Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Campaign', 'Status', 'Leads', 'Sent', 'Accepted', 'Messages', 'Replies', 'Reply Rate'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium whitespace-nowrap"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const replyRate = c.messagesSent > 0
                    ? Math.round((c.repliesReceived / c.messagesSent) * 100) : 0;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium truncate block max-w-[180px]"
                          style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`badge ${
                          c.status === 'active' ? 'badge-green' :
                          c.status === 'paused' ? 'badge-yellow' :
                          c.status === 'completed' ? 'badge-blue' : 'badge-gray'
                        } capitalize`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{c.totalLeads}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{c.connectionsSent}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{c.connectionsAccepted}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{c.messagesSent}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>{c.repliesReceived}</td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium" style={{
                          color: replyRate >= 20 ? '#22c55e' : replyRate >= 10 ? '#f97316' : 'var(--text-primary)'
                        }}>{replyRate}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
