import {
  Controller, Get, Post, Body, Param, Query, UseGuards, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns/:campaignId/leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads for a campaign' })
  findAll(
    @Param('campaignId') campaignId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.leadsService.findByCampaign(campaignId, +page, +limit);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import leads into a campaign' })
  import(
    @Param('campaignId') campaignId: string,
    @Body() body: { leads: { linkedinProfileUrl: string; firstName?: string; lastName?: string; fullName?: string; headline?: string; company?: string; email?: string }[] },
  ) {
    return this.leadsService.createMany(campaignId, body.leads);
  }
}
