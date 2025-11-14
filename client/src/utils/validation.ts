import type { ResumeContent } from '../types/resume.types';

export const validateResume = (content: ResumeContent) => {
  const errors: string[] = [];
  if (!content.personalInfo?.fullName) {
    errors.push('Full name is required.');
  }
  if (!content.summary || content.summary.length < 50) {
    errors.push('Summary should be at least 50 characters long.');
  }
  return errors;
};

