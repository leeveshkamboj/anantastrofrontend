'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { CosmicCard } from '@/components/ui/CosmicCard';
import { Container } from '@/components/layout/Container';
import { DecorativePlanets } from '@/components/layout/DecorativePlanets';
import { AstrologerRegisterHero } from '@/components/astrologer/register/AstrologerRegisterHero';
import { useCreateAstrologerRequestMutation, useUploadFileMutation, useGetMyAstrologerRequestQuery } from '@/store/api/astrologerApi';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useGetPredefinedLanguagesQuery } from '@/store/api/astrologerProfileApi';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { toast } from 'sonner';
import { Upload, X, FileText, ChevronLeft, ChevronRight, Check, CheckCircle2, XCircle, Clock, Mail, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';

const EXPERTISE_OPTIONS = [
  'Vedic Astrology',
  'Western Astrology',
  'Numerology',
  'Palmistry',
  'Tarot Reading',
  'Vastu Shastra',
  'Gemology',
  'Face Reading',
  'Kundli Analysis',
  'Matchmaking',
  'Career Guidance',
  'Health Astrology',
  'Financial Astrology',
];

export default function AstrologerRegisterPage() {
  const t = useTranslations('astrologer');
  const router = useRouter();
  const user = useSelector(selectUser);
  const { data: profileData } = useGetProfileQuery();
  const { data: myRequestData, refetch: refetchMyRequest } = useGetMyAstrologerRequestQuery();
  
  const [createRequest, { isLoading: isSubmittingRequest }] = useCreateAstrologerRequestMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  
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
  const predefinedLanguages = languagesData?.data || [];
  
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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [panPreview, setPanPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const myRequest = myRequestData?.data;
  
  // If user has a rejected request and can reapply, allow showing form
  const canShowForm = !myRequest || (myRequest.status === 'rejected' && myRequest.canReapply && showForm);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Step 2: About Yourself
    bio: '',
    yearsOfExperience: '',
    education: '',
    languages: [] as string[],
    
    // Step 3: Expertise
    expertise: [] as string[],
    customExpertise: '',
    consultationFee: '',
    preferredHours: '',
    
    // Step 4: Documents
    aadharCard: null as File | null,
    panCard: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill form data from user profile
  useEffect(() => {
    const profileUser = profileData?.data || user;
    if (profileUser) {
      setFormData((prev) => ({
        ...prev,
        name: profileUser.name || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        dateOfBirth: profileUser.dateOfBirth ? new Date(profileUser.dateOfBirth).toISOString().split('T')[0] : '',
      }));
    }
  }, [profileData, user]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      if (!formData.dateOfBirth.trim()) {
        newErrors.dateOfBirth = 'Date of birth is required';
      }
    }

    if (step === 2) {
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required';
      } else if (formData.bio.length < 200) {
        newErrors.bio = 'Bio must be at least 200 characters';
      } else if (formData.bio.length > 1000) {
        newErrors.bio = 'Bio must not exceed 1000 characters';
      }
      if (!formData.yearsOfExperience.trim()) {
        newErrors.yearsOfExperience = 'Years of experience is required';
      } else {
        const years = parseInt(formData.yearsOfExperience);
        if (isNaN(years) || years < 0 || years > 100) {
          newErrors.yearsOfExperience = 'Years of experience must be between 0 and 100';
        }
      }
      if (!formData.education.trim()) {
        newErrors.education = 'Education/Qualifications is required';
      }
      if (formData.languages.length === 0) {
        newErrors.languages = 'At least one language is required';
      }
    }

    if (step === 3) {
      if (formData.expertise.length === 0) {
        newErrors.expertise = 'At least one expertise is required';
      }
      if (formData.expertise.includes('Others') && !formData.customExpertise.trim()) {
        newErrors.customExpertise = 'Please specify your custom expertise';
      }
      if (!formData.consultationFee.trim()) {
        newErrors.consultationFee = 'Consultation fee is required';
      } else {
        const fee = parseFloat(formData.consultationFee);
        if (isNaN(fee) || fee < 0) {
          newErrors.consultationFee = 'Consultation fee must be 0 or greater';
        }
      }
      if (!formData.preferredHours.trim()) {
        newErrors.preferredHours = 'Preferred consultation hours is required';
      }
    }

    if (step === 4) {
      if (!formData.aadharCard) newErrors.aadharCard = 'Aadhar card is required';
      if (!formData.panCard) newErrors.panCard = 'PAN card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (field: 'aadharCard' | 'panCard', file: File | null) => {
    setFormData({ ...formData, [field]: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'aadharCard') {
          setAadharPreview(reader.result as string);
        } else {
          setPanPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (field === 'aadharCard') {
        setAadharPreview(null);
      } else {
        setPanPreview(null);
      }
    }
  };

  const toggleExpertise = (expertise: string) => {
    if (expertise === 'Others') {
      if (formData.expertise.includes('Others')) {
        setFormData({
          ...formData,
          expertise: formData.expertise.filter(e => e !== 'Others'),
          customExpertise: '',
        });
      } else {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, 'Others'],
        });
      }
    } else {
      if (formData.expertise.includes(expertise)) {
        setFormData({
          ...formData,
          expertise: formData.expertise.filter(e => e !== expertise),
        });
      } else {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, expertise],
        });
      }
    }
  };

  const onSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    try {
      // First, upload both files and get UUIDs
      if (!formData.aadharCard || !formData.panCard) {
        toast.error(t('uploadBothDocs'));
        return;
      }

      toast.loading(t('uploadingDocs'), { id: 'upload' });
      
      let aadharUploadResult, panUploadResult;
      
      try {
        [aadharUploadResult, panUploadResult] = await Promise.all([
          uploadFile({ file: formData.aadharCard, type: 'aadhar_card' }).unwrap(),
          uploadFile({ file: formData.panCard, type: 'pan_card' }).unwrap(),
        ]);
      } catch (uploadErr: any) {
        toast.dismiss('upload');
        const uploadError = uploadErr?.data?.message || uploadErr?.message || 'Failed to upload documents';
        toast.error(uploadError);
        return;
      }

      if (!aadharUploadResult?.isSuccess || !panUploadResult?.isSuccess) {
        toast.dismiss('upload');
        toast.error(t('uploadFailed'));
        return;
      }

      if (!aadharUploadResult.data?.uuid || !panUploadResult.data?.uuid) {
        toast.dismiss('upload');
        toast.error(t('uploadInvalid'));
        return;
      }

      toast.loading(t('creatingRequest'), { id: 'upload' });

      // Then, create the astrologer request with UUIDs
      const requestResult = await createRequest({
        aadharCardUuid: aadharUploadResult.data.uuid,
        panCardUuid: panUploadResult.data.uuid,
        bio: formData.bio,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        education: formData.education,
        languages: formData.languages.join(', '),
        expertise: formData.expertise,
        customExpertise: formData.customExpertise || undefined,
        consultationFee: parseFloat(formData.consultationFee),
        preferredHours: formData.preferredHours,
      }).unwrap();

      toast.dismiss('upload');

      // If we get here, the request was successful (201 status)
      // Refetch my request and show success message
      await refetchMyRequest();
      setShowSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        bio: '',
        yearsOfExperience: '',
        education: '',
        languages: [],
        expertise: [],
        customExpertise: '',
        consultationFee: '',
        preferredHours: '',
        aadharCard: null,
        panCard: null,
      });
      setAadharPreview(null);
      setPanPreview(null);
      setCurrentStep(1);
    } catch (err: any) {
      toast.dismiss('upload');
      // Check if it's actually a success (201 status)
      if (err?.status === 201 || err?.originalStatus === 201) {
        // It's a success, refetch and show success
        await refetchMyRequest();
        setShowSuccess(true);
      } else {
        const errorMessage = err?.data?.message || err?.message || t('registerFailed');
        toast.error(errorMessage);
      }
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  // If user already has a request and not showing form, show status view
  if (myRequest && !showSuccess && !canShowForm) {
    const getStatusIcon = () => {
      switch (myRequest.status) {
        case 'approved':
          return <CheckCircle2 className="w-16 h-16 text-green-500" />;
        case 'rejected':
          return <XCircle className="w-16 h-16 text-red-500" />;
        case 'pending':
        default:
          return <Clock className="w-16 h-16 text-orange-500" />;
      }
    };

    const getStatusColor = () => {
      switch (myRequest.status) {
        case 'approved':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'rejected':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'pending':
        default:
          return 'bg-orange-50 border-orange-200 text-orange-800';
      }
    };

    const getStatusText = () => {
      switch (myRequest.status) {
        case 'approved':
          return 'Your application has been approved! You are now a verified astrologer.';
        case 'rejected':
          return 'Your application has been rejected.';
        case 'pending':
        default:
          return 'Your application is under review.';
      }
    };

    return (
      <ProtectedRoute>
        <div className="bg-white text-gray-900">
          <AstrologerRegisterHero />
          <section className="relative overflow-hidden px-6 py-12 lg:px-24">
            <DecorativePlanets variant="register-status" />
            <Container size="narrow" className="relative z-10">
              <CosmicCard variant="glass" padding="md" className="w-full items-stretch text-left">
                <div className="mb-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      {myRequest.status === 'pending' && (
                        <div className="absolute inset-0 animate-ping rounded-full bg-orange-200" />
                      )}
                      <div className="relative">{getStatusIcon()}</div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-astro-purple">Application Status</h2>
                  <p className="mt-4 text-lg text-gray-600">{getStatusText()}</p>
                </div>
                <div className="space-y-6">
                <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
                  <div className="flex items-center justify-center mb-4">
                    <Badge
                      variant={myRequest.status === 'approved' ? 'default' : myRequest.status === 'rejected' ? 'destructive' : 'secondary'}
                      className={`text-lg px-4 py-2 ${myRequest.status === 'approved' ? 'text-white' : 'text-gray-800'}`}
                    >
                      {myRequest.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {myRequest.status === 'pending' && (
                    <div className="text-center space-y-3">
                      <Mail className="w-12 h-12 mx-auto text-orange-500 animate-bounce-slow" />
                      <p className="text-base leading-relaxed">
                        Your application is being reviewed by our team. You will receive a reply via email within{' '}
                        <span className="font-semibold">10-15 business days</span>.
                      </p>
                      <p className="text-sm mt-3">
                        Please check your email inbox (and spam folder) for updates on your application status.
                      </p>
                    </div>
                  )}

                  {myRequest.status === 'approved' && (
                    <div className="text-center space-y-3">
                      <p className="text-base leading-relaxed">
                        Congratulations! You can now start providing consultations on AnantAstro.
                      </p>
                    </div>
                  )}

                  {myRequest.status === 'rejected' && (
                    <div className="text-center space-y-3">
                      {myRequest.rejectionNote && (
                        <div className="bg-white rounded-lg p-4 mt-4 text-left">
                          <p className="font-semibold mb-2">Rejection Note:</p>
                          <p className="text-sm text-gray-700">{myRequest.rejectionNote}</p>
                        </div>
                      )}
                      {!myRequest.canReapply && (
                        <p className="text-sm mt-3">
                          You cannot reapply at this time. Please contact support if you have questions.
                        </p>
                      )}
                      {myRequest.canReapply && (
                        <div className="mt-4">
                          <CosmicButton
                            onClick={() => {
                              setShowForm(true);
                            }}
                          >
                            Apply Again
                          </CosmicButton>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Submitted on:</span>{' '}
                    {new Date(myRequest.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {myRequest.updatedAt !== myRequest.createdAt && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Last updated:</span>{' '}
                      {new Date(myRequest.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <CosmicButton onClick={() => router.push('/')}>
                    Go to Homepage
                  </CosmicButton>
                </div>
                </div>
              </CosmicCard>
            </Container>
          </section>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-white text-gray-900">
        <AstrologerRegisterHero />
        <section className="relative overflow-hidden px-6 pb-16 pt-4 lg:px-24">
          <DecorativePlanets variant="register-form" />
          <Container size="narrow" className="relative z-10">
            <CosmicCard variant="glass" padding="md" className="w-full items-stretch text-left">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-astro-purple">Application Form</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Complete all steps to submit your astrologer registration
                </p>
            
            {/* Success Message */}
            {showSuccess && (
              <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 animate-slide-up">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
                    <div className="relative bg-green-500 rounded-full p-4 animate-scale-in">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-green-800 mb-2 animate-fade-in">
                  Application Submitted Successfully!
                </h3>
                <p className="text-center text-green-700 animate-fade-in-delay">
                  Your request to become an astrologer has been received. Your application is being reviewed by our team. You will receive a reply via email within{' '}
                  <span className="font-semibold">10-15 business days</span>.
                </p>
                <div className="mt-4 flex justify-center">
                  <CosmicButton
                    onClick={async () => {
                      setShowSuccess(false);
                      await refetchMyRequest();
                    }}
                    variant="outline"
                  >
                    View Status
                  </CosmicButton>
                </div>
              </div>
            )}
            
            {/* Show form only if no request exists, or if showing form after rejection */}
            {(!myRequest || canShowForm) && !showSuccess && (
              <>
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
                    <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-astro-orange transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="mt-6 flex items-center justify-between">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-1 flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step === currentStep
                            ? 'border-astro-orange bg-astro-orange text-white'
                            : step < currentStep
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        {step < currentStep ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="font-semibold">{step}</span>
                        )}
                      </div>
                      <span className="mt-2 text-center text-xs text-gray-600">
                        {step === 1 && 'Basic Info'}
                        {step === 2 && 'About You'}
                        {step === 3 && 'Expertise'}
                        {step === 4 && 'Documents'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
              </div>
          {(!myRequest || canShowForm) && !showSuccess && (
            <div className="mt-6">
              {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold text-astro-purple">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date || '' })}
                    placeholder="Select your date of birth"
                    error={!!errors.dateOfBirth}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>
              </div>
            )}

            {/* Step 2: About Yourself */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold text-astro-purple">About Yourself</h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/Description *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your background, and why you want to become an astrologer (200-1000 characters)"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={errors.bio ? 'border-red-500' : ''}
                    rows={6}
                  />
                  <div className="flex justify-between items-center">
                    {errors.bio ? (
                      <p className="text-sm text-red-600">{errors.bio}</p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {formData.bio.length}/1000 characters (minimum 200)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="Enter years of experience"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className={errors.yearsOfExperience ? 'border-red-500' : ''}
                    min="0"
                    max="100"
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-sm text-red-600">{errors.yearsOfExperience}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education/Qualifications *</Label>
                  <Textarea
                    id="education"
                    placeholder="Enter your educational background and qualifications"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className={errors.education ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {errors.education && <p className="text-sm text-red-600">{errors.education}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Languages Spoken *</Label>
                  
                  {/* Selected Languages Badges */}
                  {formData.languages.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.languages.map((lang) => (
                          <Badge 
                            key={lang} 
                            variant="secondary" 
                            className="flex items-center gap-1 pr-1"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  languages: formData.languages.filter(l => l !== lang),
                                });
                              }}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
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
                        className={`pl-10 ${errors.languages ? 'border-red-500' : ''}`}
                      />
                    </div>
                    
                    {/* Dropdown */}
                    {showLanguageDropdown && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
                        {isLoadingLanguages ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Searching...
                          </div>
                        ) : predefinedLanguages.length > 0 ? (
                          <div className="py-1">
                            {predefinedLanguages
                              .filter(lang => !formData.languages.includes(lang.name))
                              .map((language) => (
                                <button
                                  key={language.id}
                                  type="button"
                                  onClick={() => {
                                    if (!formData.languages.includes(language.name)) {
                                      setFormData({
                                        ...formData,
                                        languages: [...formData.languages, language.name],
                                      });
                                    }
                                    setLanguageSearch('');
                                    setShowLanguageDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                                >
                                  <Check className={`h-4 w-4 ${formData.languages.includes(language.name) ? 'text-astro-orange' : 'text-transparent'}`} />
                                  <span className="text-sm">{language.name}</span>
                                </button>
                              ))}
                            {predefinedLanguages.filter(lang => !formData.languages.includes(lang.name)).length === 0 && (
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
                  
                  {errors.languages && (
                    <p className="text-sm text-red-600">{errors.languages}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Expertise & Specialization */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold text-astro-purple">Expertise & Specialization</h3>
                <div className="space-y-2">
                  <Label>Select Your Expertise *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {EXPERTISE_OPTIONS.map((expertise) => (
                      <label
                        key={expertise}
                        className={`flex cursor-pointer items-center space-x-2 rounded-2xl border-2 p-3 transition-colors ${
                          formData.expertise.includes(expertise)
                            ? 'border-astro-orange bg-astro-orange/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.expertise.includes(expertise)}
                          onChange={() => toggleExpertise(expertise)}
                          className="w-4 h-4 text-astro-orange border-gray-300 rounded focus:ring-astro-orange"
                        />
                        <span className="text-sm">{expertise}</span>
                      </label>
                    ))}
                  </div>
                  {errors.expertise && (
                    <p className="text-sm text-red-600">{errors.expertise}</p>
                  )}
                  
                  {/* Selected Expertise Badges */}
                  {formData.expertise.length > 0 && (
                    <div className="mt-4">
                      <Label>Selected Expertise:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.expertise.map((exp) => (
                          <Badge key={exp} variant="secondary">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Expertise Input */}
                  {formData.expertise.includes('Others') && (
                    <div className="mt-4">
                      <Label htmlFor="customExpertise">Specify Your Custom Expertise *</Label>
                      <Input
                        id="customExpertise"
                        type="text"
                        placeholder="Enter your custom expertise"
                        value={formData.customExpertise}
                        onChange={(e) => setFormData({ ...formData, customExpertise: e.target.value })}
                        className={errors.customExpertise ? 'border-red-500' : ''}
                      />
                      {errors.customExpertise && (
                        <p className="text-sm text-red-600">{errors.customExpertise}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee *</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    placeholder="Enter your consultation fee"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className={errors.consultationFee ? 'border-red-500' : ''}
                    min="0"
                    step="0.01"
                  />
                  {errors.consultationFee && (
                    <p className="text-sm text-red-600">{errors.consultationFee}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredHours">Preferred Consultation Hours *</Label>
                  <Input
                    id="preferredHours"
                    type="text"
                    placeholder="e.g., 9 AM - 6 PM IST, Monday to Friday"
                    value={formData.preferredHours}
                    onChange={(e) => setFormData({ ...formData, preferredHours: e.target.value })}
                    className={errors.preferredHours ? 'border-red-500' : ''}
                  />
                  {errors.preferredHours && <p className="text-sm text-red-600">{errors.preferredHours}</p>}
                </div>
              </div>
            )}

            {/* Step 4: KYC Documents */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="mb-4 text-lg font-semibold text-astro-purple">KYC Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="aadharCard">Aadhar Card *</Label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="aadharCard"
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input
                        id="aadharCard"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange('aadharCard', e.target.files?.[0] || null)}
                      />
                    </label>
                    {aadharPreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        {formData.aadharCard?.type.startsWith('image/') ? (
                          <img src={aadharPreview} alt="Aadhar preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileChange('aadharCard', null)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.aadharCard && (
                    <p className="text-sm text-red-600">{errors.aadharCard}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panCard">PAN Card *</Label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="panCard"
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input
                        id="panCard"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange('panCard', e.target.files?.[0] || null)}
                      />
                    </label>
                    {panPreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        {formData.panCard?.type.startsWith('image/') ? (
                          <img src={panPreview} alt="PAN preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleFileChange('panCard', null)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.panCard && (
                    <p className="text-sm text-red-600">{errors.panCard}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <CosmicButton
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </CosmicButton>
              
              {currentStep < 4 ? (
                <CosmicButton type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </CosmicButton>
              ) : (
                <CosmicButton
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmittingRequest || isUploading}
                >
                  {isSubmittingRequest || isUploading ? 'Submitting...' : 'Submit Application'}
                </CosmicButton>
              )}
            </div>
            </div>
          )}
            </CosmicCard>
          </Container>
        </section>
      </div>
    </ProtectedRoute>
  );
}
