'use client';

import { useGetMyProfileQuery, useCheckProfileCompletionQuery } from '@/store/api/astrologerProfileApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  Eye,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  User,
} from 'lucide-react';

export default function AstrologerDashboardPage() {
  const { data, isLoading } = useGetMyProfileQuery();
  const { data: completionData } = useCheckProfileCompletionQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const profile = data?.data;
  const unreadCount = profile?.unreadNotificationsCount || 0;

  const stats = [
    {
      title: 'Total Consultations',
      value: profile?.totalConsultations || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Rating',
      value: profile?.rating ? profile.rating.toFixed(1) : 'N/A',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Profile Views',
      value: '0', // TODO: Add profile views tracking
      icon: Eye,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Unread Notifications',
      value: unreadCount,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      urgent: unreadCount > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1.5">Welcome back! Here's an overview of your account</p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm px-4 py-1.5 font-semibold shadow-sm">
            {unreadCount} New Notification{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Profile Status Alert */}
      {!profile && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-base">Complete Your Profile</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Get started by completing your astrologer profile to begin offering services.
                  </p>
                </div>
              </div>
              <Link href="/astrologer/profile">
                <Button className="shadow-sm">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {profile && profile.profileStatus === 'draft' && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-base">Complete Your Profile</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {completionData?.data?.isComplete
                      ? "Your profile is saved as draft. Submit it for review when you're ready."
                      : 'Your profile is saved as draft. Complete all required fields to submit for review.'}
                  </p>
                </div>
              </div>
              <Link href="/astrologer/profile">
                <Button className="shadow-sm">
                  {completionData?.data?.isComplete ? 'Submit for Review' : 'Complete Profile'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {profile && profile.profileStatus === 'pending_review' && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 shadow-sm">
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-base">Profile Pending Approval</p>
                <p className="text-sm text-amber-700 mt-1">
                  Your profile is pending admin approval. You'll be notified once it's reviewed. You cannot set prices until your profile is approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {profile && profile.profileStatus === 'approved' && (
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 shadow-sm">
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900 text-base">Profile Approved</p>
                <p className="text-sm text-emerald-700 mt-1">
                  Your profile is live and you can set your service prices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.borderColor ? `border ${stat.borderColor}` : ''}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                {stat.urgent && (
                  <div className="text-xs text-red-600 mt-2 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Action required
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Access frequently used features</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/astrologer/profile"
              className="group p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Update Profile</h3>
              </div>
              <p className="text-sm text-gray-600">Edit your bio, experience, and details</p>
            </Link>
            <Link
              href="/astrologer/services"
              className="group p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Manage Pricing</h3>
              </div>
              <p className="text-sm text-gray-600">Set prices for your services</p>
            </Link>
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="font-semibold text-gray-500">View Consultations</h3>
              </div>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
