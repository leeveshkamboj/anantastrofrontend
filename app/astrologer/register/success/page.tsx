'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialBackground } from '@/components/CelestialBackground';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail } from 'lucide-react';

export default function AstrologerRegisterSuccessPage() {
  const router = useRouter();

  return (
    <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="w-full shadow-2xl border-0 bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative bg-primary rounded-full p-4 animate-scale-in">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-gray-900 animate-fade-in">
              Application Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-center text-lg mt-4 animate-fade-in-delay">
              Your request to become an astrologer has been received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center animate-slide-up">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce-slow" />
              <p className="text-gray-800 text-base leading-relaxed">
                Your application is being reviewed by our team. You will receive a reply via email within{' '}
                <span className="font-semibold text-primary">10-15 business days</span>.
              </p>
              <p className="text-gray-600 text-sm mt-3">
                Please check your email inbox (and spam folder) for updates on your application status.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Go to Homepage
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/astrologer/register')}
                className="border-primary text-primary hover:bg-orange-50"
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </CelestialBackground>
  );
}
