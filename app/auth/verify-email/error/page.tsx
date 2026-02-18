'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CelestialBackground } from '@/components/CelestialBackground';

export default function VerifyEmailErrorPage() {
  return (
    <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-red-600">Verification failed</CardTitle>
            <CardDescription className="text-center">
              This verification link is invalid or has expired. You can request a new one from the sign-in or register page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Go to sign in</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/register">Register</Link>
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
