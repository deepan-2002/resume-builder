import { useCallback, useMemo } from 'react';
import { resumeService } from '../services/resume.service';
import {
  fetchResumeById,
  fetchResumes,
  setCurrentResume,
  updateResumeContent,
} from '../store/slices/resumeSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import type { ResumeContent } from '../types/resume.types';

export const useResume = () => {
  const dispatch = useAppDispatch();
  const { items, currentId, loading } = useAppSelector(
    (state) => state.resumes,
  );
  const currentResume = currentId ? items[currentId] : undefined;

  const loadResumes = useCallback(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const setActiveResume = useCallback(
    async (resumeId: number) => {
      const action = await dispatch(fetchResumeById(resumeId));
      if (fetchResumeById.fulfilled.match(action)) {
        dispatch(setCurrentResume(resumeId));
      }
    },
    [dispatch],
  );

  const persistContent = useCallback(
    async (resumeId: number, content: ResumeContent) => {
      dispatch(updateResumeContent({ id: resumeId, content }));
      await resumeService.updateContent(resumeId, content);
    },
    [dispatch],
  );

  return {
    resumes: useMemo(() => Object.values(items), [items]),
    currentResume,
    currentId,
    loading,
    loadResumes,
    setActiveResume,
    persistContent,
  };
};

export default useResume;

