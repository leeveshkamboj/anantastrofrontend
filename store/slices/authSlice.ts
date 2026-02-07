import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/authApi';
import { getToken, removeToken, setToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? getToken() : null,
  isAuthenticated: typeof window !== 'undefined' ? getToken() !== null : false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      setToken(action.payload.token);
    },
    /** Sets only the token (e.g. after OAuth). Use before refetching profile so API requests include the Bearer token. */
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      setToken(action.payload);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      // Immediately clear token from Redux state first
      // This ensures APIs stop using the token right away
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Then remove from localStorage
      removeToken();
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

export const { setCredentials, setAuthToken, setUser, logout, setLoading, setError, clearError } =
  authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role || null;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === 'admin';
export const selectIsAstrologer = (state: { auth: AuthState }) =>
  state.auth.user?.role === 'astrologer';
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;

