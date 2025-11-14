import { Paper } from '@mui/material';
import { useMemo, type FC } from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import type { TemplateProps } from '../templates/types';
import type {
  ResumeContent,
  TemplateComponentKey,
  Theme,
} from '../../../types/resume.types';

const fallbackTheme: Theme = {
  primary: '#4f46e5',
  secondary: '#c7d2fe',
  background: '#ffffff',
  text: '#111827',
};

interface ResumePreviewProps {
  content?: ResumeContent;
  theme?: Theme;
  templateKey?: TemplateComponentKey;
}

const templateRegistry: Record<TemplateComponentKey, FC<TemplateProps>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
};

const ResumePreview = ({ content, theme, templateKey = 'modern' }: ResumePreviewProps) => {
  const templateProps: TemplateProps = useMemo(
    () => ({
      data: content ?? { summary: 'Start writing to see the preview.' },
      theme: theme ?? fallbackTheme,
    }),
    [content, theme],
  );

  const TemplateComponent = templateRegistry[templateKey] ?? ModernTemplate;

  return (
    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
      <TemplateComponent {...templateProps} />
    </Paper>
  );
};

export default ResumePreview;

