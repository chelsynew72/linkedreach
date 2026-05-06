'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Campaign } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatNumber, timeAgo } from '@/lib/utils';
import {
  Plus, Megaphone, Play, Pause, Trash2, MoreHorizontal,
  Users, Send, MessageSquare, TrendingUp, Search, Filter,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CampaignsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => api.get('/campaigns').then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/campaigns/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaigns'] }); toast.success('Campaign updated'); },
    onError: () => toast.error('Failed to update campaign'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/campaigns/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaigns'] }); toast.success('Campaign deleted'); },
    onError: () => toast.error('Failed to delete campaign'),
  });

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const STATUS_FILTERS = ['all', 'active', 'paused', 'draft', 'completed'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Campaigns</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {campaigns.length} total · {campaigns.filter((c) => c.status === 'active').length} active
          </p>
        </div>
        <Link href="/campaigns/new" className="btn-primary">
          <Plus size={15} /> New Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input pl-9 py-2" placeholder="Search campaigns..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: filter === s ? 'var(--brand)' : 'transparent',
                color: filter === s ? 'white' : 'var(--text-secondary)',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-16 animate-pulse" style={{ background: 'var(--bg-surface)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Campaign', 'Status', 'Leads', 'Connections', 'Messages', 'Reply Rate', 'Created', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map((c) => (
                <CampaignRow key={c.id} campaign={c}
                  onToggle={() => statusMutation.mutate({
                    id: c.id,
                    status: c.status === 'active' ? 'paused' : 'active',
                  })}
                  onDelete={() => {
                    if (confirm('Delete this campaign?')) deleteMutation.mutate(c.id);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CampaignRow({ campaign: c, onToggle, onDelete }: {
  campaign: Campaign; onToggle: () => void; onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const replyRate = c.messagesSent > 0
    ? Math.round((c.repliesReceived / c.messagesSent) * 100)
    : 0;

  return (
    <tr className="transition-colors" style={{ background: 'transparent' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
      <td className="px-5 py-4">
        <Link href={`/campaigns/${c.id}`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
            <Megaphone size={15} />
          </div>
          <div>
            <p className="text-sm font-medium group-hover:underline" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
            {c.description && <p className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{c.description}</p>}
          </div>
        </Link>
      </td>
      <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatNumber(c.totalLeads)}</span>
      </td>
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatNumber(c.connectionsSent)}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {c.connectionsSent > 0 ? Math.round((c.connectionsAccepted / c.connectionsSent) * 100) : 0}% accepted
          </p>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatNumber(c.messagesSent)}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-[80px] h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full" style={{ width: `${replyRate}%`, background: 'var(--green)' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: replyRate > 20 ? 'var(--green)' : 'var(--text-primary)' }}>
            {replyRate}%
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{timeAgo(c.createdAt)}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}
            title={c.status === 'active' ? 'Pause' : 'Activate'}>
            {c.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <div ref={menuRef} className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-lg shadow-xl z-20 overflow-hidden"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <Link href={`/campaigns/${c.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-primary)' }}>
                  View Details
                </Link>
                <Link href={`/campaigns/${c.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-primary)' }}>
                  Edit
                </Link>
                <button onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--red)' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string; label: string }> = {
    active: { cls: 'badge-green', dot: 'var(--green)', label: 'Active' },
    paused: { cls: 'badge-yellow', dot: 'var(--yellow)', label: 'Paused' },
    draft: { cls: 'badge-gray', dot: 'var(--text-muted)', label: 'Draft' },
    completed: { cls: 'badge-blue', dot: 'var(--blue)', label: 'Completed' },
    archived: { cls: 'badge-gray', dot: 'var(--text-muted)', label: 'Archived' },
  };
  const { cls, dot, label } = map[status] || map.draft;
  return (
    <span className={`badge ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
        <Megaphone size={28} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No campaigns yet</h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        Create your first campaign to start automating LinkedIn outreach at scale.
      </p>
      <Link href="/campaigns/new" className="btn-primary">
        <Plus size={15} /> Create Campaign
      </Link>
    </div>
  );
}
