import { Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const SectionCard = ({ title, subtitle, children, actions }: SectionCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, md: 4 },
      borderRadius: 3,
      border: 1,
      borderColor: 'divider',
      backgroundImage:
        'radial-gradient(circle at top right, rgba(79,70,229,0.08), transparent 55%)',
    }}
  >
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5" color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {children}
      {actions && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  </Paper>
);

export default SectionCard;

