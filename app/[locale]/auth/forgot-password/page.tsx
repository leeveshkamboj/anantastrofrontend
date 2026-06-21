'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialBackground } from '@/components/CelestialBackground';
import { FadeIn } from '@/components/motion/FadeIn';
import { Link } from '@/i18n/navigation';
import { useForgotPasswordMutation } from '@/store/api/authApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import * as React from 'react';

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = React.useState(false);

  const schema = React.useMemo(
    () =>
      z.object({
        email: z.string().email(t('emailInvalid')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSubmitted(true);
      toast.success(t('successToast'));
    } catch {
      toast.error(t('errorToast'));
    }
  };

  return (
    <CelestialBackground className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        <FadeIn preset="scaleIn" inView={false}>
          <Card className="w-full border-0 bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">{t('title')}</CardTitle>
              <CardDescription className="text-center">{t('subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="space-y-4 text-center text-sm text-gray-600">
                  <p>{t('checkInbox')}</p>
                  <Button asChild className="w-full bg-primary hover:bg-[#d6682a] text-white">
                    <Link href="/auth/login">{t('backToLogin')}</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#d6682a] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? t('submitting') : t('submit')}
                  </Button>
                  <div className="text-center text-sm">
                    <Link href="/auth/login" className="text-primary hover:underline">
                      {t('backToLogin')}
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </CelestialBackground>
  );
}
