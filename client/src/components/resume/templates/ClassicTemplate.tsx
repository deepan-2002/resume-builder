import { Box, Divider, Stack, Typography } from '@mui/material';
import type { TemplateProps } from './types';

const SectionHeading = ({ label }: { label: string }) => (
  <Typography
    variant="subtitle2"
    sx={{
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: 'text.secondary',
      fontWeight: 600,
    }}
  >
    {label}
  </Typography>
);

const ClassicTemplate = ({ data, theme }: TemplateProps) => {
  const { personalInfo, education, experience, skills, projects, certifications } =
    data ?? {};
  const contact = personalInfo?.contact;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: theme?.background ?? '#fafafa',
      }}
    >
      <Box sx={{ bgcolor: theme?.primary ?? '#1f2937', color: '#fff', p: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {personalInfo?.fullName ?? 'Your Name'}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
          {personalInfo?.headline ?? 'Professional Headline'}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          mt={2}
          flexWrap="wrap"
        >
          {contact?.email && <Typography>{contact.email}</Typography>}
          {contact?.phone && <Typography>{contact.phone}</Typography>}
          {contact?.linkedin && <Typography>{contact.linkedin}</Typography>}
          {contact?.website && <Typography>{contact.website}</Typography>}
        </Stack>
      </Box>
      <Stack spacing={3} padding={3}>
        {personalInfo?.summary && (
          <Box>
            <SectionHeading label="Summary" />
            <Typography mt={1} color="text.secondary">
              {personalInfo.summary}
            </Typography>
          </Box>
        )}

        {experience && experience.length > 0 && (
          <Box>
            <SectionHeading label="Experience" />
            <Stack spacing={2} mt={1}>
              {experience.map((item) => (
                <Box key={item.id ?? item.title}>
                  <Typography fontWeight={600}>{item.title}</Typography>
                  {item.subtitle && (
                    <Typography color="text.secondary">{item.subtitle}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {[item.startDate, item.endDate].filter(Boolean).join(' • ')}
                  </Typography>
                  {item.description && (
                    <Typography mt={0.5}>{item.description}</Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {education && education.length > 0 && (
          <Box>
            <SectionHeading label="Education" />
            <Stack spacing={2} mt={1}>
              {education.map((item) => (
                <Box key={item.id ?? item.title}>
                  <Typography fontWeight={600}>{item.title}</Typography>
                  {item.subtitle && (
                    <Typography color="text.secondary">{item.subtitle}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {[item.startDate, item.endDate].filter(Boolean).join(' • ')}
                  </Typography>
                  {item.description && (
                    <Typography mt={0.5}>{item.description}</Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {skills && skills.length > 0 && (
          <Box>
            <SectionHeading label="Skills" />
            <Typography mt={1}>{skills.join(' • ')}</Typography>
          </Box>
        )}

        {projects && projects.length > 0 && (
          <Box>
            <SectionHeading label="Projects" />
            <Stack spacing={2} mt={1}>
              {projects.map((item) => (
                <Box key={item.id ?? item.title}>
                  <Typography fontWeight={600}>{item.title}</Typography>
                  {item.subtitle && (
                    <Typography color="text.secondary">{item.subtitle}</Typography>
                  )}
                  {item.description && (
                    <Typography mt={0.5}>{item.description}</Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {certifications && certifications.length > 0 && (
          <>
            <Divider />
            <Box>
              <SectionHeading label="Certifications" />
              <Stack spacing={1} mt={1}>
                {certifications.map((item) => (
                  <Typography key={item.id ?? item.title}>{item.title}</Typography>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ClassicTemplate;

