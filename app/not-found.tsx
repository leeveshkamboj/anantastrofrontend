'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowRight } from 'lucide-react';
import { CelestialBackground } from '@/components/CelestialBackground';

export default function NotFound() {
  return (
    <CelestialBackground className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center">
            <div className="text-9xl font-bold text-primary opacity-20 mb-4">404</div>
            <CardTitle className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              The page you're looking for seems to have drifted away into the cosmos.
              Let us guide you back to familiar stars.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                className="bg-primary hover:bg-[#d6682a] text-white px-8 py-6 text-lg"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Return Home
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
              >
                <Link href="/services/ai-reports" className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Explore Services
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4 text-center">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/about" className="text-primary hover:underline">
                  About Us
                </Link>
                <Link href="/contact" className="text-primary hover:underline">
                  Contact
                </Link>
                <Link href="/astrologers" className="text-primary hover:underline">
                  Astrologers
                </Link>
                <Link href="/pricing" className="text-primary hover:underline">
                  Pricing
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CelestialBackground>
  );
}
