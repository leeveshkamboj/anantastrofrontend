'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetUserQuery } from '@/store/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { ArrowLeft, Edit } from 'lucide-react';

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case 'admin':
      return { variant: 'default' as const, color: 'bg-purple-100 text-purple-800' };
    case 'astrologer':
      return { variant: 'secondary' as const, color: 'bg-green-100 text-green-800' };
    default:
      return { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' };
  }
}

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);
  
  const { data, isLoading, error } = useGetUserQuery(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">User not found</p>
          <Button onClick={() => router.push('/admin/users')} variant="outline">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const user = data.data;
  const badgeConfig = getRoleBadgeVariant(user.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/users')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-1">View user information</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Information</CardTitle>
            <Button
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <Badge 
                variant={badgeConfig.variant}
                className={`${badgeConfig.color} mt-2`}
              >
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-500">User ID</Label>
              <p className="mt-1 font-medium">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Phone</Label>
              <p className="mt-1">{user.phone || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
              <p className="mt-1">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Provider</Label>
              <p className="mt-1 capitalize">{user.provider || 'local'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Role</Label>
              <p className="mt-1">
                <Badge variant={badgeConfig.variant} className={badgeConfig.color}>
                  {user.role}
                </Badge>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Created At</Label>
              <p className="mt-1">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
              <p className="mt-1">{new Date(user.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {user.profileImage && (
            <div>
              <Label className="text-sm font-medium text-gray-500">Profile Image</Label>
              <div className="mt-2">
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover border"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
