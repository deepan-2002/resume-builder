import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton, Stack, TextField, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ResumeSectionItem } from '../../../../types/resume.types';
import SectionCard from '../SectionCard';
import Button from '../../../common/Button';

const entrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().min(2, 'Subtitle is required'),
  startDate: z.string().min(2, 'Start date required'),
  endDate: z.string().optional(),
  description: z.string().min(10, 'Add at least 10 characters'),
});

type TimelineEntryFormValue = z.infer<typeof entrySchema>;

interface TimelineSectionFormValues {
  entries: TimelineEntryFormValue[];
}

const buildSchema = (minEntries: number) =>
  z.object({
    entries: z
      .array(entrySchema)
      .min(minEntries, `Add at least ${minEntries} entr${minEntries === 1 ? 'y' : 'ies'}.`),
  }) satisfies z.ZodType<TimelineSectionFormValues>;

interface TimelineSectionFormProps {
  title: string;
  subtitle: string;
  defaultValues?: ResumeSectionItem[];
  minEntries?: number;
  isOptional?: boolean;
  onSubmit: (entries: ResumeSectionItem[]) => Promise<void>;
  onBack?: () => void;
  onSkip?: () => void;
  saving?: boolean;
}

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const createEmptyEntry = (): TimelineEntryFormValue => ({
  id: generateId(),
  title: '',
  subtitle: '',
  description: '',
  startDate: '',
  endDate: '',
});

const mapDefaults = (entries?: ResumeSectionItem[]): TimelineEntryFormValue[] =>
  entries?.map((entry) => ({
    id: entry.id ?? generateId(),
    title: entry.title ?? '',
    subtitle: entry.subtitle ?? '',
    startDate: entry.startDate ?? '',
    endDate: entry.endDate ?? '',
    description: entry.description ?? '',
  })) ?? [];

const TimelineSectionForm = ({
  title,
  subtitle,
  defaultValues,
  minEntries = 1,
  isOptional,
  onSubmit,
  onBack,
  onSkip,
  saving,
}: TimelineSectionFormProps) => {
  const schema = useMemo<z.ZodType<TimelineSectionFormValues>>(
    () => (isOptional ? buildSchema(0) : buildSchema(minEntries)),
    [isOptional, minEntries],
  );
  const typedSchema = schema as z.ZodType<
    TimelineSectionFormValues,
    z.ZodTypeDef,
    TimelineSectionFormValues
  >;

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<TimelineSectionFormValues>({
    resolver: zodResolver<TimelineSectionFormValues, undefined, TimelineSectionFormValues>(
      typedSchema,
    ),
    defaultValues: {
      entries:
        defaultValues?.length && defaultValues.length > 0
          ? mapDefaults(defaultValues)
          : isOptional
            ? []
            : [createEmptyEntry()],
    },
  });

  const { fields, append, remove } = useFieldArray<TimelineSectionFormValues, 'entries'>({
    control,
    name: 'entries',
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(
      values.entries.map(
        (entry): ResumeSectionItem => ({
          id: entry.id ?? generateId(),
          title: entry.title,
          subtitle: entry.subtitle,
          startDate: entry.startDate,
          endDate: entry.endDate,
          description: entry.description,
        }),
      ),
    );
  });

  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Stack direction="row" spacing={1}>
              {onBack && (
                <Button type="button" variant="ghost" onClick={onBack}>
                  Back
                </Button>
              )}
              {isOptional && onSkip && (
                <Button type="button" variant="secondary" onClick={onSkip}>
                  Skip
                </Button>
              )}
            </Stack>
            <Button
              type="submit"
              isLoading={saving || isSubmitting}
              onClick={submitHandler}
            >
              Save & Continue
            </Button>
          </Stack>
        </>
      }
    >
      <Stack spacing={4}>
        {fields.map((field, index) => (
          <Stack
            key={field.id}
            spacing={2}
            sx={{
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Title"
                  fullWidth
                  {...register(`entries.${index}.title` as const)}
                  error={Boolean(errors.entries?.[index]?.title)}
                  helperText={errors.entries?.[index]?.title?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Subtitle"
                  fullWidth
                  {...register(`entries.${index}.subtitle` as const)}
                  error={Boolean(errors.entries?.[index]?.subtitle)}
                  helperText={errors.entries?.[index]?.subtitle?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Start Date"
                  fullWidth
                  {...register(`entries.${index}.startDate` as const)}
                  error={Boolean(errors.entries?.[index]?.startDate)}
                  helperText={errors.entries?.[index]?.startDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="End Date"
                  fullWidth
                  {...register(`entries.${index}.endDate` as const)}
                  error={Boolean(errors.entries?.[index]?.endDate)}
                  helperText={errors.entries?.[index]?.endDate?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                  {...register(`entries.${index}.description` as const)}
                  error={Boolean(errors.entries?.[index]?.description)}
                  helperText={errors.entries?.[index]?.description?.message}
                />
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="flex-end">
              <Tooltip title="Remove entry">
                <span>
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1 && !isOptional}
                  >
                    <DeleteOutline />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        ))}
        <Button
          type="button"
          variant="secondary"
          startIcon={<AddOutlined />}
          onClick={() => append(createEmptyEntry())}
        >
          Add Another
        </Button>
      </Stack>
    </SectionCard>
  );
};

export default TimelineSectionForm;

