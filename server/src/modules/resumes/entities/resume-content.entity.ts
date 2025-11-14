import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from './resume.entity';

@Entity('resume_content')
export class ResumeContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resume_id', unique: true })
  resumeId: number;

  @OneToOne(() => Resume, (resume) => resume.content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: Resume;

  @Column({ name: 'personal_info', type: 'jsonb', nullable: true })
  personalInfo: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ name: 'experience', type: 'jsonb', nullable: true })
  experience: Record<string, unknown> | null;

  @Column({ name: 'education', type: 'jsonb', nullable: true })
  education: Record<string, unknown> | null;

  @Column({ name: 'skills', type: 'jsonb', nullable: true })
  skills: Record<string, unknown> | null;

  @Column({ name: 'projects', type: 'jsonb', nullable: true })
  projects: Record<string, unknown> | null;

  @Column({ name: 'certifications', type: 'jsonb', nullable: true })
  certifications: Record<string, unknown> | null;

  @Column({ name: 'languages', type: 'jsonb', nullable: true })
  languages: Record<string, unknown> | null;

  @Column({ name: 'custom_sections', type: 'jsonb', nullable: true })
  customSections: Record<string, unknown> | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
