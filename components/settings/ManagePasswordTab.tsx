'use client';

import { useState } from 'react';
import {
  useChangePasswordMutation,
  useSetPasswordMutation,
} from '@/store/api/authApi';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, KeyRound } from 'lucide-react';

export function ManagePasswordTab() {
  const { user } = useAuth();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [setPassword, { isLoading: isSettingPassword }] = useSetPasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isGoogleUser = user?.provider === 'google';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to change password';
      toast.error(message);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await setPassword({ newPassword }).unwrap();
      toast.success('Password set successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to set password';
      toast.error(message);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Manage Password
        </CardTitle>
        <CardDescription>
          {isGoogleUser
            ? 'Set a password so you can also sign in with email and password'
            : 'Change your password'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGoogleUser ? (
          <form onSubmit={handleSetPassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-gray-50"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSettingPassword}>
              <KeyRound className="h-4 w-4 mr-2" />
              {isSettingPassword ? 'Setting...' : 'Set password'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Your current password"
                required
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="bg-gray-50"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isChangingPassword}>
              <KeyRound className="h-4 w-4 mr-2" />
              {isChangingPassword ? 'Changing...' : 'Change password'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
