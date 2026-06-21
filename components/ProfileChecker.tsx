'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetProfileQuery } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { clearLegacyToken } from '@/lib/auth';

export function ProfileChecker() {
  const dispatch = useDispatch();

  useEffect(() => {
    clearLegacyToken();
  }, []);

  const { error } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error && 'status' in error && error.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return null;
}
