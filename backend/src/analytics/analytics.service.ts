import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from '../campaigns/campaign.entity';
import { Lead, LeadStatus } from '../leads/lead.entity';
import { LinkedInAccount, AccountStatus } from '../accounts/account.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Campaign) private campaignRepo: Repository<Campaign>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(LinkedInAccount) private accountRepo: Repository<LinkedInAccount>,
  ) {}

  async getDashboardStats(userId: string) {
    const [campaigns, accounts] = await Promise.all([
      this.campaignRepo.find({ where: { userId } }),
      this.accountRepo.find({ where: { userId } }),
    ]);

    const activeCampaigns = campaigns.filter((c) => c.status === CampaignStatus.ACTIVE);
    const totalConnectionsSent = campaigns.reduce((s, c) => s + c.connectionsSent, 0);
    const totalConnectionsAccepted = campaigns.reduce((s, c) => s + c.connectionsAccepted, 0);
    const totalMessages = campaigns.reduce((s, c) => s + c.messagesSent, 0);
    const totalReplies = campaigns.reduce((s, c) => s + c.repliesReceived, 0);

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.status === AccountStatus.ACTIVE).length,
      totalConnectionsSent,
      totalConnectionsAccepted,
      acceptanceRate: totalConnectionsSent > 0
        ? Math.round((totalConnectionsAccepted / totalConnectionsSent) * 100)
        : 0,
      totalMessages,
      totalReplies,
      replyRate: totalMessages > 0
        ? Math.round((totalReplies / totalMessages) * 100)
        : 0,
    };
  }

  async getCampaignAnalytics(campaignId: string) {
    const campaign = await this.campaignRepo.findOne({ where: { id: campaignId } });
    if (!campaign) return null;

    const leads = await this.leadRepo.find({ where: { campaignId } });
    const statusBreakdown = leads.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      campaign,
      totalLeads: leads.length,
      statusBreakdown,
      acceptanceRate: campaign.connectionsSent > 0
        ? Math.round((campaign.connectionsAccepted / campaign.connectionsSent) * 100)
        : 0,
      replyRate: campaign.messagesSent > 0
        ? Math.round((campaign.repliesReceived / campaign.messagesSent) * 100)
        : 0,
    };
  }
}
