import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';

@Entity('inbox_messages')
export class InboxMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  accountId: string;

  @Column()
  linkedinConversationId: string;

  @Column()
  senderProfileUrl: string;

  @Column({ nullable: true })
  senderName: string;

  @Column({ nullable: true })
  senderAvatarUrl: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isFromMe: boolean;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  campaignId: string;

  @Column({ nullable: true })
  leadId: string;

  @Column({ nullable: true, type: 'timestamp' })
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
