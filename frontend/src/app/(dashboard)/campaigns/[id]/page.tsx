'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Campaign, Lead } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatNumber, timeAgo } from '@/lib/utils';
import {
  ArrowLeft, Play, Pause, Trash2, Upload, Users,
  Send, MessageSquare, TrendingUp, Clock, RefreshCw,
  UserPlus, Eye, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import { useState, useRef } from 'react';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'leads' | 'sequence'>('overview');
  const [leadsPage, setLeadsPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: campaign, isLoading } = useQuery<Campaign>({
    queryKey: ['campaign', id],
    queryFn: () => api.get(`/campaigns/${id}`).then((r) => r.data),
  });

  const { data: leadsData } = useQuery({
    queryKey: ['leads', id, leadsPage],
    queryFn: () => api.get(`/campaigns/${id}/leads?page=${leadsPage}&limit=20`).then((r) => r.data),
    enabled: tab === 'leads',
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.patch(`/campaigns/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaign', id] }); toast.success('Status updated'); },
  });

  const startMutation = useMutation({
    mutationFn: () => api.post(`/automation/campaigns/${id}/start`),
    onSuccess: () => toast.success('Campaign jobs queued!'),
    onError: () => toast.error('Failed to start automation'),
  });

  const importMutation = useMutation({
    mutationFn: (leads: any[]) => api.post(`/campaigns/${id}/leads/import`, { leads }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['leads', id] });
      qc.invalidateQueries({ queryKey: ['campaign', id] });
      toast.success(`Imported ${res.data.length} leads`);
    },
    onError: () => toast.error('Import failed'),
  });

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const leads = lines.slice(1).map((line) => {
        const vals = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = vals[i]?.trim() || ''; });
        return {
          linkedinProfileUrl: obj.linkedin_url || obj.url || obj.profile_url || '',
          firstName: obj.first_name || obj.firstname || '',
          lastName: obj.last_name || obj.lastname || '',
          fullName: obj.full_name || obj.name || '',
          company: obj.company || '',
          headline: obj.headline || '',
          email: obj.email || '',
        };
      }).filter((l) => l.linkedinProfileUrl);
      if (leads.length === 0) { toast.error('No valid leads found. Make sure CSV has a linkedin_url column.'); return; }
      importMutation.mutate(leads);
    };
    reader.readAsText(file);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!campaign) return <div>Campaign not found</div>;

  const acceptanceRate = campaign.connectionsSent > 0
    ? Math.round((campaign.connectionsAccepted / campaign.connectionsSent) * 100) : 0;
  const replyRate = campaign.messagesSent > 0
    ? Math.round((campaign.repliesReceived / campaign.messagesSent) * 100) : 0;

  const STATS = [
    { label: 'Total Leads', value: formatNumber(campaign.totalLeads), icon: Users, color: 'var(--brand)' },
    { label: 'Connections Sent', value: formatNumber(campaign.connectionsSent), sub: `${acceptanceRate}% accepted`, icon: Send, color: 'var(--green)' },
    { label: 'Messages Sent', value: formatNumber(campaign.messagesSent), icon: MessageSquare, color: 'var(--blue)' },
    { label: 'Reply Rate', value: `${replyRate}%`, sub: `${campaign.repliesReceived} replies`, icon: TrendingUp, color: 'var(--yellow)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/campaigns" className="p-2 rounded-lg"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{campaign.name}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            {campaign.description && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{campaign.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
          <button onClick={() => fileRef.current?.click()}
            className="btn-secondary text-sm py-2" disabled={importMutation.isPending}>
            <Upload size={14} /> {importMutation.isPending ? 'Importing...' : 'Import Leads'}
          </button>
          {campaign.status === 'active' ? (
            <button onClick={() => statusMutation.mutate('paused')} className="btn-secondary text-sm py-2">
              <Pause size={14} /> Pause
            </button>
          ) : (
            <button onClick={() => { statusMutation.mutate('active'); startMutation.mutate(); }}
              className="btn-primary text-sm py-2">
              <Play size={14} /> {campaign.status === 'draft' ? 'Launch' : 'Resume'}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}18`, color }}>
                <Icon size={15} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {(['overview', 'leads', 'sequence'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all"
            style={{
              background: tab === t ? 'var(--brand)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-secondary)',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Campaign Info</h3>
            <div className="space-y-3">
              {[
                { label: 'Status', value: <StatusBadge status={campaign.status} /> },
                { label: 'Sequence Steps', value: `${campaign.steps?.length || 0} steps` },
                { label: 'Senders', value: `${campaign.linkedinAccountIds?.length || 0} accounts` },
                { label: 'Started', value: campaign.startedAt ? timeAgo(campaign.startedAt) : 'Not started' },
                { label: 'Created', value: timeAgo(campaign.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Funnel</h3>
            {[
              { label: 'Leads Added', val: campaign.totalLeads, color: 'var(--brand)' },
              { label: 'Connections Sent', val: campaign.connectionsSent, color: 'var(--blue)' },
              { label: 'Connected', val: campaign.connectionsAccepted, color: 'var(--green)' },
              { label: 'Messages Sent', val: campaign.messagesSent, color: 'var(--yellow)' },
              { label: 'Replied', val: campaign.repliesReceived, color: 'var(--green)' },
            ].map(({ label, val, color }) => {
              const pct = campaign.totalLeads > 0 ? (val / campaign.totalLeads) * 100 : 0;
              return (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'leads' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Leads {leadsData?.total ? `(${leadsData.total})` : ''}
            </h3>
            <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs py-1.5">
              <Upload size={12} /> Import CSV
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Lead', 'Status', 'Step', 'Last Activity', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(leadsData?.leads || []).map((lead: Lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                        {(lead.firstName?.[0] || lead.fullName?.[0] || '?').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {lead.fullName || `${lead.firstName} ${lead.lastName}`.trim() || 'Unknown'}
                        </p>
                        <p className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{lead.company || lead.headline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <LeadStatusBadge status={lead.status} />
                    {(lead as any).sequencePaused && (
                      <span className="badge badge-yellow mt-1" style={{ display: 'block', width: 'fit-content' }}>⏸ Auto-paused (replied)</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Step {lead.currentStep + 1}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {lead.activityLog?.length > 0 ? timeAgo(lead.activityLog[lead.activityLog.length - 1].timestamp) : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <a href={lead.linkedinProfileUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--brand)' }}>
                      View →
                    </a>
                  </td>
                </tr>
              ))}
              {(!leadsData?.leads || leadsData.leads.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No leads yet. Import a CSV to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {leadsData?.pages > 1 && (
            <div className="flex justify-center gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
              {Array.from({ length: leadsData.pages }, (_, i) => (
                <button key={i} onClick={() => setLeadsPage(i + 1)}
                  className="w-8 h-8 rounded-lg text-sm transition-all"
                  style={{
                    background: leadsPage === i + 1 ? 'var(--brand)' : 'var(--bg-elevated)',
                    color: leadsPage === i + 1 ? 'white' : 'var(--text-secondary)',
                  }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'sequence' && (
        <div className="max-w-lg space-y-3">
          {(campaign.steps || []).map((step, idx) => {
            const COLORS: Record<string, string> = {
              connection_request: 'var(--brand)',
              message: 'var(--green)',
              profile_view: 'var(--blue)',
              follow: 'var(--yellow)',
              delay: 'var(--text-muted)',
            };
            const color = COLORS[step.type] || 'var(--brand)';
            return (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${color}18`, color, border: `2px solid ${color}` }}>
                    {idx + 1}
                  </div>
                  {idx < campaign.steps.length - 1 && (
                    <div className="w-0.5 flex-1 mt-2" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div className="card p-4 flex-1 mb-3">
                  <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                    {step.type.replace(/_/g, ' ')}
                  </p>
                  {step.delayDays > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      Wait {step.delayDays}d {step.delayHours > 0 ? `${step.delayHours}h` : ''} before this step
                    </p>
                  )}
                  {step.messageTemplate && (
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{step.messageTemplate}</p>
                  )}
                  {step.connectionNote && (
                    <p className="text-xs mt-2 italic" style={{ color: 'var(--text-secondary)' }}>"{step.connectionNote}"</p>
                  )}
                  {step.condition && step.condition !== 'always' && (
                    <span className="badge badge-blue mt-2">{step.condition.replace(/_/g, ' ')}</span>
                  )}
                </div>
              </div>
            );
          })}
          {(!campaign.steps || campaign.steps.length === 0) && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No steps configured.</p>
          )}
        </div>
      )}
    </div>
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
  return <span className={`badge ${cls}`}><span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />{label}</span>;
}

function LeadStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'badge-gray', connection_sent: 'badge-blue', connected: 'badge-green',
    message_sent: 'badge-purple', replied: 'badge-green', interested: 'badge-green',
    not_interested: 'badge-red', error: 'badge-red', skipped: 'badge-gray',
  };
  return <span className={`badge ${map[status] || 'badge-gray'} capitalize`}>{status.replace(/_/g, ' ')}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-lg" style={{ background: 'var(--bg-surface)' }} />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-24" />)}
      </div>
    </div>
  );
}
