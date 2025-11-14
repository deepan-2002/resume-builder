import { Divider, Stack, Typography } from '@mui/material';
import type { TemplateProps } from './types';

const ModernTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  return (
    <Stack
      spacing={3}
      sx={{
        border: 1,
        borderColor: theme?.primary ?? 'divider',
        borderRadius: 3,
        bgcolor: '#fff',
        p: 3,
        boxShadow: 1,
      }}
    >
      <div>
        <Typography
          variant="h5"
          sx={{ color: theme?.primary ?? 'text.primary', fontWeight: 600 }}
        >
          {data.personalInfo?.fullName ?? 'Your Name'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.personalInfo?.headline ?? 'Role / Title'}
        </Typography>
      </div>

      <Divider />

      <Stack spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{ color: theme?.text ?? 'text.primary', fontWeight: 600 }}
        >
          Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.summary ?? 'Write a compelling professional summary.'}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <Typography
          variant="subtitle1"
          sx={{ color: theme?.text ?? 'text.primary', fontWeight: 600 }}
        >
          Experience
        </Typography>
        {(data.experience ?? []).map((item) => (
          <div key={item.id}>
            <Typography variant="subtitle2" fontWeight={600}>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.subtitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default ModernTemplate;

