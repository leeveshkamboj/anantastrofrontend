'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetKundliGenerationQuery, useUpdateKundliShareMutation, kundliApi } from '@/store/api/kundliApi';
import type { KundliGenerationStatus, KundliGenerationResponse } from '@/store/api/kundliApi';
import type { RootState } from '@/store/store';
import { useAuth } from '@/store/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, ArrowLeft, Loader2, AlertCircle, Share2, Link2, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { KundliResultContent } from '../KundliResultContent';

export default function KundliResultPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = typeof params?.id === 'string' ? params.id : '';

  const cachedStatus = useSelector((state: RootState) =>
    id ? kundliApi.endpoints.getKundliGeneration.select(id)(state)?.data?.data?.status : undefined,
  );
  const stopPolling = cachedStatus === 'COMPLETED' || cachedStatus === 'FAILED';

  const result = useGetKundliGenerationQuery(id, {
    skip: !id,
    pollingInterval: id && !stopPolling ? 2500 : 0,
  });
  const { isLoading, isError, refetch } = result;
  const data = result.data as KundliGenerationResponse | undefined;

  const [updateShare, { data: shareResult, isLoading: shareLoading }] = useUpdateKundliShareMutation();
  const [copied, setCopied] = useState(false);

  const genOrUndefined = data?.data;
  const shareUrlForCopy =
    typeof window !== 'undefined' && (genOrUndefined?.shareToken ?? shareResult?.data?.shareToken)
      ? `${window.location.origin}/kundli/share/${genOrUndefined?.shareToken ?? shareResult?.data?.shareToken ?? ''}`
      : '';
  const copyLink = useCallback(() => {
    if (!shareUrlForCopy) return;
    navigator.clipboard.writeText(shareUrlForCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrlForCopy]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!id) return;
    refetch();
  }, [id, refetch]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-gray-600">Invalid kundli link.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading && !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your kundli…</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Could not load this kundli. It may not exist or you may not have access.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gen = data.data;
  const status = gen.status as KundliGenerationStatus;

  if (status === 'PENDING' || status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {status === 'PENDING' ? 'Your kundli is in the queue' : 'Generating your kundli…'}
            </h2>
            <p className="text-gray-600 text-sm">
              We’re calculating your chart. This usually takes a few seconds. The page will update automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generation failed</h2>
            <p className="text-gray-600 text-sm mb-4">{gen.errorMessage || 'Something went wrong. Please try again.'}</p>
            <Button variant="outline" onClick={() => router.push('/kundli/generate')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kundli
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shareToken = gen.shareToken ?? shareResult?.data?.shareToken ?? null;
  const shareEnabled = gen.shareEnabled ?? shareResult?.data?.shareEnabled ?? false;
  const shareUrl = shareUrlForCopy;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => router.push('/kundli/generate')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Kundli
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Kundli</h1>
              <p className="text-gray-600 text-sm">
                DOB: {gen.dob} • Time: {gen.time}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={shareLoading}>
                {shareLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {!shareEnabled ? (
                <DropdownMenuItem
                  onClick={() => updateShare({ uuid: id, enabled: true })}
                  disabled={shareLoading}
                >
                  <Link2 className="h-4 w-4" />
                  Create shareable link
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={copyLink}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy link'}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => updateShare({ uuid: id, enabled: false })}
                    disabled={shareLoading}
                    variant="destructive"
                  >
                    Disable link
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <KundliResultContent gen={gen} />
      </div>
    </div>
  );
}
