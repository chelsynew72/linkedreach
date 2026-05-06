'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { LinkedInAccount } from '@/types';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { timeAgo, getInitials } from '@/lib/utils';
import {
  Plus, Trash2, RefreshCw, AlertCircle, CheckCircle,
  Clock, Wifi, WifiOff, Settings, ExternalLink, X,
} from 'lucide-react';

export default function AccountsPage() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginTarget, setLoginTarget] = useState<string | null>(null);
  const [loginCreds, setLoginCreds] = useState({ email: '', password: '' });

  const { data: accounts = [], isLoading } = useQuery<LinkedInAccount[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data),
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => api.post('/accounts', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account added. Now connect it via login.');
      setShowAdd(false);
      setLoginForm({ email: '', password: '' });
    },
    onError: () => toast.error('Failed to add account'),
  });

  const loginMutation = useMutation({
    mutationFn: ({ id, email, password }: { id: string; email: string; password: string }) =>
      api.post(`/automation/accounts/${id}/login`, { email, password }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('LinkedIn login initiated!');
      setLoginTarget(null);
    },
    onError: () => toast.error('Login failed. Check credentials.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/accounts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success('Account removed'); },
    onError: () => toast.error('Failed to remove account'),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>LinkedIn Accounts</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {accounts.filter((a) => a.status === 'active').length} active · {accounts.length} total
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={15} /> Add Account
        </button>
      </div>

      {/* Add Account Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative card p-6 w-full max-w-md z-10 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add LinkedIn Account</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>LinkedIn Email</label>
                <input className="input" type="email" placeholder="your@email.com"
                  value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Daily Connection Limit</label>
                <input className="input" type="number" defaultValue={20} min={5} max={40} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Proxy URL (optional)</label>
                <input className="input" type="text" placeholder="http://user:pass@host:port" />
              </div>
              <div className="p-3 rounded-lg flex gap-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--yellow)' }} />
                <p className="text-xs" style={{ color: 'var(--yellow)' }}>
                  After adding, you'll need to log in to authenticate the account via Puppeteer.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => addMutation.mutate({ linkedinEmail: loginForm.email })}
                  disabled={!loginForm.email || addMutation.isPending}
                  className="btn-primary flex-1 justify-center">
                  {addMutation.isPending ? 'Adding...' : 'Add Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLoginTarget(null)} />
          <div className="relative card p-6 w-full max-w-md z-10 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Connect LinkedIn Account</h2>
              <button onClick={() => setLoginTarget(null)} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input className="input" type="email" value={loginCreds.email}
                  onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <input className="input" type="password" value={loginCreds.password}
                  onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })} />
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Credentials are only used once to create a session and are never stored in plain text.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setLoginTarget(null)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => loginMutation.mutate({ id: loginTarget, ...loginCreds })}
                  disabled={loginMutation.isPending}
                  className="btn-primary flex-1 justify-center">
                  {loginMutation.isPending ? 'Connecting...' : 'Login & Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-44 animate-pulse" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--brand-glow)', color: 'var(--brand)' }}>
            <Wifi size={28} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No accounts connected</h3>
          <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
            Add LinkedIn accounts to start sending connection requests and messages at scale.
          </p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus size={15} /> Add First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              onLogin={() => { setLoginTarget(acc.id); setLoginCreds({ email: acc.linkedinEmail, password: '' }); }}
              onDelete={() => { if (confirm('Remove this account?')) deleteMutation.mutate(acc.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountCard({ account: acc, onLogin, onDelete }: {
  account: LinkedInAccount;
  onLogin: () => void;
  onDelete: () => void;
}) {
  const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    active: { icon: CheckCircle, color: 'var(--green)', label: 'Active' },
    paused: { icon: Clock, color: 'var(--yellow)', label: 'Paused' },
    error: { icon: AlertCircle, color: 'var(--red)', label: 'Error' },
    connecting: { icon: RefreshCw, color: 'var(--brand)', label: 'Connecting' },
    requires_verification: { icon: AlertCircle, color: 'var(--yellow)', label: 'Needs Verification' },
  };
  const { icon: StatusIcon, color, label } = statusConfig[acc.status] || statusConfig.error;

  const connPct = Math.round((acc.todayConnections / acc.dailyConnectionLimit) * 100);
  const msgPct = Math.round((acc.todayMessages / acc.dailyMessageLimit) * 100);

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'var(--brand)', color: 'white' }}>
            {getInitials(acc.profileName || acc.linkedinEmail)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {acc.profileName || acc.linkedinEmail}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {acc.profileHeadline || acc.linkedinEmail}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
          <StatusIcon size={12} />
          {label}
        </span>
      </div>

      {/* Daily usage */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-muted)' }}>Connections today</span>
            <span style={{ color: 'var(--text-secondary)' }}>{acc.todayConnections}/{acc.dailyConnectionLimit}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(connPct, 100)}%`, background: connPct >= 90 ? 'var(--red)' : 'var(--brand)' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'var(--text-muted)' }}>Messages today</span>
            <span style={{ color: 'var(--text-secondary)' }}>{acc.todayMessages}/{acc.dailyMessageLimit}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(msgPct, 100)}%`, background: msgPct >= 90 ? 'var(--red)' : 'var(--green)' }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 text-center">
        {[
          { label: 'Total Sent', val: acc.totalConnectionsSent },
          { label: 'Messages', val: acc.totalMessagesSent },
          { label: 'Replies', val: acc.totalRepliesReceived },
        ].map(({ label, val }) => (
          <div key={label} className="flex-1 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{val}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {acc.errorMessage && (
        <p className="text-xs p-2 rounded-lg" style={{ background: 'rgba(248,113,113,0.08)', color: 'var(--red)' }}>
          {acc.errorMessage}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {acc.status !== 'active' && (
          <button onClick={onLogin} className="btn-primary flex-1 justify-center text-xs py-2">
            <Wifi size={12} /> Connect
          </button>
        )}
        {acc.linkedinProfileUrl && (
          <a href={acc.linkedinProfileUrl} target="_blank" rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-3">
            <ExternalLink size={12} />
          </a>
        )}
        <button onClick={onDelete} className="btn-secondary text-xs py-2 px-3"
          style={{ color: 'var(--red)' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
