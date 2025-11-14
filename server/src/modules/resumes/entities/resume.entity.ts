import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Template } from '../../templates/entities/template.entity';
import { ResumeContent } from './resume-content.entity';
import { ExportHistory } from './export-history.entity';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'slug', unique: true, length: 255, nullable: true })
  slug: string | null;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.resumes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'template_id', nullable: true })
  templateId: number | null;

  @ManyToOne(() => Template, (template) => template.resumes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'template_id' })
  template: Template | null;

  @OneToOne(() => ResumeContent, (content) => content.resume, {
    cascade: true,
  })
  content: ResumeContent | null;

  @OneToMany(() => ExportHistory, (exportHistory) => exportHistory.resume)
  exports: ExportHistory[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
