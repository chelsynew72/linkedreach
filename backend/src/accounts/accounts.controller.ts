import {
  Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';

export class CreateAccountDto {
  @IsString() linkedinEmail: string;
  @IsOptional() @IsString() proxyUrl?: string;
  @IsOptional() @IsNumber() dailyConnectionLimit?: number;
  @IsOptional() @IsNumber() dailyMessageLimit?: number;
}

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List all LinkedIn accounts' })
  findAll(@Request() req) {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single LinkedIn account' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new LinkedIn account' })
  create(@Request() req, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(req.user.id, dto);
  }

  @Patch(':id/limits')
  @ApiOperation({ summary: 'Update daily limits for an account' })
  async updateLimits(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { dailyConnectionLimit?: number; dailyMessageLimit?: number },
  ) {
    return this.accountsService.updateLimits(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a LinkedIn account' })
  delete(@Request() req, @Param('id') id: string) {
    return this.accountsService.delete(id, req.user.id);
  }
}
