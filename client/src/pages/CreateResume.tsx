import {
  Alert,
  Box,
  Paper,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateSelector from '../components/resume/create/TemplateSelector';
import PersonalInfoForm, {
  type PersonalInfoFormValues,
} from '../components/resume/create/forms/PersonalInfoForm';
import TimelineSectionForm from '../components/resume/create/forms/TimelineSectionForm';
import SkillsForm from '../components/resume/create/forms/SkillsForm';
import PreviewStep from '../components/resume/create/PreviewStep';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchTemplates } from '../store/slices/templateSlice';
import useCreateResumeWizard from '../hooks/useCreateResumeWizard';
import type { ResumeSectionItem, TemplateSummary } from '../types/resume.types';
import Button from '../components/common/Button';

const steps = [
  { key: 'template', label: 'Template' },
  { key: 'personal', label: 'Personal Info' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'preview', label: 'Preview' },
] as const;

type StepKey = (typeof steps)[number]['key'];

const CreateResume = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: templates, loading: templatesLoading } = useAppSelector(
    (state) => state.templates,
  );

  const {
    content,
    templateId,
    saving,
    error,
    lastSavedAt,
    updateTemplate,
    saveSection,
  } = useCreateResumeWizard();

  useEffect(() => {
    if (!templates.length) {
      dispatch(fetchTemplates());
    }
  }, [dispatch, templates.length]);

  const initialStepIndex = templateId ? 1 : 0;
  const [activeStep, setActiveStep] = useState(initialStepIndex);
  const [pendingTemplateId, setPendingTemplateId] = useState<number | undefined>(
    templateId,
  );
  const [completed, setCompleted] = useState<Record<StepKey, boolean>>(
    steps.reduce(
      (acc, step) => ({
        ...acc,
        [step.key]: step.key === 'template' ? Boolean(templateId) : false,
      }),
      {} as Record<StepKey, boolean>,
    ),
  );

  const markComplete = (key: StepKey) =>
    setCompleted((prev) => ({
      ...prev,
      [key]: true,
    }));

  const goToNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));

  const goToPrevious = () =>
    setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (index: number) => {
    if (
      index <= activeStep ||
      completed[steps[index].key] ||
      steps[index].key === 'template'
    ) {
      setActiveStep(index);
    }
  };

  const handleTemplateConfirm = async () => {
    if (!pendingTemplateId) {
      return;
    }
    await updateTemplate(pendingTemplateId);
    markComplete('template');
    setActiveStep(1);
  };

  const handlePersonalSubmit = async (values: PersonalInfoFormValues) => {
    await saveSection('personalInfo', {
      fullName: values.fullName,
      headline: values.headline,
      summary: values.summary,
      contact: {
        email: values.email,
        phone: values.phone,
        linkedin: values.linkedin || undefined,
        website: values.website || undefined,
        location: values.location || undefined,
      },
    });
    markComplete('personal');
    goToNext();
  };

  const handleTimelineSubmit = async (
    key: 'education' | 'experience' | 'projects' | 'certifications',
    entries: ResumeSectionItem[],
  ) => {
    await saveSection(key, entries);
    markComplete(key);
    goToNext();
  };

  const handleSkillsSubmit = async (skills: string[]) => {
    await saveSection('skills', skills);
    markComplete('skills');
    goToNext();
  };

  const handleSkipOptional = async (key: 'projects' | 'certifications') => {
    await saveSection(key, []);
    markComplete(key);
    goToNext();
  };

  const handleFinish = useCallback(() => {
    navigate('/resumes');
  }, [navigate]);

  const handlePreviewTemplateChange = async (template: TemplateSummary) => {
    setPendingTemplateId(template.id);
    await updateTemplate(template.id);
  };

  const renderCurrentStep = () => {
    const step = steps[activeStep];
    switch (step.key) {
      case 'template':
        return (
          <TemplateSelector
            templates={templates}
            selectedTemplateId={pendingTemplateId}
            onSelect={(template) => setPendingTemplateId(template.id)}
            loading={templatesLoading}
            onContinue={handleTemplateConfirm}
            disableContinue={saving}
          />
        );
      case 'personal':
        return (
          <PersonalInfoForm
            defaultValues={{
              fullName: content.personalInfo?.fullName,
              headline: content.personalInfo?.headline,
              summary: content.personalInfo?.summary,
              contact: content.personalInfo?.contact,
            }}
            onSubmit={handlePersonalSubmit}
            onBack={goToPrevious}
            saving={saving}
          />
        );
      case 'education':
        return (
          <TimelineSectionForm
            title="Education"
            subtitle="Add your academic background."
            defaultValues={content.education}
            onSubmit={(entries) => handleTimelineSubmit('education', entries)}
            onBack={goToPrevious}
            saving={saving}
          />
        );
      case 'experience':
        return (
          <TimelineSectionForm
            title="Work Experience"
            subtitle="Showcase your professional journey."
            defaultValues={content.experience}
            onSubmit={(entries) => handleTimelineSubmit('experience', entries)}
            onBack={goToPrevious}
            saving={saving}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            defaultValues={content.skills}
            onSubmit={handleSkillsSubmit}
            onBack={goToPrevious}
            saving={saving}
          />
        );
      case 'projects':
        return (
          <TimelineSectionForm
            title="Projects"
            subtitle="Highlight optional portfolio projects."
            defaultValues={content.projects}
            onSubmit={(entries) => handleTimelineSubmit('projects', entries)}
            onBack={goToPrevious}
            onSkip={() => handleSkipOptional('projects')}
            isOptional
            saving={saving}
            minEntries={0}
          />
        );
      case 'certifications':
        return (
          <TimelineSectionForm
            title="Certifications"
            subtitle="List optional certifications or badges."
            defaultValues={content.certifications}
            onSubmit={(entries) => handleTimelineSubmit('certifications', entries)}
            onBack={goToPrevious}
            onSkip={() => handleSkipOptional('certifications')}
            isOptional
            saving={saving}
            minEntries={0}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            content={content}
            templates={templates}
            selectedTemplateId={templateId}
            onTemplateChange={handlePreviewTemplateChange}
            onBack={goToPrevious}
            onFinish={handleFinish}
            saving={saving}
            error={error}
            lastSavedAt={lastSavedAt}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={600}>
          Create a Professional Resume
        </Typography>
        <Typography color="text.secondary">
          Follow the guided steps to capture your story, with autosave and live preview.
        </Typography>
      </Box>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step.key} completed={completed[step.key]}>
              <StepButton color="inherit" onClick={() => handleStepClick(index)}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        {lastSavedAt && (
          <Typography variant="caption" color="text.secondary" textAlign="center" mt={2}>
            Last saved at {new Date(lastSavedAt).toLocaleTimeString()}
          </Typography>
        )}
      </Paper>
      {error && activeStep !== steps.length - 1 && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {renderCurrentStep()}
      <Stack direction="row" justifyContent="flex-start">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateResume;

