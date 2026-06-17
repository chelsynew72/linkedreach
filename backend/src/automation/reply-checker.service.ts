import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LinkedInBrowserService } from './linkedin-browser.service';
import { AccountsService } from '../accounts/accounts.service';
import { LeadsService } from '../leads/leads.service';
import { InboxService } from '../inbox/inbox.service';
import { AccountStatus } from '../accounts/account.entity';

@Injectable()
export class ReplyCheckerService {
  private readonly logger = new Logger(ReplyCheckerService.name);

  constructor(
    private browserService: LinkedInBrowserService,
    private accountsService: AccountsService,
    private leadsService: LeadsService,
    private inboxService: InboxService,
  ) {}

  // Runs every 10 minutes - checks all active accounts for new replies
  @Cron('*/10 * * * *')
  async checkAllAccountsForReplies() {
    this.logger.log('Running scheduled reply check...');

    try {
      const accounts = await this.accountsService['repo'].find({
        where: { status: AccountStatus.ACTIVE },
      });

      for (const account of accounts) {
        await this.checkAccountReplies(account.id, account.userId);
        await new Promise((r) => setTimeout(r, 5000));
      }
    } catch (err) {
      this.logger.error(`Reply check cycle failed: ${err.message}`);
    }
  }

  async checkAccountReplies(accountId: string, userId: string) {
    try {
      const replies = await this.browserService.checkForNewReplies(accountId);

      for (const reply of replies) {
        const lead = await this.leadsService.findByProfileUrl(reply.profileUrl);

        if (lead && !lead.sequencePaused) {
          this.logger.log(`Reply detected from lead ${lead.id} - pausing sequence`);
          await this.leadsService.pauseSequenceOnReply(lead.id, reply.lastMessage);

          await this.inboxService.saveMessage({
            userId,
            accountId,
            linkedinConversationId: reply.conversationId,
            senderProfileUrl: reply.profileUrl,
            content: reply.lastMessage,
            isFromMe: false,
            isRead: false,
            leadId: lead.id,
            campaignId: lead.campaignId,
            sentAt: new Date(),
          });
        }
      }

      if (replies.length > 0) {
        this.logger.log(`Account ${accountId}: found ${replies.length} new replies`);
      }
    } catch (err) {
      this.logger.warn(`Reply check failed for account ${accountId}: ${err.message}`);
    }
  }
}
