import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkedInAccount, AccountStatus } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(LinkedInAccount)
    private repo: Repository<LinkedInAccount>,
  ) {}

  async findAll(userId: string): Promise<LinkedInAccount[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, userId: string): Promise<LinkedInAccount> {
    const account = await this.repo.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException();
    return account;
  }

  async create(userId: string, data: {
    linkedinEmail: string;
    proxyUrl?: string;
    dailyConnectionLimit?: number;
    dailyMessageLimit?: number;
  }): Promise<LinkedInAccount> {
    const account = this.repo.create({
      userId,
      linkedinEmail: data.linkedinEmail,
      proxyUrl: data.proxyUrl,
      dailyConnectionLimit: data.dailyConnectionLimit || 20,
      dailyMessageLimit: data.dailyMessageLimit || 50,
      status: AccountStatus.CONNECTING,
    });
    return this.repo.save(account);
  }

  async updateStatus(id: string, status: AccountStatus, errorMessage?: string) {
    await this.repo.update(id, { status, errorMessage: errorMessage || null });
  }

  async saveSession(id: string, cookies: string, profileData: {
    profileName?: string;
    profileAvatarUrl?: string;
    profileHeadline?: string;
    linkedinProfileUrl?: string;
  }) {
    await this.repo.update(id, {
      sessionCookies: cookies,
      status: AccountStatus.ACTIVE,
      lastSyncAt: new Date(),
      ...profileData,
    });
  }

  async incrementStats(id: string, type: 'connection' | 'message') {
    if (type === 'connection') {
      await this.repo.increment({ id }, 'todayConnections', 1);
      await this.repo.increment({ id }, 'totalConnectionsSent', 1);
    } else {
      await this.repo.increment({ id }, 'todayMessages', 1);
      await this.repo.increment({ id }, 'totalMessagesSent', 1);
    }
    await this.repo.update(id, { lastActivityAt: new Date() });
  }

  async resetDailyCounters() {
    await this.repo.update({}, { todayConnections: 0, todayMessages: 0 });
  }

  async delete(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);
    await this.repo.remove(account);
  }

  async canSendConnection(id: string): Promise<boolean> {
    const account = await this.repo.findOne({ where: { id } });
    if (!account || account.status !== AccountStatus.ACTIVE) return false;
    return account.todayConnections < account.dailyConnectionLimit;
  }

  async canSendMessage(id: string): Promise<boolean> {
    const account = await this.repo.findOne({ where: { id } });
    if (!account || account.status !== AccountStatus.ACTIVE) return false;
    return account.todayMessages < account.dailyMessageLimit;
  }
}
