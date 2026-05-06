export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'agency' | 'unlimited';
  company?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface LinkedInAccount {
  id: string;
  linkedinEmail: string;
  linkedinProfileUrl?: string;
  profileName?: string;
  profileAvatarUrl?: string;
  profileHeadline?: string;
  status: 'active' | 'paused' | 'error' | 'connecting' | 'requires_verification';
  dailyConnectionLimit: number;
  dailyMessageLimit: number;
  todayConnections: number;
  todayMessages: number;
  totalConnectionsSent: number;
  totalMessagesSent: number;
  totalRepliesReceived: number;
  lastActivityAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export type StepType = 'connection_request' | 'message' | 'profile_view' | 'follow' | 'delay';

export interface CampaignStep {
  id: string;
  type: StepType;
  order: number;
  delayDays: number;
  delayHours: number;
  messageTemplate?: string;
  connectionNote?: string;
  condition?: 'if_connected' | 'if_not_connected' | 'always';
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  steps: CampaignStep[];
  linkedinAccountIds: string[];
  totalLeads: number;
  pendingLeads: number;
  connectionsSent: number;
  connectionsAccepted: number;
  messagesSent: number;
  repliesReceived: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | 'pending'
  | 'connection_sent'
  | 'connected'
  | 'message_sent'
  | 'replied'
  | 'interested'
  | 'not_interested'
  | 'skipped'
  | 'error';

export interface Lead {
  id: string;
  campaignId: string;
  linkedinProfileUrl: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  headline?: string;
  company?: string;
  location?: string;
  avatarUrl?: string;
  email?: string;
  status: LeadStatus;
  currentStep: number;
  assignedAccountId?: string;
  connectionSentAt?: string;
  connectedAt?: string;
  lastMessageAt?: string;
  lastReplyAt?: string;
  errorMessage?: string;
  activityLog: { action: string; timestamp: string; details?: string }[];
  createdAt: string;
}

export interface InboxConversation {
  id: string;
  linkedinConversationId: string;
  senderProfileUrl: string;
  senderName?: string;
  senderAvatarUrl?: string;
  content: string;
  isRead: boolean;
  sentAt?: string;
  accountId: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAccounts: number;
  activeAccounts: number;
  totalConnectionsSent: number;
  totalConnectionsAccepted: number;
  acceptanceRate: number;
  totalMessages: number;
  totalReplies: number;
  replyRate: number;
}
