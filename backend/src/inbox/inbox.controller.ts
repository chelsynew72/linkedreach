import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InboxService } from './inbox.service';

@ApiTags('inbox')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inbox')
export class InboxController {
  constructor(private inboxService: InboxService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'List all conversations' })
  getConversations(@Request() req) {
    return this.inboxService.getConversations(req.user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(@Request() req, @Param('id') id: string) {
    return this.inboxService.getMessages(req.user.id, id);
  }

  @Post('conversations/:id/read')
  @ApiOperation({ summary: 'Mark conversation as read' })
  markRead(@Request() req, @Param('id') id: string) {
    return this.inboxService.markRead(req.user.id, id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count' })
  async getUnreadCount(@Request() req) {
    const count = await this.inboxService.getUnreadCount(req.user.id);
    return { count };
  }
}
