import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import type { ResumeContent } from '../types/resume.types';
import { resumeService } from '../services/resume.service';

const AUTO_SAVE_DELAY = 2000;

export const useAutoSave = (content: ResumeContent, resumeId?: number) => {
  const debouncedSave = useMemo(() => {
    if (!resumeId) {
      return null;
    }

    return debounce(async (payload: ResumeContent) => {
      try {
        await resumeService.updateContent(resumeId, payload);
      } catch (error) {
        console.error('Auto-save failed', error);
      }
    }, AUTO_SAVE_DELAY);
  }, [resumeId]);

  useEffect(() => {
    if (!resumeId || !debouncedSave) return undefined;
    debouncedSave(content);

    return () => {
      debouncedSave.cancel();
    };
  }, [content, debouncedSave, resumeId]);
};

export default useAutoSave;

