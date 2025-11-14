import api from './api';

export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export const authService = {
  async login(credentials: Credentials) {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(payload: Record<string, unknown>) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

