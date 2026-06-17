import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from './lead.entity';

@Injectable()
export class LeadsService {
  constructor(@InjectRepository(Lead) private repo: Repository<Lead>) {}

  async findByCampaign(campaignId: string, page = 1, limit = 50) {
    const [leads, total] = await this.repo.findAndCount({
      where: { campaignId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { leads, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async createMany(campaignId: string, profiles: {
    linkedinProfileUrl: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    headline?: string;
    company?: string;
    location?: string;
    email?: string;
  }[]): Promise<Lead[]> {
    // Deduplicate by URL
    const existing = await this.repo.find({ where: { campaignId } });
    const existingUrls = new Set(existing.map((l) => l.linkedinProfileUrl));
    const newProfiles = profiles.filter((p) => !existingUrls.has(p.linkedinProfileUrl));
    if (newProfiles.length === 0) return [];
    const leads = newProfiles.map((p) =>
      this.repo.create({ campaignId, ...p, status: LeadStatus.PENDING }),
    );
    return this.repo.save(leads);
  }

  async updateStatus(id: string, status: LeadStatus, extra?: Partial<Lead>) {
    await this.repo.update(id, { status, ...extra });
  }

  async addActivity(id: string, action: string, details?: string) {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) return;
    const log = [...(lead.activityLog || []), { action, timestamp: new Date().toISOString(), details }];
    await this.repo.update(id, { activityLog: log });
  }

  async getPendingLeads(campaignId: string, limit = 10): Promise<Lead[]> {
    return this.repo.find({
      where: { campaignId, status: LeadStatus.PENDING },
      take: limit,
      order: { createdAt: 'ASC' },
    });
  }

  async getReadyLeads(limit = 20): Promise<Lead[]> {
    return this.repo
      .createQueryBuilder('lead')
      .where('lead.status IN (:...statuses)', {
        statuses: [LeadStatus.PENDING, LeadStatus.CONNECTION_SENT, LeadStatus.CONNECTED],
      })
      .andWhere('(lead.nextActionAt IS NULL OR lead.nextActionAt <= NOW())')
      .take(limit)
      .getMany();
  }

  async assignAccount(id: string, accountId: string) {
    await this.repo.update(id, { assignedAccountId: accountId });
  }

  async pauseSequenceOnReply(leadId: string, replyPreview: string) {
    await this.repo.update(leadId, {
      status: LeadStatus.REPLIED,
      sequencePaused: true,
      pauseReason: 'Lead replied - automation paused to avoid spamming',
      lastReplyAt: new Date(),
    });
    await this.addActivity(leadId, 'reply_detected', replyPreview.slice(0, 200));
  }

  async findByProfileUrl(profileUrl: string) {
    return this.repo.findOne({ where: { linkedinProfileUrl: profileUrl } });
  }

}
