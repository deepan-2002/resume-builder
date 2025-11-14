import { useMemo } from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import type { TemplateProps } from '../templates/types';
import type { ResumeContent, Theme } from '../../../types/resume.types';

const fallbackTheme: Theme = {
  primary: '#4f46e5',
  secondary: '#c7d2fe',
  background: '#ffffff',
  text: '#111827',
};

interface ResumePreviewProps {
  content?: ResumeContent;
  theme?: Theme;
}

const ResumePreview = ({ content, theme }: ResumePreviewProps) => {
  const templateProps: TemplateProps = useMemo(
    () => ({
      data: content ?? { summary: 'Start writing to see the preview.' },
      theme: theme ?? fallbackTheme,
    }),
    [content, theme],
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <ModernTemplate {...templateProps} />
    </div>
  );
};

export default ResumePreview;

