'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetProfileQuery } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { useSelector } from 'react-redux';
import { selectToken } from '@/store/slices/authSlice';

export function ProfileChecker() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  
  const { error } = useGetProfileQuery(undefined, {
    skip: !token, // Skip if no token
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    // If profile fetch fails with 401, logout user
    if (error && 'status' in error && error.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return null; // This component doesn't render anything
}
