'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useVerifyEmailMutation } from '@/store/api/authApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialBackground } from '@/components/CelestialBackground';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [verifyEmail, { isSuccess, isError }] = useVerifyEmailMutation();
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!token?.trim()) {
      router.replace('/auth/verify-email/error');
      return;
    }
    started.current = true;
    verifyEmail({ token: token.trim() })
      .unwrap()
      .then(() => {
        setDone(true);
        router.replace('/');
      })
      .catch(() => {
        setDone(true);
        router.replace('/auth/verify-email/error');
      });
  }, [token, router, verifyEmail]);

  return (
    <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isSuccess || done ? 'Email verified' : 'Verifying your email'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSuccess || done
                ? 'Redirecting you…'
                : 'Please wait while we verify your email and sign you in.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {!isError && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Verifying…</span>
              </div>
            )}
            {isError && (
              <>
                <p className="text-sm text-red-600 text-center">
                  Verification failed. The link may be invalid or expired.
                </p>
                <Link href="/auth/login" className="text-sm text-primary hover:underline">
                  Go to sign in
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
