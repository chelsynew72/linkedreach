import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AutomationService } from './automation.service';
import { LinkedInBrowserService } from './linkedin-browser.service';
import { AutomationProcessor } from './automation.processor';
import { AutomationController } from './automation.controller';
import { ReplyCheckerService } from './reply-checker.service';
import { AccountsModule } from '../accounts/accounts.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { LeadsModule } from '../leads/leads.module';
import { InboxModule } from '../inbox/inbox.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'automation' }),
    AccountsModule,
    CampaignsModule,
    LeadsModule,
    InboxModule,
  ],
  providers: [AutomationService, LinkedInBrowserService, AutomationProcessor, ReplyCheckerService],
  controllers: [AutomationController],
  exports: [AutomationService],
})
export class AutomationModule {}
