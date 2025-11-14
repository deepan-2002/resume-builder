import { useCallback, useEffect, useMemo, useState } from 'react';
import { resumeService } from '../services/resume.service';
import type { ResumeContent } from '../types/resume.types';

const STORAGE_KEY = 'resume-builder:create-resume';

const initialContent: ResumeContent = {
  personalInfo: {
    fullName: '',
    headline: '',
    summary: '',
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      website: '',
      location: '',
    },
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

interface StoredDraft {
  templateId?: number;
  resumeId?: number;
  content: ResumeContent;
  lastSavedAt?: number | null;
}

const loadDraft = (): StoredDraft => {
  if (typeof window === 'undefined') {
    return { content: initialContent };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { content: initialContent };
    }
    const parsed = JSON.parse(raw) as StoredDraft;
    return {
      content: { ...initialContent, ...parsed.content },
      templateId: parsed.templateId,
      resumeId: parsed.resumeId,
      lastSavedAt: parsed.lastSavedAt ?? null,
    };
  } catch (error) {
    console.warn('Failed to parse draft resume, resetting.', error);
    return { content: initialContent };
  }
};

export const useCreateResumeWizard = () => {
  const [bootstrap] = useState<StoredDraft>(loadDraft);
  const [content, setContent] = useState<ResumeContent>(bootstrap.content);
  const [templateId, setTemplateId] = useState<number | undefined>(
    bootstrap.templateId,
  );
  const [resumeId, setResumeId] = useState<number | undefined>(bootstrap.resumeId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(
    bootstrap.lastSavedAt ?? null,
  );

  const currentDraft = useMemo(
    () => ({
      templateId,
      resumeId,
      content,
      lastSavedAt,
    }),
    [templateId, resumeId, content, lastSavedAt],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDraft));
  }, [currentDraft]);

  const persistRemote = useCallback(
    async (
      nextTemplateId?: number,
      nextContent?: ResumeContent,
      titleOverride?: string,
    ) => {
      if (!nextTemplateId) {
        return;
      }

      setSaving(true);
      setError(null);

      let didSave = false;
      try {
        if (!resumeId) {
          const created = await resumeService.create({
            templateId: nextTemplateId,
            content: nextContent ?? content,
            title:
              titleOverride ??
              nextContent?.personalInfo?.fullName ??
              content.personalInfo?.fullName ??
              'Untitled Resume',
          });
          setResumeId(created.id);
        } else {
          await resumeService.update(resumeId, {
            templateId: nextTemplateId,
            content: nextContent ?? content,
            title:
              titleOverride ??
              nextContent?.personalInfo?.fullName ??
              content.personalInfo?.fullName ??
              undefined,
          });
        }
        didSave = true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unable to save resume progress.',
        );
      } finally {
        setSaving(false);
        if (didSave) {
          setLastSavedAt(Date.now());
        }
      }
    },
    [content, resumeId],
  );

  const updateTemplate = useCallback(
    async (nextTemplateId: number) => {
      setTemplateId(nextTemplateId);
      await persistRemote(nextTemplateId, content);
    },
    [content, persistRemote],
  );

  const saveSection = useCallback(
    async <K extends keyof ResumeContent>(
      section: K,
      value: NonNullable<ResumeContent[K]>,
      options?: { title?: string },
    ) => {
      let updated: ResumeContent | null = null;
      setContent((prev) => {
        updated = { ...prev, [section]: value };
        return updated;
      });

      if (updated) {
        await persistRemote(templateId, updated, options?.title);
      }
    },
    [persistRemote, templateId],
  );

  const resetDraft = useCallback(() => {
    setContent(initialContent);
    setTemplateId(undefined);
    setResumeId(undefined);
    setLastSavedAt(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    content,
    templateId,
    resumeId,
    saving,
    error,
    lastSavedAt,
    updateTemplate,
    saveSection,
    resetDraft,
  };
};

export default useCreateResumeWizard;

