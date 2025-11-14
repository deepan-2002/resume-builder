import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditorToolbar from '../components/resume/editor/EditorToolbar';
import useAutoSave from '../hooks/useAutoSave';
import useResume from '../hooks/useResume';
import type { ResumeContent, Theme } from '../types/resume.types';
import { generatePdf } from '../utils/pdfGenerator';
import Header from '../components/layout/Header';

const defaultContent: ResumeContent = {
  summary: 'Highlight your top achievements and strengths here.',
  experience: [],
};

const ResumeEditor = () => {
  const params = useParams();
  const resumeId = Number(params.id);
  const { currentResume, setActiveResume } = useResume();
  const [content, setContent] = useState<ResumeContent>(defaultContent);
  const [, setTheme] = useState<Theme>();

  useEffect(() => {
    if (resumeId) {
      setActiveResume(resumeId);
    }
  }, [resumeId, setActiveResume]);

  useEffect(() => {
    if (currentResume?.content) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent(currentResume.content);
    }
  }, [currentResume?.content]);

  useAutoSave(content, resumeId);

  const placeholders = useMemo(
    () => ({
      title: currentResume?.title ?? 'Untitled resume',
    }),
    [currentResume?.title],
  );

  return (
    <Stack>
      <Header canGoBack={true} title={resumeId ? "Edit Resume" : "Create Resume"} subtitle="Craft professional resumes with live preview and auto-save." />
      <Stack spacing={4} padding={4}>
        <Typography variant="h4">{placeholders.title}</Typography>
        
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

        </Box>
      </Stack>
    </Stack>
  );
};

export default ResumeEditor;

