'use client';

import { useState, useEffect, useRef } from 'react';
import { useGetMyProfileQuery, useUpdateMyProfileMutation, useGetPredefinedLanguagesQuery, useGetPredefinedExpertiseQuery, useGetCurrenciesQuery, useGetTimezonesQuery, useCheckProfileCompletionQuery } from '@/store/api/astrologerProfileApi';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useUpdateUserMutation } from '@/store/api/adminApi';
import { useUploadFileMutation } from '@/store/api/astrologerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CheckCircle, Clock, X, FileText, Search, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { convertTime } from '@/lib/timezone';
import Image from 'next/image';

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export default function AstrologerProfilePage() {
  const { data: userData } = useGetProfileQuery();
  const userTimezone = userData?.data?.timezone || 'Asia/Kolkata';
  const { data: profileData, isLoading, refetch: refetchProfile } = useGetMyProfileQuery({
    timezone: userTimezone,
  });
  // Language search state
  const [languageSearch, setLanguageSearch] = useState('');
  const [debouncedLanguageSearch, setDebouncedLanguageSearch] = useState<string | undefined>(undefined);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageSearchRef = useRef<HTMLDivElement>(null);

  // Debounce language search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLanguageSearch(languageSearch.trim() || undefined);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [languageSearch]);

  // Fetch languages with search
  const { data: languagesData, isLoading: isLoadingLanguages } = useGetPredefinedLanguagesQuery(debouncedLanguageSearch);
  const { data: expertiseData } = useGetPredefinedExpertiseQuery();
  const { data: currenciesData } = useGetCurrenciesQuery();
  const { data: timezonesData } = useGetTimezonesQuery();
  const { data: completionData } = useCheckProfileCompletionQuery();
  const [updateProfile] = useUpdateMyProfileMutation();
  const [updateUser] = useUpdateUserMutation();
  const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

  const profile = profileData?.data;
  const predefinedLanguages = languagesData?.data || [];
  const predefinedExpertise = expertiseData?.data || [];
  const currencies = currenciesData?.data || [];
  const timezones = timezonesData?.data || [];

  const [formData, setFormData] = useState({
    bio: '',
    yearsOfExperience: '',
    education: '',
    isVisible: true,
    baseCurrency: 'INR',
    profileImage: '',
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedImageUuidRef = useRef<string | null>(null); // Track uploaded UUID to prevent overwriting

  const [userSettings, setUserSettings] = useState({
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [customExpertise, setCustomExpertise] = useState('');
  const [preferredHours, setPreferredHours] = useState<Record<string, { startTime: string; endTime: string; isAvailable: boolean }>>({});
  const [missingFields, setMissingFields] = useState<Set<string>>(new Set());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSearchRef.current && !languageSearchRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Auto-load user's profile image if astrologer profile doesn't have one
    const userProfileImage = userData?.data?.profileImage;
    const profileImageToUse = profile?.profileImage || userProfileImage || '';
    
    if (profile) {
      // Check if we have an uploaded UUID that hasn't been saved yet
      // If so, keep it in formData (don't overwrite with presigned URL from refetch)
      const hasUploadedUuid = uploadedImageUuidRef.current && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uploadedImageUuidRef.current);
      
      setFormData(prev => ({
        bio: profile.bio || '',
        yearsOfExperience: profile.yearsOfExperience?.toString() || '',
        education: profile.education || '',
        isVisible: profile.isVisible ?? true,
        baseCurrency: profile.baseCurrency || 'INR',
        // Keep uploaded UUID if it exists, otherwise use profile image
        profileImage: hasUploadedUuid ? uploadedImageUuidRef.current! : (profileImageToUse || ''),
      }));
      
      // Update preview with the URL (for display), but keep UUID in formData
      if (profileImageToUse) {
        setProfileImagePreview(profileImageToUse);
      }
      // If we're keeping the UUID, the preview was already set during upload, so don't overwrite it
      // Load ALL languages and expertise (both approved and pending) for editing
      setSelectedLanguages(profile.languages?.map(l => l.language) || []);
      setSelectedExpertise(profile.expertise?.map(e => e.expertise) || []);
      
      // Clear missing fields if data exists
      setMissingFields(prev => {
        const next = new Set(prev);
        if (profile.bio && profile.bio.trim() !== '') next.delete('bio');
        if (profile.yearsOfExperience) next.delete('yearsOfExperience');
        if (profile.education && profile.education.trim() !== '') next.delete('education');
        if (profile.languages && profile.languages.length > 0) next.delete('languages');
        if (profile.expertise && profile.expertise.length > 0) next.delete('expertise');
        // Check both profileImageToUse and current formData (in case UUID is set)
        const hasProfileImage = profileImageToUse || (formData.profileImage && formData.profileImage.trim() !== '');
        if (hasProfileImage) next.delete('profileImage');
        return next;
      });
      
      // Initialize preferred hours (already converted to user timezone by backend)
      const hours: Record<string, { startTime: string; endTime: string; isAvailable: boolean }> = {};
      DAYS_OF_WEEK.forEach(day => {
        const dayHours = profile.preferredHours?.find(h => h.dayOfWeek === day.value);
        hours[day.value] = {
          startTime: dayHours?.startTime?.substring(0, 5) || '09:00',
          endTime: dayHours?.endTime?.substring(0, 5) || '17:00',
          isAvailable: dayHours?.isAvailable ?? true,
        };
      });
      setPreferredHours(hours);
    } else {
      // No profile yet - initialize with user's profile image if available
      setFormData(prev => ({
        ...prev,
        profileImage: userProfileImage || '',
      }));
      if (userProfileImage) {
        setProfileImagePreview(userProfileImage);
        setMissingFields(prev => {
          const next = new Set(prev);
          next.delete('profileImage');
          return next;
        });
      }
      
      // Initialize with default business hours (9 AM to 5 PM) for all days
      const defaultHours: Record<string, { startTime: string; endTime: string; isAvailable: boolean }> = {};
      DAYS_OF_WEEK.forEach(day => {
        defaultHours[day.value] = {
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        };
      });
      setPreferredHours(defaultHours);
    }
  }, [profile, userData]);

  useEffect(() => {
    if (userData?.data) {
      setUserSettings({
        currency: userData.data.currency || 'INR',
        timezone: userData.data.timezone || 'Asia/Kolkata',
      });
    }
  }, [userData]);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Single API call to update everything - no validation for drafts
      await updateProfile({
        bio: formData.bio?.trim() || undefined,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : undefined,
        education: formData.education?.trim() || undefined,
        isVisible: formData.isVisible,
        baseCurrency: formData.baseCurrency,
        profileImage: formData.profileImage || undefined,
        languages: selectedLanguages,
        expertise: selectedExpertise,
        preferredHours: DAYS_OF_WEEK.map(day => ({
          dayOfWeek: day.value as any,
          startTime: preferredHours[day.value]?.startTime || undefined,
          endTime: preferredHours[day.value]?.endTime || undefined,
          isAvailable: preferredHours[day.value]?.isAvailable ?? true,
        })),
        submitForReview: false, // No validation, only type checking
      }).unwrap();
      
      // Clear the uploaded UUID ref after successful save
      uploadedImageUuidRef.current = null;
      toast.success('Profile saved as draft successfully.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save profile');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImageFile(file);

    // Create temporary preview from local file for immediate feedback
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      toast.loading('Uploading image...', { id: 'upload-image' });
      // Pass type='profile_pic' to create media record with correct type
      const uploadResult = await uploadFile({ file, type: 'profile_pic' }).unwrap();
      
      if (uploadResult?.isSuccess && uploadResult?.data) {
        // Use UUID (GUID) for storage, URL for preview
        const uuid = uploadResult.data.uuid;
        const previewUrl = uploadResult.data.url;
        
        // Update formData with UUID (not URL)
        setFormData(prev => ({ ...prev, profileImage: uuid }));
        // Track the uploaded UUID to prevent overwriting on refetch
        uploadedImageUuidRef.current = uuid;
        // Update preview to use the uploaded URL (for display)
        setProfileImagePreview(previewUrl);
        // Clear missing fields validation
        setMissingFields(prev => {
          const next = new Set(prev);
          next.delete('profileImage');
          return next;
        });
        toast.success('Image uploaded successfully', { id: 'upload-image' });
      } else {
        // Reset preview and file on failure
        setProfileImagePreview(null);
        setProfileImageFile(null);
        toast.error('Failed to upload image', { id: 'upload-image' });
      }
    } catch (error: any) {
      // Reset preview and file on error
      setProfileImagePreview(null);
      setProfileImageFile(null);
      toast.error(error?.data?.message || 'Failed to upload image', { id: 'upload-image' });
    }
    
    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setFormData({ ...formData, profileImage: '' });
    uploadedImageUuidRef.current = null; // Clear the ref when removing image
    setMissingFields(prev => new Set(prev).add('profileImage'));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitForReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check which fields are missing
    const missing = new Set<string>();
    if (!formData.bio || formData.bio.trim() === '') {
      missing.add('bio');
    }
    if (!formData.yearsOfExperience || formData.yearsOfExperience.trim() === '') {
      missing.add('yearsOfExperience');
    }
    if (!formData.education || formData.education.trim() === '') {
      missing.add('education');
    }
    if (selectedLanguages.length === 0) {
      missing.add('languages');
    }
    if (selectedExpertise.length === 0) {
      missing.add('expertise');
    }
    if (!formData.profileImage || formData.profileImage.trim() === '') {
      missing.add('profileImage');
    }

    setMissingFields(missing);

    // If there are missing fields, highlight them and show error
    if (missing.size > 0) {
      const missingList = Array.from(missing).map(field => {
        switch (field) {
          case 'bio': return 'Bio';
          case 'yearsOfExperience': return 'Years of Experience';
          case 'education': return 'Education';
          case 'languages': return 'Languages (at least one)';
          case 'expertise': return 'Expertise (at least one)';
          case 'profileImage': return 'Profile Image';
          default: return field;
        }
      }).join(', ');
      
      toast.error(`Please complete the following required fields: ${missingList}`);
      
      // Scroll to first missing field
      const firstMissing = Array.from(missing)[0];
      const element = document.getElementById(firstMissing);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Clear missing fields if all are complete
    setMissingFields(new Set());

    try {
      // Single API call to update everything
      await updateProfile({
        bio: formData.bio?.trim() || undefined,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : undefined,
        education: formData.education?.trim() || undefined,
        isVisible: formData.isVisible,
        baseCurrency: formData.baseCurrency,
        profileImage: formData.profileImage || undefined,
        languages: selectedLanguages,
        expertise: selectedExpertise,
        preferredHours: DAYS_OF_WEEK.map(day => ({
          dayOfWeek: day.value as any,
          startTime: preferredHours[day.value]?.startTime || undefined,
          endTime: preferredHours[day.value]?.endTime || undefined,
          isAvailable: preferredHours[day.value]?.isAvailable ?? true,
        })),
        submitForReview: true, // This will validate if true, otherwise just type validation
      }).unwrap();
      
      // Clear the uploaded UUID ref after successful save
      uploadedImageUuidRef.current = null;
      toast.success('Profile submitted for review successfully. You will be notified once it is reviewed.');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to submit profile for review';
      toast.error(errorMessage);
      
      // If validation failed, re-check and highlight missing fields
      if (errorMessage.includes('complete') || errorMessage.includes('required')) {
        // Re-validate to highlight fields
        const missing = new Set<string>();
        if (!formData.bio || formData.bio.trim() === '') missing.add('bio');
        if (!formData.yearsOfExperience || formData.yearsOfExperience.trim() === '') missing.add('yearsOfExperience');
        if (!formData.education || formData.education.trim() === '') missing.add('education');
        if (selectedLanguages.length === 0) missing.add('languages');
        if (selectedExpertise.length === 0) missing.add('expertise');
        if (!formData.profileImage || formData.profileImage.trim() === '') missing.add('profileImage');
        setMissingFields(missing);
      }
    }
  };

  const handleUserSettingsUpdate = async () => {
    try {
      await updateUser({
        id: userData!.data.id,
        data: {
          currency: userSettings.currency,
          timezone: userSettings.timezone,
        },
      }).unwrap();
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update settings');
    }
  };

  const removeLanguage = (lang: string) => {
    const newLanguages = selectedLanguages.filter(l => l !== lang);
    setSelectedLanguages(newLanguages);
    if (newLanguages.length === 0) {
      setMissingFields(prev => new Set(prev).add('languages'));
    }
  };

  const toggleExpertise = (exp: string) => {
    let newExpertise: string[];
    if (selectedExpertise.includes(exp)) {
      newExpertise = selectedExpertise.filter(e => e !== exp);
    } else {
      newExpertise = [...selectedExpertise, exp];
    }
    setSelectedExpertise(newExpertise);
    if (newExpertise.length > 0) {
      setMissingFields(prev => {
        const next = new Set(prev);
        next.delete('expertise');
        return next;
      });
    } else {
      setMissingFields(prev => new Set(prev).add('expertise'));
    }
  };

  const addCustomExpertise = () => {
    if (customExpertise.trim() && !selectedExpertise.includes(customExpertise.trim())) {
      const newExpertise = [...selectedExpertise, customExpertise.trim()];
      setSelectedExpertise(newExpertise);
      setCustomExpertise('');
      if (newExpertise.length > 0) {
        setMissingFields(prev => {
          const next = new Set(prev);
          next.delete('expertise');
          return next;
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1.5">Manage your astrologer profile information</p>
        </div>
        <div className="flex items-center gap-2">
          {profile?.profileStatus === 'approved' ? (
            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              Approved
            </Badge>
          ) : profile?.profileStatus === 'pending_review' ? (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Pending Review
            </Badge>
          ) : (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Draft
            </Badge>
          )}
        </div>
      </div>

      {/* Status Message */}
      {profile?.profileStatus === 'draft' && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800 font-medium">
                {completionData?.data?.isComplete
                  ? "Your profile is saved as draft. You can submit it for review when you're ready."
                  : 'Your profile is saved as draft. Complete all required fields to submit for review.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.profileStatus === 'pending_review' && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-amber-800 font-medium">
                Your profile is pending admin approval. You'll be notified once reviewed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.profileStatus === 'approved' && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 shadow-sm">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-emerald-800 font-medium">
                Your profile is approved and visible to users. Any changes will require re-approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSaveDraft} className="space-y-6">
        {/* Profile Image Upload */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Profile Picture</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Upload your professional profile picture {missingFields.has('profileImage') && <span className="text-red-500">*</span>}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="shrink-0">
                {profileImagePreview ? (
                  <div className="relative">
                    <Image
                      src={profileImagePreview}
                      alt="Profile preview"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className={`w-[120px] h-[120px] rounded-full bg-gray-100 border-4 ${missingFields.has('profileImage') ? 'border-red-500' : 'border-gray-200'} flex items-center justify-center`}>
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <Label htmlFor="profile-image-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingImage ? 'Uploading...' : profileImagePreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Recommended: Square image, at least 400x400 pixels. Max size: 5MB
                </p>
                {missingFields.has('profileImage') && (
                  <p className="text-sm text-red-500">Profile image is required for submission</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Basic Information</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your professional details and background</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio {missingFields.has('bio') && <span className="text-red-500">*</span>}</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => {
                  setFormData({ ...formData, bio: e.target.value });
                  if (e.target.value.trim() !== '') {
                    setMissingFields(prev => {
                      const next = new Set(prev);
                      next.delete('bio');
                      return next;
                    });
                  }
                }}
                maxLength={2000}
                rows={6}
                placeholder="Tell us about yourself, your experience, and your approach to astrology..."
                className={missingFields.has('bio') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/2000 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience {missingFields.has('yearsOfExperience') && <span className="text-red-500">*</span>}</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) => {
                  setFormData({ ...formData, yearsOfExperience: e.target.value });
                  if (e.target.value.trim() !== '') {
                    setMissingFields(prev => {
                      const next = new Set(prev);
                      next.delete('yearsOfExperience');
                      return next;
                    });
                  }
                }}
                placeholder="e.g., 10"
                className={missingFields.has('yearsOfExperience') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education {missingFields.has('education') && <span className="text-red-500">*</span>}</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => {
                  setFormData({ ...formData, education: e.target.value });
                  if (e.target.value.trim() !== '') {
                    setMissingFields(prev => {
                      const next = new Set(prev);
                      next.delete('education');
                      return next;
                    });
                  }
                }}
                maxLength={500}
                rows={3}
                placeholder="Your educational background and certifications..."
                className={missingFields.has('education') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.education.length}/500 characters
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isVisible">Profile Visibility</Label>
                <p className="text-sm text-gray-500">Show your profile in public listings</p>
              </div>
              <Switch
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Languages</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Languages you can communicate in</p>
          </CardHeader>
          <CardContent className={`space-y-4 ${missingFields.has('languages') ? 'border-2 border-red-500 rounded-lg p-4 bg-red-50/30' : ''}`}>
            <div className="space-y-3">
              <Label>Languages Spoken {missingFields.has('languages') && <span className="text-red-500">* (at least one required)</span>}</Label>
              
              {/* Selected Languages Badges */}
              {selectedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((lang) => (
                    <Badge 
                      key={lang} 
                      variant="secondary" 
                      className="flex items-center gap-1 pr-1"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Search Input and Dropdown */}
              <div className="relative" ref={languageSearchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={languageSearch ? "Search languages..." : "Search to add languages (showing 6 most common)"}
                    value={languageSearch}
                    onChange={(e) => {
                      setLanguageSearch(e.target.value);
                      setShowLanguageDropdown(true);
                    }}
                    onFocus={() => setShowLanguageDropdown(true)}
                    className="pl-10"
                  />
                </div>
                
                {/* Dropdown */}
                {showLanguageDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingLanguages ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : predefinedLanguages.length > 0 ? (
                      <div className="py-1">
                        {predefinedLanguages
                          .filter(lang => !selectedLanguages.includes(lang.name))
                          .map((language) => (
                            <button
                              key={language.id}
                              type="button"
                              onClick={() => {
                                if (!selectedLanguages.includes(language.name)) {
                                  const newLanguages = [...selectedLanguages, language.name];
                                  setSelectedLanguages(newLanguages);
                                  if (newLanguages.length > 0) {
                                    setMissingFields(prev => {
                                      const next = new Set(prev);
                                      next.delete('languages');
                                      return next;
                                    });
                                  }
                                }
                                setLanguageSearch('');
                                setShowLanguageDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                            >
                              <Check className={`h-4 w-4 ${selectedLanguages.includes(language.name) ? 'text-primary' : 'text-transparent'}`} />
                              <span className="text-sm text-black">{language.name}</span>
                            </button>
                          ))}
                        {predefinedLanguages.filter(lang => !selectedLanguages.includes(lang.name)).length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            All available languages are selected
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        {languageSearch ? 'No languages found' : 'Loading languages...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border border-gray-200 shadow-sm ${missingFields.has('expertise') ? 'border-red-500' : ''}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Expertise</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your areas of specialization</p>
          </CardHeader>
          <CardContent className={`space-y-4 ${missingFields.has('expertise') ? 'bg-red-50/30 rounded-lg p-4' : ''}`}>
            <div className="space-y-2">
              <Label>Select Expertise Tags {missingFields.has('expertise') && <span className="text-red-500">* (at least one required)</span>}</Label>
              <div className="flex flex-wrap gap-2">
                {predefinedExpertise.map((exp) => (
                  <Badge
                    key={exp.id}
                    variant={selectedExpertise.includes(exp.name) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleExpertise(exp.name)}
                  >
                    {exp.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Custom Expertise</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Or add custom expertise"
                  value={customExpertise}
                  onChange={(e) => setCustomExpertise(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomExpertise();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomExpertise} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedExpertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="flex items-center gap-1">
                  {exp}
                  <button
                    type="button"
                    onClick={() => {
                      const newExpertise = selectedExpertise.filter(e => e !== exp);
                      setSelectedExpertise(newExpertise);
                      if (newExpertise.length === 0) {
                        setMissingFields(prev => new Set(prev).add('expertise'));
                      }
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Preferred Hours</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your availability schedule</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="flex items-center gap-4">
                <div className="w-24">
                  <Label className="block mb-0">{day.label}</Label>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={preferredHours[day.value]?.startTime || ''}
                    onChange={(e) => setPreferredHours({
                      ...preferredHours,
                      [day.value]: {
                        ...preferredHours[day.value],
                        startTime: e.target.value,
                        isAvailable: preferredHours[day.value]?.isAvailable ?? true,
                      },
                    })}
                    disabled={!preferredHours[day.value]?.isAvailable}
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={preferredHours[day.value]?.endTime || ''}
                    onChange={(e) => setPreferredHours({
                      ...preferredHours,
                      [day.value]: {
                        ...preferredHours[day.value],
                        endTime: e.target.value,
                        isAvailable: preferredHours[day.value]?.isAvailable ?? true,
                      },
                    })}
                    disabled={!preferredHours[day.value]?.isAvailable}
                  />
                  <Switch
                    checked={preferredHours[day.value]?.isAvailable ?? true}
                    onCheckedChange={(checked) => setPreferredHours({
                      ...preferredHours,
                      [day.value]: {
                        startTime: preferredHours[day.value]?.startTime || '',
                        endTime: preferredHours[day.value]?.endTime || '',
                        isAvailable: checked,
                      },
                    })}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="submit" 
            size="lg" 
            variant="outline"
            disabled={profile?.profileStatus === 'pending_review'}
            className="min-w-[140px] shadow-sm"
          >
            Save Draft
          </Button>
          <Button 
            type="button" 
            size="lg"
            onClick={handleSubmitForReview}
            disabled={profile?.profileStatus === 'pending_review'}
            className="min-w-[160px] shadow-sm"
          >
            Submit for Review
          </Button>
        </div>
      </form>
    </div>
  );
}
