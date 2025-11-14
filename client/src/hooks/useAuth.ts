import { useCallback, useMemo } from 'react';
import type { Credentials } from '../services/auth.service';
import { fetchProfile, login, logout } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);

  const signIn = useCallback(
    async (credentials: Credentials) => {
      const result = await dispatch(login(credentials));
      if (login.fulfilled.match(result)) {
        await dispatch(fetchProfile());
      }
      return result;
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const hydratedUser = useMemo(() => user ?? {}, [user]);

  return {
    user: hydratedUser,
    token,
    loading,
    error,
    signIn,
    signOut,
    refreshProfile: () => dispatch(fetchProfile()),
    isAuthenticated: Boolean(token ?? user),
  };
};

export default useAuth;

