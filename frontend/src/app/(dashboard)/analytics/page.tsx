'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats, Campaign } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, Send, MessageSquare, Users, UserCheck } from 'lucide-react';

const MOCK_TREND = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  connections: Math.floor(Math.random() * 60 + 10),
  messages: Math.floor(Math.random() * 30 + 5),
  replies: Math.floor(Math.random() * 10 + 1),
}));

const MOCK_CAMPAIGN_PERF = [
  { name: 'SaaS Founders', sent: 240, accepted: 98, replied: 34 },
  { name: 'VC Network', sent: 180, accepted: 72, replied: 28 },
  { name: 'HR Leaders', sent: 320, accepted: 110, replied: 42 },
  { name: 'CTOs Q4', sent: 150, accepted: 65, replied: 19 },
  { name: 'Startup CEOs', sent: 95, accepted: 38, replied: 12 },
];

export default function AnalyticsPage() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data),
  });

  const STAT_CARDS = [
    { label: 'Connection Acceptance Rate', value: `${stats?.acceptanceRate ?? 0}%`, icon: UserCheck, color: 'var(--brand)', sub: `${formatNumber(stats?.totalConnectionsAccepted ?? 0)} accepted` },
    { label: 'Reply Rate', value: `${stats?.replyRate ?? 0}%`, icon: TrendingUp, color: 'var(--green)', sub: `${formatNumber(stats?.totalReplies ?? 0)} replies` },
    { label: 'Total Connections Sent', value: formatNumber(stats?.totalConnectionsSent ?? 0), icon: Send, color: 'var(--blue)', sub: 'All time' },
    { label: 'Total Messages Sent', value: formatNumber(stats?.totalMessages ?? 0), icon: MessageSquare, color: 'var(--yellow)', sub: 'All time' },
  ];

  const TooltipStyle = {
    contentStyle: {
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      color: 'var(--text-primary)',
      fontSize: '12px',
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Track performance across all campaigns</p>
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

      {/* 30 day trend */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>30-Day Trend</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Daily activity breakdown</p>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {[['Connections', '#7c6af5'], ['Messages', '#34d399'], ['Replies', '#fbbf24']].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MOCK_TREND}>
            <defs>
              {[['c', '#7c6af5'], ['m', '#34d399'], ['r', '#fbbf24']].map(([id, color]) => (
                <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...TooltipStyle} />
            <Area type="monotone" dataKey="connections" stroke="#7c6af5" fill="url(#gc)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="messages" stroke="#34d399" fill="url(#gm)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="replies" stroke="#fbbf24" fill="url(#gr)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Campaign Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_CAMPAIGN_PERF} layout="vertical">
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...TooltipStyle} />
              <Bar dataKey="sent" fill="#7c6af518" radius={[0, 4, 4, 0]} />
              <Bar dataKey="accepted" fill="#7c6af5" radius={[0, 4, 4, 0]} />
              <Bar dataKey="replied" fill="#34d399" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Acceptance Rate by Campaign</h2>
          <div className="space-y-4">
            {MOCK_CAMPAIGN_PERF.map((c) => {
              const rate = Math.round((c.accepted / c.sent) * 100);
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                    <span style={{ color: rate >= 40 ? 'var(--green)' : 'var(--text-primary)' }}>{rate}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${rate}%`, background: rate >= 40 ? 'var(--green)' : 'var(--brand)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
