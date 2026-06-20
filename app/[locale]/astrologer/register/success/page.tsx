'use client';

import { useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialBackground } from '@/components/CelestialBackground';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/FadeIn';
import { useMotion } from '@/components/motion/MotionProvider';
import { CheckCircle2, Mail } from 'lucide-react';

export default function AstrologerRegisterSuccessPage() {
  const router = useRouter();
  const { reduced } = useMotion();

  return (
    <CelestialBackground className="flex items-center justify-center px-4 py-12 overflow-hidden min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <FadeIn preset="scaleIn" inView={false}>
          <Card className="w-full shadow-2xl border-0 bg-white">
            <CardHeader className="text-center">
              <FadeIn preset="scaleIn" inView={false} delay={reduced ? 0 : 0.1} className="flex justify-center mb-4">
                <div className="relative">
                  <div className="relative rounded-full bg-primary p-4">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>
              </FadeIn>
              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.15}>
                <CardTitle className="text-3xl font-bold text-center text-gray-900">
                  Application Submitted Successfully!
                </CardTitle>
              </FadeIn>
              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.2}>
                <CardDescription className="text-center text-lg mt-4">
                  Your request to become an astrologer has been received
                </CardDescription>
              </FadeIn>
            </CardHeader>
            <CardContent className="space-y-6">
              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.25}>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-gray-800 text-base leading-relaxed">
                    Your application is being reviewed by our team. You will receive a reply via email within{' '}
                    <span className="font-semibold text-primary">10-15 business days</span>.
                  </p>
                  <p className="text-gray-600 text-sm mt-3">
                    Please check your email inbox (and spam folder) for updates on your application status.
                  </p>
                </div>
              </FadeIn>

              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.3}>
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
              </FadeIn>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </CelestialBackground>
  );
}
