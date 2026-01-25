'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  useGetAstrologerProfileQuery,
  useUpdateAstrologerProfileMutation,
  useApproveProfileMutation,
  useRejectProfileMutation,
  useApprovePricingMutation,
  useRejectPricingMutation,
  useActivateAstrologerMutation,
  useDeactivateAstrologerMutation,
} from '@/store/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CheckCircle, Clock, X, ArrowLeft, Power, PowerOff, User, Mail, Calendar, DollarSign, Globe } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminAstrologerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { data, isLoading, refetch } = useGetAstrologerProfileQuery(id);
  const [updateProfile] = useUpdateAstrologerProfileMutation();
  const [approveProfile] = useApproveProfileMutation();
  const [rejectProfile] = useRejectProfileMutation();
  const [approvePricing] = useApprovePricingMutation();
  const [rejectPricing] = useRejectPricingMutation();
  const [activateAstrologer] = useActivateAstrologerMutation();
  const [deactivateAstrologer] = useDeactivateAstrologerMutation();

  const profile = data?.data;
  const user = profile?.user;

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectType, setRejectType] = useState<'profile' | 'pricing'>('profile');
  const [rejectServiceType, setRejectServiceType] = useState<string>('');

  const [formData, setFormData] = useState({
    bio: '',
    yearsOfExperience: '',
    education: '',
    isVisible: true,
    isActive: true,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        yearsOfExperience: profile.yearsOfExperience?.toString() || '',
        education: profile.education || '',
        isVisible: profile.isVisible ?? true,
        isActive: profile.isActive ?? true,
      });
    }
  }, [profile]);

  const handleUpdate = async () => {
    try {
      await updateProfile({
        id,
        data: {
          bio: formData.bio || undefined,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
          education: formData.education || undefined,
          isVisible: formData.isVisible,
        },
      }).unwrap();
      toast.success('Profile updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleToggleActive = async () => {
    try {
      if (formData.isActive) {
        await deactivateAstrologer(id).unwrap();
        toast.success('Astrologer deactivated successfully');
      } else {
        await activateAstrologer(id).unwrap();
        toast.success('Astrologer activated successfully');
      }
      setFormData({ ...formData, isActive: !formData.isActive });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const handleApproveProfile = async () => {
    try {
      await approveProfile(id).unwrap();
      toast.success('Profile approved successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve profile');
    }
  };

  const handleRejectProfile = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await rejectProfile({ id, reason: rejectReason }).unwrap();
      toast.success('Profile rejected');
      setShowRejectDialog(false);
      setRejectReason('');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reject profile');
    }
  };

  const handleApproveAllPricing = async () => {
    try {
      await approvePricing({ id }).unwrap();
      toast.success('All pricing approved successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve pricing');
    }
  };

  const handleApproveServicePricing = async (serviceType: string) => {
    try {
      await approvePricing({ id, serviceType }).unwrap();
      toast.success(`${serviceType} pricing approved successfully`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve pricing');
    }
  };

  const handleRejectServicePricing = (serviceType: string) => {
    setRejectType('pricing');
    setRejectServiceType(serviceType);
    setShowRejectDialog(true);
  };

  const handleRejectPricingSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await rejectPricing({
        id,
        data: {
          serviceType: rejectServiceType as any,
          reason: rejectReason,
        },
      }).unwrap();
      toast.success('Pricing rejected');
      setShowRejectDialog(false);
      setRejectReason('');
      setRejectServiceType('');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reject pricing');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Profile not found</div>
      </div>
    );
  }

  const pendingPricing = profile.servicePricing?.filter((p: any) => !p.isApproved && p.price !== null) || [];
  // Only show pending approval card if profile status is 'pending_review' (actually submitted for review)
  // Not for 'draft' status (astrologer hasn't submitted yet)
  const hasPendingProfile = profile.profileStatus === 'pending_review';

  const getProfileStatusBadge = () => {
    const status = profile.profileStatus || 'draft';
    if (status === 'approved' && profile.profileApproved) {
      return { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle };
    } else if (status === 'pending_review') {
      return { label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock };
    } else {
      return { label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock };
    }
  };

  const statusBadge = getProfileStatusBadge();
  const StatusIcon = statusBadge.icon;

  const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/admin/astrologers')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="shrink-0">
              {user?.profileImage || profile?.profileImage ? (
                <Image
                  src={user?.profileImage || profile?.profileImage}
                  alt={user?.name || 'Astrologer'}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center text-white text-4xl font-semibold border-4 border-gray-200">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'Astrologer Profile'}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    {profile.yearsOfExperience && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{profile.yearsOfExperience} years experience</span>
                      </div>
                    )}
                    {profile.baseCurrency && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Currency: {profile.baseCurrency}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={`${statusBadge.color} border px-3 py-1`}>
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {statusBadge.label}
                </Badge>
                {profile.isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1">
                    <Power className="w-3.5 h-3.5 mr-1.5" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1">
                    <PowerOff className="w-3.5 h-3.5 mr-1.5" />
                    Inactive
                  </Badge>
                )}
                {profile.isVisible ? (
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1">
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    Visible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-3 py-1">
                    Hidden
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleActive}
                  className={profile.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                >
                  {profile.isActive ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Actions */}
      {hasPendingProfile && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Profile Changes Pending Approval</h3>
                    <p className="text-sm text-gray-600">
                      This astrologer has submitted profile changes that require your review before they can be published.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={handleApproveProfile} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => {
                        setRejectType('profile');
                        setShowRejectDialog(true);
                      }}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pendingPricing.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {pendingPricing.length} Pricing Change{pendingPricing.length > 1 ? 's' : ''} Pending Approval
                    </h3>
                    <p className="text-sm text-gray-600">
                      This astrologer has submitted pricing changes that require your review.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Button size="sm" onClick={handleApproveAllPricing} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Approve All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={6}
                maxLength={2000}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">{formData.bio.length}/2000</p>
            </div>

            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Education</Label>
              <Textarea
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">{formData.education.length}/500</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Visibility</Label>
                <p className="text-sm text-gray-500">Show in public listings</p>
              </div>
              <Switch
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Account Status</Label>
                <p className="text-sm text-gray-500">Active status (blocks dashboard access if inactive)</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdate} className="flex-1">
                Update Profile
              </Button>
              <Button
                onClick={handleToggleActive}
                variant={formData.isActive ? 'destructive' : 'default'}
                className="flex-1"
              >
                {formData.isActive ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-1" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-1" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Languages & Expertise */}
        <Card>
          <CardHeader>
            <CardTitle>Languages & Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {profile.languages && profile.languages.length > 0 ? (
                  profile.languages.map((lang: any) => (
                    <Badge 
                      key={lang.id} 
                      variant={lang.isApproved ? 'default' : 'outline'}
                      className={lang.isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}
                    >
                      {lang.language}
                      {!lang.isApproved && <Clock className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No languages added</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expertise</Label>
              <div className="flex flex-wrap gap-2">
                {profile.expertise && profile.expertise.length > 0 ? (
                  profile.expertise.map((exp: any) => (
                    <Badge 
                      key={exp.id} 
                      variant={exp.isApproved ? 'default' : 'outline'}
                      className={exp.isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}
                    >
                      {exp.expertise}
                      {exp.isCustom && <span className="ml-1 text-xs">(custom)</span>}
                      {!exp.isApproved && <Clock className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No expertise added</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferred Hours */}
      {profile.preferredHours && profile.preferredHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preferred Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayHours = profile.preferredHours.find((h: any) => h.dayOfWeek === day.value);
                return (
                  <div key={day.value} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{day.label}</div>
                    {dayHours && dayHours.isAvailable ? (
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {dayHours.startTime || 'Not set'} - {dayHours.endTime || 'Not set'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Not available</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.servicePricing?.map((pricing: any) => {
              const isPending = !pricing.isApproved && pricing.price !== null;
              const serviceLabels: Record<string, string> = {
                full_kundli: 'Full Kundli Generation',
                horoscope: 'Horoscope',
                matchmaking: 'Basic Matchmaking',
                consultation: 'General Consultation',
              };

              return (
                <div key={pricing.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {serviceLabels[pricing.serviceType] || pricing.serviceType}
                      </h3>
                      {pricing.isApproved ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : isPending ? (
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Set</Badge>
                      )}
                    </div>
                    {isPending && (
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" onClick={() => handleApproveServicePricing(pricing.serviceType)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectServicePricing(pricing.serviceType)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Current Price</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50 font-medium">
                        {profile.baseCurrency || '₹'}{pricing.price?.toFixed(2) || 'Not set'}
                      </div>
                    </div>
                    {pricing.approvedPrice && (
                      <div>
                        <Label className="text-sm text-gray-600">Approved Price</Label>
                        <div className="flex items-center h-10 px-3 border rounded-md bg-emerald-50 font-medium text-emerald-700">
                          {profile.baseCurrency || '₹'}{pricing.approvedPrice.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                  {pricing.rejectionReason && (
                    <div className="mt-3 text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                      <strong className="font-semibold">Rejection Reason:</strong>
                      <p className="mt-1">{pricing.rejectionReason}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject {rejectType === 'profile' ? 'Profile' : 'Pricing'} Changes
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the astrologer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rejection Reason</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Enter the reason for rejection..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectDialog(false);
              setRejectReason('');
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={rejectType === 'profile' ? handleRejectProfile : handleRejectPricingSubmit}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
