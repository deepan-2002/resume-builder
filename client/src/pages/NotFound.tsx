import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Stack spacing={2} alignItems="center">
      <Typography variant="h3" color="text.primary" fontWeight={600}>
        404
      </Typography>
      <Typography variant="h5" color="text.primary" textAlign="center">
        The page you are looking for doesn&apos;t exist.
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Check the URL or go back to the dashboard to continue building your resumes.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back to Dashboard
      </Button>
    </Stack>
  </Box>
);

export default NotFound;


