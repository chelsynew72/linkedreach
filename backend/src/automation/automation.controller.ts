import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AutomationService } from './automation.service';
import { LinkedInBrowserService } from './linkedin-browser.service';

@ApiTags('automation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('automation')
export class AutomationController {
  constructor(
    private automationService: AutomationService,
    private browserService: LinkedInBrowserService,
  ) {}

  @Post('campaigns/:id/start')
  @ApiOperation({ summary: 'Queue jobs for a campaign' })
  startCampaign(@Param('id') id: string) {
    return this.automationService.queueCampaignJobs(id);
  }

  @Post('campaigns/:id/pause')
  @ApiOperation({ summary: 'Pause and clear queued jobs for a campaign' })
  pauseCampaign(@Param('id') id: string) {
    return this.automationService.pauseCampaign(id);
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  getQueueStats() {
    return this.automationService.getQueueStats();
  }

  @Post('accounts/:id/login')
  @ApiOperation({ summary: 'Log into a LinkedIn account via Puppeteer' })
  login(
    @Param('id') accountId: string,
    @Body() body: { email: string; password: string },
  ) {
    return this.browserService.loginToLinkedIn(accountId, body.email, body.password);
  }
}
