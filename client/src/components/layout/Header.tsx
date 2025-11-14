import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import { ArrowBackOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  canGoBack?: boolean;
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ canGoBack = false,
  title = 'Resume Builder',
  subtitle = 'Craft professional resumes with live preview and auto-save.'
}) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const displayName =
    typeof user?.fullName === 'string'
      ? (user.fullName as string)
      : typeof user?.username === 'string'
        ? (user.username as string)
        : 'Guest';
  const email =
    typeof user?.email === 'string' ? (user.email as string) : undefined;

  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {canGoBack && (
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowBackOutlined />
            </Button>
          )}
          <Box>
            <Typography variant="h6" color="text.primary">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" color="text.primary">
                {displayName}
              </Typography>
              {email && (
                <Typography variant="caption" color="text.secondary">
                  {email}
                </Typography>
              )}
            </Box>
            <Button variant="ghost" onClick={signOut}>
              Sign out
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

