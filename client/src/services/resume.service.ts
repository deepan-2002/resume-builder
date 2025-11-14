import type {
  Resume,
  ResumeContent,
  TemplateSummary,
  CreateResumePayload,
} from '../types/resume.types';
import api from './api';

export const resumeService = {
  async create(payload: CreateResumePayload): Promise<Resume> {
    const { data } = await api.post('/resumes', payload);
    return data.data ?? data;
  },

  async list(): Promise<Resume[]> {
    const { data } = await api.get('/resumes');
    return data.data ?? data;
  },

  async get(resumeId: number): Promise<Resume> {
    const { data } = await api.get(`/resumes/${resumeId}`);
    return data.data ?? data;
  },

  async updateContent(resumeId: number, content: ResumeContent) {
    const { data } = await api.put(`/resumes/${resumeId}/content`, content);
    return data.data ?? data;
  },

  async update(
    resumeId: number,
    payload: Partial<Resume> & { content?: ResumeContent | null },
  ) {
    const { data } = await api.put(`/resumes/${resumeId}`, payload);
    return data.data ?? data;
  },

  async duplicate(resumeId: number) {
    const { data } = await api.post(`/resumes/${resumeId}/duplicate`);
    return data.data ?? data;
  },
};

export const templateService = {
  async list(): Promise<TemplateSummary[]> {
    const { data } = await api.get('/templates');
    return data.data ?? data;
  },

  async categories(): Promise<string[]> {
    const { data } = await api.get('/templates/categories');
    return data.data ?? data;
  },
};

