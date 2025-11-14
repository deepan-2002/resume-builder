import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import type { Credentials } from '../../services/auth.service';

interface AuthState {
  token: string | null;
  user: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: Credentials) => {
    return authService.login(credentials);
  },
);

export const fetchProfile = createAsyncThunk('auth/me', async () => {
  return authService.me();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token =
          action.payload.accessToken ??
          action.payload.access_token ??
          null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to login';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.data ?? action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

