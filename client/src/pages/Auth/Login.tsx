import {
  Alert,
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const { signIn, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn({ username, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          variant="outlined"
          sx={{ p: 4, borderRadius: 4 }}
        >
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your dashboard.
              </Typography>
            </div>

            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="primary"
              isLoading={loading}
            >
              Sign in
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

