import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import { NavLink, useLocation } from 'react-router-dom';
import { BallotOutlined } from '@mui/icons-material';

const links = [
  { label: 'Dashboard', to: '/', icon: <DashboardOutlinedIcon /> },
  { label: 'My Resumes', to: '/resumes', icon: <BallotOutlined /> },
  { label: 'Templates', to: '/templates', icon: <StyleOutlinedIcon /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        width: 260,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Paper
        square
        elevation={0}
        sx={{
          minHeight: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h6" color="text.primary">
            Resume Builder
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Make your resume stand out
          </Typography>
        </Box>
        <Divider />
        <List disablePadding>
          {links.map((link) => {
            const isActive = link.to === '/' ? location.pathname === link.to : location.pathname.startsWith(link.to);
            return (
              <ListItemButton
                key={link.to}
                component={NavLink}
                to={link.to}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                  primary={link.label}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default Sidebar;

