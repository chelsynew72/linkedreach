import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxMessage } from './inbox-message.entity';

@Injectable()
export class InboxService {
  constructor(@InjectRepository(InboxMessage) private repo: Repository<InboxMessage>) {}

  async getConversations(userId: string) {
    // Get latest message per conversation
    const messages = await this.repo
      .createQueryBuilder('m')
      .where('m.userId = :userId', { userId })
      .orderBy('m.sentAt', 'DESC')
      .getMany();

    // Group by conversationId
    const convMap = new Map<string, InboxMessage>();
    for (const msg of messages) {
      if (!convMap.has(msg.linkedinConversationId)) {
        convMap.set(msg.linkedinConversationId, msg);
      }
    }
    return Array.from(convMap.values());
  }

  async getMessages(userId: string, conversationId: string): Promise<InboxMessage[]> {
    return this.repo.find({
      where: { userId, linkedinConversationId: conversationId },
      order: { sentAt: 'ASC' },
    });
  }

  async saveMessage(data: Partial<InboxMessage>): Promise<InboxMessage> {
    // Avoid duplicates
    if (data.linkedinConversationId && data.sentAt && data.content) {
      const existing = await this.repo.findOne({
        where: {
          linkedinConversationId: data.linkedinConversationId,
          content: data.content,
        },
      });
      if (existing) return existing;
    }
    return this.repo.save(this.repo.create(data));
  }

  async markRead(userId: string, conversationId: string) {
    await this.repo.update(
      { userId, linkedinConversationId: conversationId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, isRead: false, isFromMe: false } });
  }
}
