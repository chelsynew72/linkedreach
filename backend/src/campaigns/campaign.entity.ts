import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum StepType {
  CONNECTION_REQUEST = 'connection_request',
  MESSAGE = 'message',
  PROFILE_VIEW = 'profile_view',
  FOLLOW = 'follow',
  DELAY = 'delay',
}

export interface CampaignStep {
  id: string;
  type: StepType;
  order: number;
  delayDays: number;
  delayHours: number;
  messageTemplate?: string;
  connectionNote?: string;
  condition?: 'if_connected' | 'if_not_connected' | 'always';
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.campaigns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Column({ type: 'jsonb', default: [] })
  steps: CampaignStep[];

  @Column({ type: 'simple-array', default: '' })
  linkedinAccountIds: string[];

  @Column({ default: 0 })
  totalLeads: number;

  @Column({ default: 0 })
  pendingLeads: number;

  @Column({ default: 0 })
  connectionsSent: number;

  @Column({ default: 0 })
  connectionsAccepted: number;

  @Column({ default: 0 })
  messagesSent: number;

  @Column({ default: 0 })
  repliesReceived: number;

  @Column({ nullable: true, type: 'timestamp' })
  startedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
