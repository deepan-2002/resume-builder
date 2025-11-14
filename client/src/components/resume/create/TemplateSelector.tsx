import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { TemplateSummary } from '../../../types/resume.types';
import TemplateCard from './TemplateCard';
import Button from '../../common/Button';

interface TemplateSelectorProps {
  templates: TemplateSummary[];
  selectedTemplateId?: number;
  loading?: boolean;
  error?: string | null;
  onSelect: (template: TemplateSummary) => void;
  onContinue?: () => void;
  disableContinue?: boolean;
  ctaLabel?: string;
}

const TemplateSelector = ({
  templates,
  selectedTemplateId,
  loading,
  error,
  onSelect,
  onContinue,
  disableContinue,
  ctaLabel = 'Continue',
}: TemplateSelectorProps) => {
  if (loading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          Loading templates...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {templates.map((template, index) => (
          <Grid
            key={template.id}
            size={{ xs: 12, md: 6, lg: 4 }}
            display="flex"
            justifyContent="stretch"
          >
            <TemplateCard
              template={template}
              index={index}
              selected={template.id === selectedTemplateId}
              onSelect={onSelect}
            />
          </Grid>
        ))}
        {!templates.length && (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 4,
                border: 1,
                borderColor: 'divider',
                borderRadius: 3,
                textAlign: 'center',
              }}
            >
              <Typography color="text.secondary">
                No templates available. Please try again later.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      {onContinue && (
        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={onContinue} disabled={!selectedTemplateId || disableContinue}>
            {ctaLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default TemplateSelector;

