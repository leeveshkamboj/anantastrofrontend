'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CelestialBackground } from '@/components/CelestialBackground';

export default function VerifyEmailSuccessPage() {
  return (
    <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Email verified</CardTitle>
            <CardDescription className="text-center">
              Your email has been verified. You can now sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button asChild className="w-full bg-primary hover:bg-[#d6682a] text-white">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to home
            </Link>
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
