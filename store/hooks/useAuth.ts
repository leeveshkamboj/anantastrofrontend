import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectUserRole,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  logout,
  setLoading,
  setError,
  clearError,
} from '../slices/authSlice';
import { useLoginMutation, useRegisterMutation, useGetProfileQuery, useLogoutMutation } from '../api/authApi';

/**
 * Custom hook for authentication operations and state
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // API hooks
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const { isLoading: isProfileLoading, refetch: refetchProfile } = useGetProfileQuery(
    undefined,
    { skip: !isAuthenticated }
  );

  // Actions
  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const result = await loginMutation({ email, password }).unwrap();
      return result;
    } catch (err) {
      const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Login failed';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    dateOfBirth?: string;
  }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const result = await registerMutation(userData).unwrap();
      return result;
    } catch (err) {
      const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Registration failed';
      dispatch(setError(errorMessage));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      await logoutMutation().unwrap();
    } catch {
      // Even if logout fails on server, clear local state
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getUser = () => {
    if (user) {
      return user;
    }
    // Try to refetch if not available
    if (isAuthenticated) {
      refetchProfile();
    }
    return user;
  };

  const getUserRole = () => {
    return userRole;
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    userRole,
    isAdmin,
    isLoading: isLoading || isLoginLoading || isRegisterLoading || isLogoutLoading || isProfileLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getUser,
    getUserRole,
    refetchProfile,
    clearError: () => dispatch(clearError()),
  };
};

