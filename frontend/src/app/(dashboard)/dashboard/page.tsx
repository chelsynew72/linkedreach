'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { DashboardStats, Campaign } from '@/types';
import { formatNumber } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  Megaphone, UserCheck, Send, MessageSquare, TrendingUp,
  ArrowUpRight, Activity, Zap, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_CHART = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  connections: Math.floor(Math.random() * 80 + 20),
  messages: Math.floor(Math.random() * 40 + 10),
  replies: Math.floor(Math.random() * 15 + 2),
}));

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/analytics/dashboard').then((r) => r.data),
  });

  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => api.get('/campaigns').then((r) => r.data),
  });

  const statCards = [
    {
      label: 'Connections Sent',
      value: formatNumber(stats?.totalConnectionsSent ?? 0),
      sub: `${stats?.acceptanceRate ?? 0}% acceptance rate`,
      icon: Send,
      color: 'var(--brand)',
    },
    {
      label: 'Messages Sent',
      value: formatNumber(stats?.totalMessages ?? 0),
      sub: `${stats?.replyRate ?? 0}% reply rate`,
      icon: MessageSquare,
      color: 'var(--green)',
    },
    {
      label: 'Active Campaigns',
      value: stats?.activeCampaigns ?? 0,
      sub: `${stats?.totalCampaigns ?? 0} total`,
      icon: Megaphone,
      color: 'var(--yellow)',
    },
    {
      label: 'LinkedIn Accounts',
      value: stats?.activeAccounts ?? 0,
      sub: `${stats?.totalAccounts ?? 0} connected`,
      icon: UserCheck,
      color: 'var(--blue)',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Good morning, {user?.name?.split(' ')[0]} 
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening with your outreach today.
          </p>
        </div>
        <Link href="/campaigns/new" className="btn-primary hidden sm:inline-flex">
          <Zap size={15} /> Start Campaign
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-5 hover:border-opacity-60 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, color }}>
                <Icon size={19} />
              </div>
              <span className="text-xs flex items-center gap-1" style={{ color: 'var(--green)' }}>
                <ArrowUpRight size={12} /> +12%
              </span>
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Campaigns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity chart */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Activity Overview</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 14 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {[
                { label: 'Connections', color: 'var(--brand)' },
                { label: 'Messages', color: 'var(--green)' },
                { label: 'Replies', color: 'var(--yellow)' },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_CHART}>
              <defs>
                {[
                  { id: 'conn', color: '#7c6af5' },
                  { id: 'msg', color: '#34d399' },
                  { id: 'rep', color: '#fbbf24' },
                ].map(({ id, color }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="connections" stroke="#7c6af5" fill="url(#conn)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="messages" stroke="#34d399" fill="url(#msg)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="replies" stroke="#fbbf24" fill="url(#rep)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Campaigns */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Campaigns</h2>
            <Link href="/campaigns" className="text-xs flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: 'var(--brand)' }}>
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {(campaigns || []).slice(0, 5).map((c) => (
              <Link key={c.id} href={`/campaigns/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-150 hover:opacity-80"
                style={{ background: 'var(--bg-elevated)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
                  <Megaphone size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.totalLeads} leads</p>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <div className="text-center py-8">
                <Activity size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No campaigns yet</p>
                <Link href="/campaigns/new" className="text-xs mt-1 block" style={{ color: 'var(--brand)' }}>
                  Create your first
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    active: { cls: 'badge-green', label: 'Active' },
    paused: { cls: 'badge-yellow', label: 'Paused' },
    draft: { cls: 'badge-gray', label: 'Draft' },
    completed: { cls: 'badge-blue', label: 'Done' },
    archived: { cls: 'badge-gray', label: 'Archived' },
  };
  const { cls, label } = map[status] || { cls: 'badge-gray', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
}
