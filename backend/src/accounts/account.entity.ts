import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum AccountStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  CONNECTING = 'connecting',
  REQUIRES_VERIFICATION = 'requires_verification',
}

@Entity('linkedin_accounts')
export class LinkedInAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.linkedinAccounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  linkedinEmail: string;

  @Column({ nullable: true })
  linkedinProfileUrl: string;

  @Column({ nullable: true })
  profileName: string;

  @Column({ nullable: true })
  profileAvatarUrl: string;

  @Column({ nullable: true })
  profileHeadline: string;

  @Column({ default: AccountStatus.CONNECTING })
  status: AccountStatus;

  @Column({ nullable: true, type: 'text' })
  sessionCookies: string; // encrypted JSON of LinkedIn cookies

  @Column({ nullable: true })
  proxyUrl: string; // optional dedicated proxy per account

  @Column({ default: 20 })
  dailyConnectionLimit: number;

  @Column({ default: 50 })
  dailyMessageLimit: number;

  @Column({ default: 0 })
  todayConnections: number;

  @Column({ default: 0 })
  todayMessages: number;

  @Column({ nullable: true, type: 'timestamp' })
  lastActivityAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastSyncAt: Date;

  @Column({ default: 0 })
  totalConnectionsSent: number;

  @Column({ default: 0 })
  totalMessagesSent: number;

  @Column({ default: 0 })
  totalRepliesReceived: number;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
