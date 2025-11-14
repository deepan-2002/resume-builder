import { Box, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditorToolbar from '../components/resume/editor/EditorToolbar';
import ResumePreview from '../components/resume/preview/ResumePreview';
import useAutoSave from '../hooks/useAutoSave';
import useResume from '../hooks/useResume';
import type { ResumeContent, Theme } from '../types/resume.types';
import { generatePdf } from '../utils/pdfGenerator';

const defaultContent: ResumeContent = {
  summary: 'Highlight your top achievements and strengths here.',
  experience: [],
};

const ResumeEditor = () => {
  const params = useParams();
  const resumeId = Number(params.id ?? '1');
  const { currentResume, setActiveResume } = useResume();
  const [content, setContent] = useState<ResumeContent>(defaultContent);
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    setActiveResume(resumeId);
  }, [resumeId, setActiveResume]);

  useEffect(() => {
    if (currentResume?.content) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(currentResume.content);
    }
  }, [currentResume?.content]);

  useAutoSave(content, resumeId);

  const handleSummaryChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setContent((prev) => ({ ...prev, summary: event.target.value }));

  const placeholders = useMemo(
    () => ({
      title: currentResume?.title ?? 'Untitled resume',
    }),
    [currentResume?.title],
  );

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="caption" color="text.secondary">
          Editing
        </Typography>
        <Typography variant="h4">{placeholders.title}</Typography>
      </div>

      <EditorToolbar
        onThemeChange={setTheme}
        onExportPdf={() => currentResume && generatePdf(currentResume)}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Summary (auto-saves every 2s)
          </Typography>
          <TextField
            multiline
            minRows={8}
            fullWidth
            value={content.summary ?? ''}
            onChange={handleSummaryChange}
            placeholder="Describe your experience, strengths, and career goals."
          />
        </Paper>
        <ResumePreview content={content} theme={theme} />
      </Box>
    </Stack>
  );
};

export default ResumeEditor;

