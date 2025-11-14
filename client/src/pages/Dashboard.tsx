import { Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import OverviewCards from '../components/dashboard/OverviewCards';
import useResume from '../hooks/useResume';

const Dashboard = () => {
  const { resumes, loadResumes } = useResume();

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const stats = [
    { label: 'Resumes', value: String(resumes.length) },
    { label: 'Published', value: String(resumes.filter((r) => r.isPublic).length) },
    { label: 'Last Updated', value: resumes[0]?.updatedAt ?? 'N/A' },
  ];

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" color="text.primary">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quick insights across your workspace.
        </Typography>
      </div>
      <OverviewCards stats={stats} />
    </Stack>
  );
};

export default Dashboard;

