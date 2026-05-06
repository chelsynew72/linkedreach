import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
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

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get analytics for a campaign' })
  getCampaign(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }
}
