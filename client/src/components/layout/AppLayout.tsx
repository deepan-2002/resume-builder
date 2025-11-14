import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
    <Sidebar />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </Box>
);

export default AppLayout;

