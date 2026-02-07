'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/authApi';
import { useUploadFileMutation } from '@/store/api/astrologerApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { User, Camera } from 'lucide-react';

export function BasicInfoTab() {
  const { data: profileData } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

  const profile = profileData?.data;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setDateOfBirth(profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : undefined);
      setProfileImageUrl(profile.profileImage || null);
    }
  }, [profile]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        profileImage: profileImageUrl || undefined,
      }).unwrap();
      toast.success('Profile updated successfully');
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'data' in err &&
        typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Failed to update profile';
      toast.error(message);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG)');
      return;
    }
    try {
      toast.loading('Uploading image...', { id: 'upload-image' });
      const result = await uploadFile({ file, type: 'profile_pic' }).unwrap();
      if (result?.isSuccess && result?.data?.url) {
        setProfileImageUrl(result.data.url);
        await updateProfile({ profileImage: result.data.url }).unwrap();
        toast.success('Photo updated', { id: 'upload-image' });
      } else {
        toast.error('Upload failed', { id: 'upload-image' });
      }
    } catch {
      toast.error('Failed to upload image', { id: 'upload-image' });
    }
    e.target.value = '';
  };

  return (
    <Card className="border-0 shadow-xl bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Info
        </CardTitle>
        <CardDescription>Update your name, phone, date of birth, and profile photo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors bg-gray-100 flex items-center justify-center"
            >
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
              <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </span>
            </button>
            {isUploadingImage && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 text-white text-xs">
                Uploading...
              </span>
            )}
          </div>
          <form onSubmit={handleSaveDetails} className="flex-1 space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email ?? ''}
                disabled
                className="bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Date of birth (optional)</Label>
              <DatePicker
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder="Select date of birth"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save details'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
