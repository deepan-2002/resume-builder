import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SectionCard from '../SectionCard';
import Button from '../../../common/Button';

const linkSchema = z
  .string()
  .url('Enter a valid URL')
  .or(z.literal(''))
  .optional();

const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  headline: z.string().min(2, 'Headline is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  linkedin: linkSchema,
  website: linkSchema,
  location: z.string().min(2, 'Location is required'),
  summary: z.string().min(30, 'Add at least 30 characters'),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  defaultValues?: {
    fullName?: string;
    headline?: string;
    summary?: string;
    contact?: {
      email?: string;
      phone?: string;
      linkedin?: string;
      website?: string;
      location?: string;
    };
  };
  onSubmit: (values: PersonalInfoFormValues) => Promise<void>;
  onBack?: () => void;
  saving?: boolean;
}

const PersonalInfoForm = ({
  defaultValues,
  onSubmit,
  onBack,
  saving,
}: PersonalInfoFormProps) => {
  const normalizedDefaults = useMemo<PersonalInfoFormValues>(
    () => ({
      fullName: defaultValues?.fullName ?? '',
      headline: defaultValues?.headline ?? '',
      email: defaultValues?.contact?.email ?? '',
      phone: defaultValues?.contact?.phone ?? '',
      linkedin: defaultValues?.contact?.linkedin ?? '',
      website: defaultValues?.contact?.website ?? '',
      location: defaultValues?.contact?.location ?? '',
      summary: defaultValues?.summary ?? '',
    }),
    [defaultValues],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: normalizedDefaults,
    mode: 'onBlur',
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <SectionCard
      title="Personal Information"
      subtitle="Provide your core profile details and contact information."
      actions={
        <>
          <Stack direction="row" spacing={2}>
            {onBack && (
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" isLoading={saving || isSubmitting} onClick={submitHandler}>
              Save & Continue
            </Button>
          </Stack>
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Full Name"
            fullWidth
            {...register('fullName')}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Professional Headline"
            fullWidth
            {...register('headline')}
            error={Boolean(errors.headline)}
            helperText={errors.headline?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Email"
            fullWidth
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Phone Number"
            fullWidth
            {...register('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="LinkedIn"
            fullWidth
            {...register('linkedin')}
            error={Boolean(errors.linkedin)}
            helperText={errors.linkedin?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Website / Portfolio"
            fullWidth
            {...register('website')}
            error={Boolean(errors.website)}
            helperText={errors.website?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Location"
            fullWidth
            {...register('location')}
            error={Boolean(errors.location)}
            helperText={errors.location?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Professional Summary"
            fullWidth
            multiline
            minRows={4}
            {...register('summary')}
            error={Boolean(errors.summary)}
            helperText={
              errors.summary?.message ?? (
                <Typography variant="caption" color="text.secondary">
                  Highlight key achievements and strengths (min. 30 characters).
                </Typography>
              )
            }
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};

export default PersonalInfoForm;

