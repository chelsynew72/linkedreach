'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { User, Bell, Shield, CreditCard, Zap } from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'security' | 'billing';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', company: user?.company || '' });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch('/users/me', data),
    onSuccess: () => toast.success('Profile updated'),
    onError: () => toast.error('Failed to update'),
  });

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const PLANS = [
    { name: 'Starter', price: '$99', accounts: 3, desc: 'For individuals', color: 'var(--blue)' },
    { name: 'Agency', price: '$799', accounts: 50, desc: 'For agencies', color: 'var(--brand)', popular: true },
    { name: 'Unlimited', price: '$1,999', accounts: '∞', desc: 'White label', color: 'var(--green)' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Manage your account preferences</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === key ? 'var(--brand)' : 'transparent',
              color: tab === key ? 'white' : 'var(--text-secondary)',
            }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'var(--brand)', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              <span className="badge badge-purple mt-1">{user?.plan} plan</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input className="input" value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Company</label>
              <input className="input" placeholder="Your company" value={profileForm.company}
                onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input className="input" type="email" value={user?.email || ''} disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>
          <button onClick={() => updateMutation.mutate(profileForm)} disabled={updateMutation.isPending}
            className="btn-primary">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
          {[
            { label: 'Campaign started/paused', desc: 'Get notified when a campaign changes status' },
            { label: 'New reply received', desc: 'Alert when a lead replies to your message' },
            { label: 'Account error', desc: 'Alert when a LinkedIn account has an issue' },
            { label: 'Daily summary', desc: 'Daily email with performance metrics' },
            { label: 'Weekly report', desc: 'Weekly outreach performance digest' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between py-3"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <Toggle />
            </div>
          ))}
        </div>
      )}

      {tab === 'security' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
          </div>
          <button className="btn-primary">Update Password</button>
          <div className="p-4 rounded-xl mt-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--red)' }}>Danger Zone</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Permanently delete your account and all data.</p>
            <button className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
              style={{ background: 'rgba(248,113,113,0.15)', color: 'var(--red)' }}>
              Delete Account
            </button>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Current Plan</h2>
              <span className="badge badge-purple capitalize">{user?.plan}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You are on the {user?.plan} plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map(({ name, price, accounts, desc, color, popular }) => (
              <div key={name} className="card p-5 relative"
                style={{ border: popular ? `1px solid ${color}` : undefined }}>
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-purple text-xs px-3">
                    Most Popular
                  </span>
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${color}18`, color }}>
                  <Zap size={15} />
                </div>
                <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{name}</p>
                <p className="text-2xl font-black mt-1" style={{ color }}>{price}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span></p>
                <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{accounts}</strong> LinkedIn accounts
                </p>
                <button className="w-full text-sm py-2 rounded-lg font-medium transition-all"
                  style={{ background: popular ? color : 'var(--bg-elevated)', color: popular ? 'white' : 'var(--text-primary)' }}>
                  {user?.plan === name.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button onClick={() => setOn(!on)}
      className="w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0"
      style={{ background: on ? 'var(--brand)' : 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{ background: 'white', left: on ? '22px' : '2px' }} />
    </button>
  );
}
