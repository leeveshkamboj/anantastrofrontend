'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthPageBrand } from '@/components/auth/AuthPageBrand';
import { CelestialBackground } from '@/components/CelestialBackground';
import { FadeIn } from '@/components/motion/FadeIn';
import { Link } from '@/i18n/navigation';
import { useResetPasswordMutation } from '@/store/api/authApi';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

function ResetPasswordContent() {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const schema = useMemo(
    () =>
      z
        .object({
          newPassword: z.string().min(6, t('passwordMin')),
          confirmPassword: z.string().min(6, t('passwordMin')),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t('passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(t('missingToken'));
      return;
    }
    try {
      await resetPassword({ token, newPassword: data.newPassword }).unwrap();
      toast.success(t('successToast'));
      router.push('/auth/login');
    } catch {
      toast.error(t('errorToast'));
    }
  };

  return (
    <CelestialBackground className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        <AuthPageBrand />
        <FadeIn preset="scaleIn" inView={false}>
          <Card className="w-full border-0 bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">{t('title')}</CardTitle>
              <CardDescription className="text-center">{t('subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              {!token ? (
                <div className="space-y-4 text-center text-sm text-gray-600">
                  <p>{t('missingToken')}</p>
                  <Button asChild className="w-full bg-primary hover:bg-[#d6682a] text-white">
                    <Link href="/auth/forgot-password">{t('requestNewLink')}</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('newPassword')}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register('newPassword')}
                      className={errors.newPassword ? 'border-red-500' : ''}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-[#d6682a] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? t('submitting') : t('submit')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </CelestialBackground>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>{t('loading')}</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
