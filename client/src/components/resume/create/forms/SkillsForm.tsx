import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import SectionCard from '../SectionCard';
import Button from '../../../common/Button';

const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Skill is required'),
});

const skillsSchema = z.object({
  skills: z.array(skillItemSchema).min(1, 'Add at least one skill.'),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  defaultValues?: string[];
  onSubmit: (skills: string[]) => Promise<void>;
  onBack?: () => void;
  saving?: boolean;
}

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const toSkillItems = (skills?: string[]): SkillsFormValues['skills'] =>
  skills?.map((skill) => ({
    id: generateId(),
    name: skill,
  })) ?? [];

const createEmptySkill = () => ({ id: generateId(), name: '' });

const SkillsForm = ({ defaultValues, onSubmit, onBack, saving }: SkillsFormProps) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills:
        defaultValues && defaultValues.length > 0 ? toSkillItems(defaultValues) : [createEmptySkill()],
    },
  });

  const { fields, append, remove } = useFieldArray<SkillsFormValues, 'skills'>({
    control,
    name: 'skills',
  });

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(
      values.skills
        .map((skill) => skill.name.trim())
        .filter((skill) => skill.length > 0),
    );
  });

  return (
    <SectionCard
      title="Skills"
      subtitle="List your core competencies and tools."
      actions={
        <>
          <Stack direction="row" spacing={2}>
            {onBack && (
              <Button type="button" variant="ghost" onClick={onBack}>
                Back
              </Button>
            )}
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
      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Grid container spacing={2} key={field.id}>
            <Grid size={{ xs: 12, md: 10 }}>
              <TextField
                label={`Skill ${index + 1}`}
                fullWidth
                {...register(`skills.${index}.name` as const)}
                error={Boolean(errors.skills?.[index]?.name)}
                helperText={errors.skills?.[index]?.name?.message}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 2 }}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <IconButton
                color="error"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <DeleteOutline />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          type="button"
          variant="secondary"
          startIcon={<AddOutlined />}
          onClick={() => append(createEmptySkill())}
        >
          Add Skill
        </Button>
      </Stack>
    </SectionCard>
  );
};

export default SkillsForm;

