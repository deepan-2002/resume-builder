import { Paper } from '@mui/material';
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
    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
      <ModernTemplate {...templateProps} />
    </Paper>
  );
};

export default ResumePreview;

