import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Resume } from '../../resumes/entities/resume.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'name', nullable: true, length: 100 })
  name: string;

  @Column({ name: 'profile_image_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'subscription_tier', length: 50, default: 'free' })
  subscriptionTier: string;

  @Column({ name: 'public_key', nullable: true })
  publicKey?: string;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'last_seen_at', type: 'timestamptz', nullable: true })
  lastSeenAt?: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @BeforeInsert()
  async hashPassword() {
    if (this.passwordHash) {
      const saltRounds = 12;
      this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
    }
  }
}
