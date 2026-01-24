'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAstrologerRequestQuery, useApproveAstrologerRequestMutation, useRejectAstrologerRequestMutation, useAllowReapplyMutation } from '@/store/api/astrologerApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, X, Eye, RotateCcw, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { config } from '@/lib/config';

export default function AdminAstrologerRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = parseInt(params.id as string);
  
  const { data, isLoading, refetch } = useGetAstrologerRequestQuery(requestId);
  const [approveRequest] = useApproveAstrologerRequestMutation();
  const [rejectRequest] = useRejectAstrologerRequestMutation();
  const [allowReapply] = useAllowReapplyMutation();
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const request = data?.data;

  // Get full URL for documents
  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = config.apiUrl || 'http://localhost:3001';
    return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const handleApprove = async () => {
    try {
      await approveRequest(requestId).unwrap();
      toast.success('Request approved successfully');
      refetch();
      router.push('/admin/astrologer-requests');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      toast.error('Please provide a rejection note');
      return;
    }
    try {
      await rejectRequest({ id: requestId, rejectionNote }).unwrap();
      toast.success('Request rejected');
      setShowRejectModal(false);
      setRejectionNote('');
      refetch();
      router.push('/admin/astrologer-requests');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reject request');
    }
  };

  const handleAllowReapply = async () => {
    try {
      await allowReapply(requestId).unwrap();
      toast.success('User can now reapply');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to allow reapply');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'default', label: 'Pending', className: 'text-white' },
      approved: { variant: 'secondary', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Request not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/astrologer-requests')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Astrologer Request Details</h1>
          <p className="text-gray-600 mt-1">Request ID: {request.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {request.user?.name || 'Unknown User'}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{request.user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(request.status)}
              {/* Debug: Show raw status value */}
              <span className="text-xs text-gray-400">({request.status})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm text-gray-700 mt-1">{request.user?.name || 'Unknown'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-gray-700 mt-1">{request.user?.email || '-'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Submitted</Label>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          {request.bio && (
            <div>
              <Label className="text-sm font-medium">Bio/Description</Label>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{request.bio}</p>
            </div>
          )}

          {/* Additional Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            {request.yearsOfExperience !== null && request.yearsOfExperience !== undefined && (
              <div>
                <Label className="text-sm font-medium">Years of Experience</Label>
                <p className="text-sm text-gray-700 mt-1">{request.yearsOfExperience} years</p>
              </div>
            )}
            {request.consultationFee !== null && request.consultationFee !== undefined && (
              <div>
                <Label className="text-sm font-medium">Consultation Fee</Label>
                <p className="text-sm text-gray-700 mt-1">₹{request.consultationFee}</p>
              </div>
            )}
            {request.languages && (
              <div>
                <Label className="text-sm font-medium">Languages</Label>
                <p className="text-sm text-gray-700 mt-1">{request.languages}</p>
              </div>
            )}
            {request.preferredHours && (
              <div>
                <Label className="text-sm font-medium">Preferred Hours</Label>
                <p className="text-sm text-gray-700 mt-1">{request.preferredHours}</p>
              </div>
            )}
          </div>

          {/* Education */}
          {request.education && (
            <div>
              <Label className="text-sm font-medium">Education/Qualifications</Label>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{request.education}</p>
            </div>
          )}

          {/* Expertise */}
          {request.expertise && (
            <div>
              <Label className="text-sm font-medium">Expertise</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(Array.isArray(request.expertise) ? request.expertise : []).map((exp: string) => (
                  <Badge key={exp} variant="secondary">
                    {exp}
                  </Badge>
                ))}
              </div>
              {request.customExpertise && (
                <div className="mt-2">
                  <Label className="text-sm font-medium text-gray-600">Custom Expertise:</Label>
                  <p className="text-sm text-gray-700 mt-1">{request.customExpertise}</p>
                </div>
              )}
            </div>
          )}

          {/* KYC Documents */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium">Aadhar Card</Label>
              <div className="mt-2">
                {request.aadharCardUrl ? (
                  <a
                    href={getFullUrl(request.aadharCardUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Aadhar Card
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">PAN Card</Label>
              <div className="mt-2">
                {request.panCardUrl ? (
                  <a
                    href={getFullUrl(request.panCardUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View PAN Card
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Note */}
          {request.rejectionNote && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Label className="text-sm font-medium text-red-800">Rejection Note</Label>
              <p className="text-sm text-red-700 mt-1">{request.rejectionNote}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            {request.status?.toLowerCase() === 'pending' && (
              <>
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant="default"
                  className="!bg-red-600 hover:!bg-red-700 !text-white cursor-pointer border-0"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            {request.status?.toLowerCase() === 'rejected' && !request.canReapply && (
              <Button
                onClick={handleAllowReapply}
                variant="outline"
                className="cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Allow Reapply
              </Button>
            )}
            {/* Debug: Show status if buttons are not visible */}
            {request.status?.toLowerCase() !== 'pending' && request.status?.toLowerCase() !== 'rejected' && (
              <div className="text-sm text-gray-500">
                Status: {request.status} (Buttons only show for pending/rejected statuses)
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Submitted: {new Date(request.createdAt).toLocaleString()}
            {request.updatedAt !== request.createdAt && (
              <> | Last updated: {new Date(request.updatedAt).toLocaleString()}</>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {showRejectModal && (
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejectionNote">Rejection Note</Label>
                <Textarea
                  id="rejectionNote"
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNote('');
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleReject}
                className="!bg-red-600 hover:!bg-red-700 !text-white cursor-pointer border-0"
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
