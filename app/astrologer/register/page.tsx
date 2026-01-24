'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialBackground } from '@/components/CelestialBackground';
import { useCreateAstrologerRequestMutation, useUploadFileMutation, useGetMyAstrologerRequestQuery } from '@/store/api/astrologerApi';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { toast } from 'sonner';
import { Upload, X, FileText, ChevronLeft, ChevronRight, Check, CheckCircle2, XCircle, Clock, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { useEffect } from 'react';

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
  const router = useRouter();
  const user = useSelector(selectUser);
  const { data: profileData } = useGetProfileQuery();
  const { data: myRequestData, refetch: refetchMyRequest } = useGetMyAstrologerRequestQuery();
  
  const [createRequest, { isLoading: isSubmittingRequest }] = useCreateAstrologerRequestMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  
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
    languages: '',
    
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
      if (!formData.languages.trim()) {
        newErrors.languages = 'Languages spoken is required';
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
        toast.error('Please upload both Aadhar and PAN cards');
        return;
      }

      toast.loading('Uploading documents...', { id: 'upload' });
      
      let aadharUploadResult, panUploadResult;
      
      try {
        [aadharUploadResult, panUploadResult] = await Promise.all([
          uploadFile(formData.aadharCard).unwrap(),
          uploadFile(formData.panCard).unwrap(),
        ]);
      } catch (uploadErr: any) {
        toast.dismiss('upload');
        const uploadError = uploadErr?.data?.message || uploadErr?.message || 'Failed to upload documents';
        toast.error(uploadError);
        return;
      }

      if (!aadharUploadResult?.isSuccess || !panUploadResult?.isSuccess) {
        toast.dismiss('upload');
        toast.error('Failed to upload documents. Please try again.');
        return;
      }

      if (!aadharUploadResult.data?.uuid || !panUploadResult.data?.uuid) {
        toast.dismiss('upload');
        toast.error('Invalid response from upload service. Please try again.');
        return;
      }

      toast.loading('Creating request...', { id: 'upload' });

      // Then, create the astrologer request with UUIDs
      const requestResult = await createRequest({
        aadharCardUuid: aadharUploadResult.data.uuid,
        panCardUuid: panUploadResult.data.uuid,
        bio: formData.bio,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        education: formData.education,
        languages: formData.languages,
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
        languages: '',
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
        const errorMessage = err?.data?.message || err?.message || 'Registration failed. Please try again.';
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
        <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden min-h-screen">
          <div className="w-full max-w-3xl mx-auto">
            <Card className="w-full shadow-2xl border-0 bg-white">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {myRequest.status === 'pending' && (
                      <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping"></div>
                    )}
                    <div className="relative">
                      {getStatusIcon()}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-center text-gray-900">
                  Application Status
                </CardTitle>
                <CardDescription className="text-center text-lg mt-4">
                  {getStatusText()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
                  <div className="flex items-center justify-center mb-4">
                    <Badge
                      variant={myRequest.status === 'approved' ? 'default' : myRequest.status === 'rejected' ? 'destructive' : 'secondary'}
                      className={`text-lg px-4 py-2`}
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
                          <Button
                            onClick={() => {
                              setShowForm(true);
                            }}
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Apply Again
                          </Button>
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
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Go to Homepage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CelestialBackground>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden min-h-screen">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Become an Astrologer</CardTitle>
            <CardDescription className="text-center">
              Register to become a verified astrologer on AnantAstro
            </CardDescription>
            
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
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={async () => {
                      setShowSuccess(false);
                      await refetchMyRequest();
                    }}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                  >
                    View Status
                  </Button>
                </div>
              </div>
            )}
            
            {/* Show form only if no request exists, or if showing form after rejection */}
            {(!myRequest || canShowForm) && !showSuccess && (
              <>
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
                    <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-between mt-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          step === currentStep
                            ? 'bg-primary border-primary text-white'
                            : step < currentStep
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {step < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{step}</span>
                        )}
                      </div>
                      <span className="text-xs mt-2 text-center text-gray-600">
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
          </CardHeader>
          {(!myRequest || canShowForm) && !showSuccess && (
            <CardContent>
              {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
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
                <h3 className="text-lg font-semibold mb-4">About Yourself</h3>
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
                  <Label htmlFor="languages">Languages Spoken *</Label>
                  <Input
                    id="languages"
                    type="text"
                    placeholder="e.g., English, Hindi, Sanskrit (comma-separated)"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className={errors.languages ? 'border-red-500' : ''}
                  />
                  {errors.languages && <p className="text-sm text-red-600">{errors.languages}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Expertise & Specialization */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Expertise & Specialization</h3>
                <div className="space-y-2">
                  <Label>Select Your Expertise *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {EXPERTISE_OPTIONS.map((expertise) => (
                      <label
                        key={expertise}
                        className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.expertise.includes(expertise)
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.expertise.includes(expertise)}
                          onChange={() => toggleExpertise(expertise)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
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
                <h3 className="text-lg font-semibold mb-4">KYC Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="aadharCard">Aadhar Card *</Label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="aadharCard"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
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
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
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
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmittingRequest || isUploading}
                  className="gap-2"
                >
                  {isSubmittingRequest || isUploading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
            </CardContent>
          )}
        </Card>
      </div>
    </CelestialBackground>
    </ProtectedRoute>
  );
}
