import { Alert, Box, Stack, Typography } from '@mui/material';
import type { ResumeContent, TemplateSummary } from '../../../types/resume.types';
import ResumePreview from '../preview/ResumePreview';
import TemplateSwitcher from './TemplateSwitcher';
import Button from '../../common/Button';
import { resolveTemplateComponent } from '../../../utils/templateUtils';

interface PreviewStepProps {
  content: ResumeContent;
  templates: TemplateSummary[];
  selectedTemplateId?: number;
  onTemplateChange: (template: TemplateSummary) => void | Promise<void>;
  onBack: () => void;
  onFinish: () => void;
  saving?: boolean;
  error?: string | null;
  lastSavedAt?: number | null;
}

const PreviewStep = ({
  content,
  templates,
  selectedTemplateId,
  onTemplateChange,
  onBack,
  onFinish,
  saving,
  error,
  lastSavedAt,
}: PreviewStepProps) => {
  const activeTemplate =
    templates.find((tpl) => tpl.id === selectedTemplateId) ?? templates[0];

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        gap={2}
      >
        <Box>
          <Typography variant="h5">Preview & Finish</Typography>
          <Typography color="text.secondary">
            Review your resume and switch templates instantly. Your data stays
            intact while trying different designs.
          </Typography>
          {lastSavedAt && (
            <Typography variant="caption" color="success.main" display="block" mt={1}>
              Autosaved at {new Date(lastSavedAt).toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <TemplateSwitcher
          templates={templates}
          selectedTemplateId={activeTemplate?.id}
          onChange={onTemplateChange}
        />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <ResumePreview
        content={content}
        templateKey={resolveTemplateComponent(activeTemplate)}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} justifyContent="flex-end">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onFinish} isLoading={saving}>
          Save & Exit
        </Button>
      </Stack>
    </Stack>
  );
};

export default PreviewStep;

