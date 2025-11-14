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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      <OverviewCards stats={stats} />
    </div>
  );
};

export default Dashboard;

