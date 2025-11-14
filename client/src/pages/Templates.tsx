import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  fetchTemplateCategories,
  fetchTemplates,
} from '../store/slices/templateSlice';

const Templates = () => {
  const dispatch = useAppDispatch();
  const { items, categories, loading } = useAppSelector(
    (state) => state.templates,
  );

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" color="text.primary">
          Templates
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick a template to apply to your resume.
        </Typography>
      </div>

      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
        {categories.map((category) => (
          <Chip key={category} label={category} variant="outlined" />
        ))}
      </Stack>

      {loading && <Alert severity="info">Loading templates…</Alert>}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        }}
      >
        {items.map((template) => (
          <Card key={template.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{template.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {template.description}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: 'block', mt: 1 }}
              >
                {template.category ?? 'General'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default Templates;

