import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus, CampaignStep } from './campaign.entity';

@Injectable()
export class CampaignsService {
  constructor(@InjectRepository(Campaign) private repo: Repository<Campaign>) {}

  async findAll(userId: string): Promise<Campaign[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.repo.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.userId !== userId) throw new ForbiddenException();
    return campaign;
  }

  async create(userId: string, data: {
    name: string;
    description?: string;
    steps?: CampaignStep[];
    linkedinAccountIds?: string[];
  }): Promise<Campaign> {
    const campaign = this.repo.create({
      userId,
      name: data.name,
      description: data.description,
      steps: data.steps || [],
      linkedinAccountIds: data.linkedinAccountIds || [],
    });
    return this.repo.save(campaign);
  }

  async update(id: string, userId: string, data: Partial<Campaign>): Promise<Campaign> {
    await this.findOne(id, userId);
    await this.repo.update(id, data);
    return this.findOne(id, userId);
  }

  async updateStatus(id: string, userId: string, status: CampaignStatus): Promise<Campaign> {
    const campaign = await this.findOne(id, userId);
    const updates: Partial<Campaign> = { status };
    if (status === CampaignStatus.ACTIVE && !campaign.startedAt) {
      updates.startedAt = new Date();
    }
    if (status === CampaignStatus.COMPLETED) {
      updates.completedAt = new Date();
    }
    await this.repo.update(id, updates);
    return this.findOne(id, userId);
  }

  async incrementStat(id: string, stat: keyof Campaign, amount = 1) {
    await this.repo.increment({ id }, stat as string, amount);
  }

  async delete(id: string, userId: string): Promise<void> {
    const campaign = await this.findOne(id, userId);
    await this.repo.remove(campaign);
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.repo.find({ where: { status: CampaignStatus.ACTIVE } });
  }
}
