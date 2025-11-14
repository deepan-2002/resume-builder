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

  const handleSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent((prev) => ({ ...prev, summary: event.target.value }));

  const placeholders = useMemo(
    () => ({
      title: currentResume?.title ?? 'Untitled resume',
    }),
    [currentResume?.title],
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Editing</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          {placeholders.title}
        </h2>
      </div>

      <EditorToolbar
        onThemeChange={setTheme}
        onExportPdf={() => currentResume && generatePdf(currentResume)}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Summary (auto-saves every 2s)
          </h3>
          <textarea
            className="h-48 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={content.summary ?? ''}
            onChange={handleSummaryChange}
            placeholder="Describe your experience, strengths, and career goals."
          />
        </section>
        <ResumePreview content={content} theme={theme} />
      </div>
    </div>
  );
};

export default ResumeEditor;

