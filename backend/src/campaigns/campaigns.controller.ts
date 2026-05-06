import {
  Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CampaignsService } from './campaigns.service';
import { CampaignStatus, CampaignStep } from './campaign.entity';

export class CreateCampaignDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() steps?: CampaignStep[];
  @IsOptional() @IsArray() linkedinAccountIds?: string[];
}

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all campaigns' })
  findAll(@Request() req) {
    return this.campaignsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.campaignsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(@Request() req, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(req.user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update campaign' })
  update(@Request() req, @Param('id') id: string, @Body() dto: Partial<CreateCampaignDto>) {
    return this.campaignsService.update(id, req.user.id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campaign status' })
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: CampaignStatus,
  ) {
    return this.campaignsService.updateStatus(id, req.user.id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete campaign' })
  delete(@Request() req, @Param('id') id: string) {
    return this.campaignsService.delete(id, req.user.id);
  }
}
