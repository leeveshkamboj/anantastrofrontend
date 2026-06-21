import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store';
import {
  selectUser,
  selectIsAuthenticated,
  selectSessionChecked,
  selectUserRole,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  logout,
  setLoading,
  setError,
  clearError,
} from '../slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLogoutMutation,
} from '../api/authApi';
import { parseFetchBaseError } from '@/lib/api-errors';

/**
 * Custom hook for authentication operations and state
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const sessionChecked = useSelector(selectSessionChecked);
  const userRole = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const { isLoading: isProfileLoading, refetch: refetchProfile } = useGetProfileQuery(
    undefined,
    { skip: sessionChecked && !isAuthenticated },
  );

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
    timeOfBirth?: string;
    placeOfBirth?: string;
  }) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const result = await registerMutation(userData).unwrap();
      return result;
    } catch (err) {
      const fe = parseFetchBaseError(err);
      const errorMessage = fe.message || 'Registration failed';
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
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getUser = () => {
    if (user) {
      return user;
    }
    if (isAuthenticated) {
      refetchProfile();
    }
    return user;
  };

  const getUserRole = () => userRole;

  return {
    user,
    isAuthenticated,
    sessionChecked,
    userRole,
    isAdmin,
    isLoading:
      isLoading || isLoginLoading || isRegisterLoading || isLogoutLoading || isProfileLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getUser,
    getUserRole,
    refetchProfile,
    clearError: () => dispatch(clearError()),
  };
};
