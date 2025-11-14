export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  linkedin?: string;
}

export interface ResumeSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeContent {
  personalInfo?: {
    fullName?: string;
    headline?: string;
    summary?: string;
    contact?: ContactInfo;
  };
  summary?: string;
  experience?: ResumeSectionItem[];
  education?: ResumeSectionItem[];
  skills?: string[];
  projects?: ResumeSectionItem[];
  certifications?: ResumeSectionItem[];
  languages?: string[];
  customSections?: Record<string, ResumeSectionItem[]>;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface Resume {
  id: number;
  title: string;
  slug?: string | null;
  isPublic: boolean;
  templateId?: number | null;
  updatedAt?: string;
  content?: ResumeContent | null;
}

export type TemplateComponentKey = 'modern' | 'classic';

export interface TemplateSummary {
  id: number;
  name: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  isPremium: boolean;
  componentKey?: TemplateComponentKey;
}

export interface CreateResumePayload {
  title?: string;
  templateId: number;
  content?: ResumeContent;
}

