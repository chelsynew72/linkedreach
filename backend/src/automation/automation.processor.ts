import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LinkedInBrowserService } from './linkedin-browser.service';
import { LeadsService } from '../leads/leads.service';
import { AccountsService } from '../accounts/accounts.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { LeadStatus } from '../leads/lead.entity';
import { AutomationJob } from './automation.service';

@Processor('automation')
export class AutomationProcessor {
  private readonly logger = new Logger(AutomationProcessor.name);

  constructor(
    private browserService: LinkedInBrowserService,
    private leadsService: LeadsService,
    private accountsService: AccountsService,
    private campaignsService: CampaignsService,
  ) {}

  @Process()
  async handle(job: Job<AutomationJob>) {
    const { type, accountId, leadId, campaignId, profileUrl, message, note, stepIndex } = job.data;
    this.logger.log(`Processing ${type} job for lead ${leadId}`);

    // Skip if lead's sequence has been auto-paused due to a reply
    const leadRecord = await this.leadsService.getPendingLeads(campaignId, 1000)
      .then((leads) => leads.find((l) => l.id === leadId))
      .catch(() => null);
    if (leadRecord?.sequencePaused) {
      this.logger.log(`Skipping job for lead ${leadId} - sequence paused (lead replied)`);
      return;
    }

    try {
      switch (type) {
        case 'connection': {
          const canConnect = await this.accountsService.canSendConnection(accountId);
          if (!canConnect) {
            this.logger.warn(`Account ${accountId} hit daily limit`);
            return;
          }
          const result = await this.browserService.sendConnectionRequest(accountId, profileUrl, note);
          if (result.success) {
            await this.leadsService.updateStatus(leadId, LeadStatus.CONNECTION_SENT, {
              assignedAccountId: accountId,
              connectionSentAt: new Date(),
              currentStep: stepIndex + 1,
            });
            await this.accountsService.incrementStats(accountId, 'connection');
            await this.campaignsService.incrementStat(campaignId, 'connectionsSent');
            await this.leadsService.addActivity(leadId, 'connection_sent', `Sent via account ${accountId}`);
          } else {
            await this.leadsService.updateStatus(leadId, LeadStatus.ERROR, {
              errorMessage: result.error,
            });
          }
          break;
        }

        case 'message': {
          const canMsg = await this.accountsService.canSendMessage(accountId);
          if (!canMsg) {
            this.logger.warn(`Account ${accountId} hit message limit`);
            return;
          }
          const result = await this.browserService.sendMessage(accountId, profileUrl, message || '');
          if (result.success) {
            await this.leadsService.updateStatus(leadId, LeadStatus.MESSAGE_SENT, {
              lastMessageAt: new Date(),
              currentStep: stepIndex + 1,
            });
            await this.accountsService.incrementStats(accountId, 'message');
            await this.campaignsService.incrementStat(campaignId, 'messagesSent');
            await this.leadsService.addActivity(leadId, 'message_sent');
          } else {
            await this.leadsService.updateStatus(leadId, LeadStatus.ERROR, {
              errorMessage: result.error,
            });
          }
          break;
        }

        case 'profile_view': {
          await this.browserService.viewProfile(accountId, profileUrl);
          await this.leadsService.addActivity(leadId, 'profile_viewed');
          break;
        }
      }
    } catch (err) {
      this.logger.error(`Job failed: ${err.message}`);
      await this.leadsService.updateStatus(leadId, LeadStatus.ERROR, {
        errorMessage: err.message,
      });
      throw err;
    }
  }
}
