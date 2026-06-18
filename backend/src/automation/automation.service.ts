import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CampaignsService } from '../campaigns/campaigns.service';
import { LeadsService } from '../leads/leads.service';
import { AccountsService } from '../accounts/accounts.service';
// import { LeadStatus } from '../leads/lead.entity';
import { StepType } from '../campaigns/campaign.entity';

export interface AutomationJob {
  type: 'connection' | 'message' | 'profile_view' | 'follow';
  accountId: string;
  leadId: string;
  campaignId: string;
  profileUrl: string;
  message?: string;
  note?: string;
  stepIndex: number;
}

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectQueue('automation') private automationQueue: Queue,
    private campaignsService: CampaignsService,
    private leadsService: LeadsService,
    private accountsService: AccountsService,
  ) {}

  async queueCampaignJobs(campaignId: string) {
    const campaign = await this.campaignsService.getActiveCampaigns()
      .then((cs) => cs.find((c) => c.id === campaignId));
    if (!campaign) return;

    const pendingLeads = await this.leadsService.getPendingLeads(campaignId, 10);
    const accounts = campaign.linkedinAccountIds.filter(Boolean);
    if (accounts.length === 0) return;

    for (let i = 0; i < pendingLeads.length; i++) {
      const lead = pendingLeads[i];
      // Round-robin account assignment
      const accountId = accounts[i % accounts.length];

      const canConnect = await this.accountsService.canSendConnection(accountId);
      if (!canConnect) continue;

      const firstStep = campaign.steps[0];
      if (!firstStep) continue;

      const job: AutomationJob = {
        type: firstStep.type === StepType.CONNECTION_REQUEST ? 'connection' : 'profile_view',
        accountId,
        leadId: lead.id,
        campaignId,
        profileUrl: lead.linkedinProfileUrl,
        note: firstStep.connectionNote,
        stepIndex: 0,
      };

      // Add delay between jobs (30-90 seconds apart)
      const delayMs = (i * 60000) + Math.floor(Math.random() * 60000);
      await this.automationQueue.add(job, {
        delay: delayMs,
        attempts: 3,
        backoff: { type: 'exponential', delay: 30000 },
      });
    }

    this.logger.log(`Queued ${pendingLeads.length} jobs for campaign ${campaignId}`);
  }

  async pauseCampaign(campaignId: string) {
    const jobs = await this.automationQueue.getJobs(['waiting', 'delayed']);
    for (const job of jobs) {
      if (job.data.campaignId === campaignId) {
        await job.remove();
      }
    }
  }

  async getQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.automationQueue.getWaitingCount(),
      this.automationQueue.getActiveCount(),
      this.automationQueue.getCompletedCount(),
      this.automationQueue.getFailedCount(),
    ]);
    return { waiting, active, completed, failed };
  }
}
