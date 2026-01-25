'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAstrologerProfilesQuery, useActivateAstrologerMutation, useDeactivateAstrologerMutation } from '@/store/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Search, Edit, Power, PowerOff, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function getStatusBadge(profile: any) {
  if (!profile.isActive) {
    return { variant: 'destructive' as const, label: 'Inactive', color: 'bg-red-100 text-red-800 border-red-200' };
  }
  // Only show "Pending Approval" if profile status is 'pending_review' (actually submitted for review)
  // Not for 'draft' status (astrologer hasn't submitted yet)
  if (profile.profileStatus === 'pending_review') {
    return { variant: 'secondary' as const, label: 'Pending Approval', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  return { variant: 'default' as const, label: 'Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
}

function getPricingStatus(profile: any) {
  const pricing = profile.servicePricing || [];
  const hasPending = pricing.some((p: any) => !p.isApproved && p.price !== null);
  const allApproved = pricing.length > 0 && pricing.every((p: any) => p.isApproved || p.price === null);
  
  if (hasPending) {
    return { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  if (allApproved) {
    return { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  return { label: 'Not Set', color: 'bg-gray-100 text-gray-800 border-gray-200' };
}

export default function AdminAstrologersPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetAstrologerProfilesQuery();
  const [activateAstrologer] = useActivateAstrologerMutation();
  const [deactivateAstrologer] = useDeactivateAstrologerMutation();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading astrologers...</div>
        </div>
      </div>
    );
  }

  const profiles = data?.data || [];

  const filteredProfiles = profiles.filter((profile: any) => {
    const user = profile.user;
    if (!user) return false;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleToggleActive = async (profile: any, activate: boolean) => {
    try {
      if (activate) {
        await activateAstrologer(profile.id).unwrap();
        toast.success('Astrologer activated successfully');
      } else {
        await deactivateAstrologer(profile.id).unwrap();
        toast.success('Astrologer deactivated successfully');
      }
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Astrologers Management</h1>
          <p className="text-gray-600 mt-1.5">Manage all astrologer profiles</p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">All Astrologers</CardTitle>
              <p className="text-sm text-gray-500 mt-1">View and manage astrologer accounts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search astrologers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[80px] font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Experience</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Profile</TableHead>
                  <TableHead className="font-semibold">Pricing</TableHead>
                  <TableHead className="font-semibold">Visibility</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      No astrologers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile: any) => {
                    const user = profile.user;
                    const statusBadge = getStatusBadge(profile);
                    const pricingStatus = getPricingStatus(profile);
                    
                    return (
                      <TableRow key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium">{profile.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user?.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                              </div>
                            )}
                            <span className="font-medium">{user?.name || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user?.email || 'N/A'}</TableCell>
                        <TableCell>
                          {profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant} className={`${statusBadge.color} border px-2.5 py-0.5`}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.profileStatus === 'approved' && profile.profileApproved ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5">
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              Approved
                            </Badge>
                          ) : profile.profileStatus === 'pending_review' ? (
                            <Badge className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              Pending Review
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border border-gray-200 px-2.5 py-0.5">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              Draft
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${pricingStatus.color} border px-2.5 py-0.5`}>
                            {pricingStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.isVisible ? 'default' : 'outline'} className="px-2.5 py-0.5">
                            {profile.isVisible ? 'Visible' : 'Hidden'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => router.push(`/admin/astrologers/${profile.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 hover:bg-gray-100"
                              onClick={() => router.push(`/admin/astrologers/${profile.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Button>
                            {profile.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleToggleActive(profile, false)}
                              >
                                <PowerOff className="w-4 h-4" />
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleToggleActive(profile, true)}
                              >
                                <Power className="w-4 h-4" />
                                Activate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {filteredProfiles.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 font-medium">
              Showing {filteredProfiles.length} of {profiles.length} astrologers
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
