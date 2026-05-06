'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { InboxConversation } from '@/types';
import { timeAgo, getInitials } from '@/lib/utils';
import { useState } from 'react';
import { MessageSquare, Search, Send, CheckCheck } from 'lucide-react';

export default function InboxPage() {
  const qc = useQueryClient();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data: conversations = [] } = useQuery<InboxConversation[]>({
    queryKey: ['conversations'],
    queryFn: () => api.get('/inbox/conversations').then((r) => r.data),
    refetchInterval: 30000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', activeConv],
    queryFn: () => api.get(`/inbox/conversations/${activeConv}/messages`).then((r) => r.data),
    enabled: !!activeConv,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.post(`/inbox/conversations/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });

  const handleSelect = (id: string) => {
    setActiveConv(id);
    markReadMutation.mutate(id);
  };

  const filtered = conversations.filter((c) =>
    !search || c.senderName?.toLowerCase().includes(search.toLowerCase())
  );

  const active = conversations.find((c) => c.linkedinConversationId === activeConv);

  return (
    <div className="animate-fade-in h-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inbox</h1>
        <span className="badge badge-purple">
          {conversations.filter((c) => !c.isRead).length} unread
        </span>
      </div>

      <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 190px)' }}>
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="input pl-8 py-2 text-sm" placeholder="Search conversations..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <MessageSquare size={24} className="mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No conversations yet</p>
              </div>
            )}
            {filtered.map((conv) => (
              <button key={conv.linkedinConversationId}
                onClick={() => handleSelect(conv.linkedinConversationId)}
                className="w-full flex items-start gap-3 p-4 text-left transition-colors"
                style={{
                  background: activeConv === conv.linkedinConversationId ? 'var(--brand-glow)' : 'transparent',
                  borderLeft: activeConv === conv.linkedinConversationId ? '2px solid var(--brand)' : '2px solid transparent',
                }}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                    {getInitials(conv.senderName || '?')}
                  </div>
                  {!conv.isRead && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: 'var(--brand)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate" style={{
                      color: 'var(--text-primary)',
                      fontWeight: conv.isRead ? 400 : 600,
                    }}>
                      {conv.senderName || 'Unknown'}
                    </span>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                      {conv.sentAt ? timeAgo(conv.sentAt) : ''}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{conv.content}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col">
          {activeConv && active ? (
            <>
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                  {getInitials(active.senderName || '?')}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{active.senderName}</p>
                  <a href={active.senderProfileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs" style={{ color: 'var(--brand)' }}>View on LinkedIn →</a>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {(messages as any[]).map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm"
                      style={{
                        background: msg.isFromMe ? 'var(--brand)' : 'var(--bg-elevated)',
                        color: msg.isFromMe ? 'white' : 'var(--text-primary)',
                        borderBottomRightRadius: msg.isFromMe ? '4px' : '16px',
                        borderBottomLeftRadius: msg.isFromMe ? '16px' : '4px',
                      }}>
                      {msg.content}
                      <p className="text-xs mt-1 opacity-60">
                        {msg.sentAt ? timeAgo(msg.sentAt) : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {(messages as any[]).length === 0 && (
                  <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>No messages loaded yet.</p>
                )}
              </div>
              <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Reply directly on LinkedIn. Messages here are read-only.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                <MessageSquare size={24} />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
