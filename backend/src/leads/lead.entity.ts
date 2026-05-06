import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';

export enum LeadStatus {
  PENDING = 'pending',
  CONNECTION_SENT = 'connection_sent',
  CONNECTED = 'connected',
  MESSAGE_SENT = 'message_sent',
  REPLIED = 'replied',
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
  SKIPPED = 'skipped',
  ERROR = 'error',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaignId: string;

  @ManyToOne(() => Campaign, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column()
  linkedinProfileUrl: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: LeadStatus.PENDING })
  status: LeadStatus;

  @Column({ default: 0 })
  currentStep: number;

  @Column({ nullable: true })
  assignedAccountId: string;

  @Column({ nullable: true, type: 'timestamp' })
  nextActionAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  connectionSentAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  connectedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastMessageAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastReplyAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', default: [] })
  activityLog: { action: string; timestamp: string; details?: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
