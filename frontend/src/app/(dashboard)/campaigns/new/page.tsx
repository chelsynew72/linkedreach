'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { LinkedInAccount, CampaignStep, StepType } from '@/types';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeft, Plus, Trash2, GripVertical, UserPlus,
  MessageSquare, Eye, UserCheck, Clock, ChevronDown,
  ChevronUp, Zap, Info,
} from 'lucide-react';
import Link from 'next/link';

const STEP_TYPES: { type: StepType; label: string; icon: any; color: string; desc: string }[] = [
  { type: 'connection_request', label: 'Connection Request', icon: UserPlus, color: 'var(--brand)', desc: 'Send a connection invite' },
  { type: 'message', label: 'Send Message', icon: MessageSquare, color: 'var(--green)', desc: 'Send a personalized message' },
  { type: 'profile_view', label: 'View Profile', icon: Eye, color: 'var(--blue)', desc: 'Visit their LinkedIn profile' },
  { type: 'follow', label: 'Follow', icon: UserCheck, color: 'var(--yellow)', desc: 'Follow the LinkedIn member' },
  { type: 'delay', label: 'Wait / Delay', icon: Clock, color: 'var(--text-muted)', desc: 'Wait before next step' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<CampaignStep[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showStepPicker, setShowStepPicker] = useState(false);

  const { data: accounts = [] } = useQuery<LinkedInAccount[]>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/campaigns', data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created!');
      router.push(`/campaigns/${res.data.id}`);
    },
    onError: () => toast.error('Failed to create campaign'),
  });

  const addStep = (type: StepType) => {
    const step: CampaignStep = {
      id: uuidv4(),
      type,
      order: steps.length,
      delayDays: type === 'delay' ? 1 : 0,
      delayHours: 0,
      messageTemplate: type === 'message' ? 'Hi {{firstName}},\n\nI noticed your work at {{company}} and wanted to connect!\n\nBest,\n{{senderName}}' : undefined,
      connectionNote: type === 'connection_request' ? '' : undefined,
      condition: 'always',
    };
    setSteps([...steps, step]);
    setExpandedStep(step.id);
    setShowStepPicker(false);
  };

  const removeStep = (id: string) => setSteps(steps.filter((s) => s.id !== id));

  const updateStep = (id: string, data: Partial<CampaignStep>) =>
    setSteps(steps.map((s) => (s.id === id ? { ...s, ...data } : s)));

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Campaign name is required'); return; }
    if (steps.length === 0) { toast.error('Add at least one step'); return; }
    createMutation.mutate({ name, description, steps, linkedinAccountIds: selectedAccounts });
  };

  const toggleAccount = (id: string) =>
    setSelectedAccounts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns" className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>New Campaign</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Build your outreach sequence</p>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Campaign Details</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Campaign Name *</label>
          <input className="input" placeholder="e.g. SaaS Founders Outreach Q1" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
          <textarea className="input resize-none" rows={2} placeholder="Optional description..."
            value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      {/* Sequence Builder */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Sequence Steps</h2>
          <span className="badge badge-purple">{steps.length} steps</span>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const meta = STEP_TYPES.find((t) => t.type === step.type)!;
            const Icon = meta.icon;
            const isExpanded = expandedStep === step.id;
            return (
              <div key={step.id} className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${isExpanded ? 'var(--brand)' : 'var(--border)'}` }}>
                {/* Step header */}
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  style={{ background: 'var(--bg-elevated)' }}
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                  <GripVertical size={15} style={{ color: 'var(--text-muted)' }} />
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${meta.color}18`, color: meta.color }}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {idx + 1}. {meta.label}
                    </span>
                    {step.delayDays > 0 && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        · wait {step.delayDays}d
                      </span>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeStep(step.id); }}
                    className="p-1 rounded transition-colors" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Trash2 size={13} />
                  </button>
                  {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {/* Step config */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Delay */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Wait (days)</label>
                        <input type="number" min={0} max={30} className="input py-1.5 text-sm"
                          value={step.delayDays}
                          onChange={(e) => updateStep(step.id, { delayDays: +e.target.value })} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Hours</label>
                        <input type="number" min={0} max={23} className="input py-1.5 text-sm"
                          value={step.delayHours}
                          onChange={(e) => updateStep(step.id, { delayHours: +e.target.value })} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Condition</label>
                        <select className="input py-1.5 text-sm"
                          value={step.condition}
                          onChange={(e) => updateStep(step.id, { condition: e.target.value as any })}>
                          <option value="always">Always</option>
                          <option value="if_connected">If Connected</option>
                          <option value="if_not_connected">If Not Connected</option>
                        </select>
                      </div>
                    </div>

                    {/* Message template */}
                    {step.type === 'message' && (
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                          Message Template
                        </label>
                        <textarea className="input resize-none text-sm" rows={4}
                          placeholder="Hi {{firstName}}, ..."
                          value={step.messageTemplate || ''}
                          onChange={(e) => updateStep(step.id, { messageTemplate: e.target.value })} />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Use: {'{{firstName}}'} {'{{lastName}}'} {'{{company}}'} {'{{headline}}'}
                        </p>
                      </div>
                    )}

                    {/* Connection note */}
                    {step.type === 'connection_request' && (
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                          Connection Note (optional, max 300 chars)
                        </label>
                        <textarea className="input resize-none text-sm" rows={3}
                          maxLength={300}
                          placeholder="Add a personal note to your connection request..."
                          value={step.connectionNote || ''}
                          onChange={(e) => updateStep(step.id, { connectionNote: e.target.value })} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add step */}
        {showStepPicker ? (
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Choose step type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STEP_TYPES.map(({ type, label, icon: Icon, color, desc }) => (
                <button key={type} onClick={() => addStep(type)}
                  className="flex flex-col items-start gap-2 p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}18`, color }}>
                    <Icon size={13} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowStepPicker(false)} className="text-xs mt-2"
              style={{ color: 'var(--text-muted)' }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowStepPicker(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border-2 border-dashed hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <Plus size={16} /> Add Step
          </button>
        )}
      </div>

      {/* LinkedIn Accounts */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>LinkedIn Senders</h2>
          <Link href="/accounts" className="text-xs" style={{ color: 'var(--brand)' }}>+ Add account</Link>
        </div>
        {accounts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No LinkedIn accounts connected yet.</p>
            <Link href="/accounts" className="text-sm mt-1 block" style={{ color: 'var(--brand)' }}>Connect an account →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accounts.map((acc) => {
              const selected = selectedAccounts.includes(acc.id);
              return (
                <button key={acc.id} onClick={() => toggleAccount(acc.id)}
                  className="flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                  style={{
                    background: selected ? 'var(--brand-glow)' : 'var(--bg-elevated)',
                    border: `1px solid ${selected ? 'var(--brand)' : 'var(--border)'}`,
                  }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--brand)', color: 'white' }}>
                    {acc.profileName?.[0] || acc.linkedinEmail[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {acc.profileName || acc.linkedinEmail}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {acc.todayConnections}/{acc.dailyConnectionLimit} today
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
                    style={{ borderColor: selected ? 'var(--brand)' : 'var(--border)', background: selected ? 'var(--brand)' : 'transparent' }}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pb-8">
        <Link href="/campaigns" className="btn-secondary">Cancel</Link>
        <button onClick={handleSubmit} disabled={createMutation.isPending} className="btn-primary px-6">
          <Zap size={15} />
          {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>
    </div>
  );
}
