import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview stats' })
  getDashboard(@Request() req) {
    return this.analyticsService.getDashboardStats(req.user.id);
  }

  @Get('daily-stats')
  @ApiOperation({ summary: 'Get daily activity stats for the last N days' })
  getDailyStats(@Request() req, @Query('days') days?: string) {
    return this.analyticsService.getDailyStats(req.user.id, days ? parseInt(days, 10) : 30);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get analytics for a campaign' })
  getCampaign(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }
}
