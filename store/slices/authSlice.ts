import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/authApi';
import { clearLegacyToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  sessionChecked: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.sessionChecked = true;
      state.error = null;
      clearLegacyToken();
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionChecked = true;
      state.error = null;
      clearLegacyToken();
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      state.error = null;
      clearLegacyToken();
    },
    setSessionChecked: (state, action: PayloadAction<boolean>) => {
      state.sessionChecked = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setSessionChecked,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectSessionChecked = (state: { auth: AuthState }) =>
  state.auth.sessionChecked;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role || null;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === 'admin';
export const selectIsAstrologer = (state: { auth: AuthState }) =>
  state.auth.user?.role === 'astrologer';
export const selectIsImpersonating = (state: { auth: AuthState }) =>
  Boolean(state.auth.user?.impersonation?.active);
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
