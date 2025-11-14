import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';

const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const displayName =
    typeof user?.fullName === 'string'
      ? (user.fullName as string)
      : typeof user?.username === 'string'
        ? (user.username as string)
        : 'Guest';
  const email =
    typeof user?.email === 'string' ? (user.email as string) : undefined;

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h6" color="text.primary">
            Resume Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Craft professional resumes with live preview and auto-save.
          </Typography>
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

