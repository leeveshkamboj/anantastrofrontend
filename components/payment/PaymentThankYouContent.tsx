'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Wallet } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CelestialBackground } from '@/components/CelestialBackground';
import { CoinGlyph } from '@/components/coins/CoinGlyph';
import { FadeIn } from '@/components/motion/FadeIn';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { useMotion } from '@/components/motion/MotionProvider';
import { Button } from '@/components/ui/button';
import { CosmicButton } from '@/components/ui/CosmicButton';
import {
  clearPaymentSuccessSnapshot,
  readPaymentSuccessSnapshot,
  savePaymentSuccessSnapshot,
  type PaymentSuccessSnapshot,
} from '@/lib/payment-success-storage';
import { useVerifyCoinCheckoutMutation } from '@/store/api/coinsApi';
import { useAuth } from '@/store/hooks/useAuth';
import { PaymentSuccessParticles } from './PaymentSuccessParticles';

type PagePhase = 'processing' | 'success' | 'error';

function formatInr(paise: number, currency = 'INR') {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(rupees);
}

function AnimatedBalance({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 90, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('en-IN'));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

function SuccessCheckmark() {
  const { reduced } = useMotion();

  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500/15"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-emerald-500/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 0.1 }}
      />
      <motion.svg
        viewBox="0 0 52 52"
        className="relative h-14 w-14 text-emerald-600"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: reduced ? 0.15 : 0.45, ease: 'easeOut' },
            },
          }}
        />
        <motion.path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l8 8 16-18"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                duration: reduced ? 0.15 : 0.35,
                delay: reduced ? 0 : 0.25,
                ease: 'easeOut',
              },
            },
          }}
        />
      </motion.svg>
    </div>
  );
}

export function PaymentThankYouContent() {
  const t = useTranslations('paymentThankYou');
  const router = useRouter();
  const { reduced } = useMotion();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [verifyCheckout] = useVerifyCoinCheckoutMutation();
  const [phase, setPhase] = useState<PagePhase>('processing');
  const [snapshot, setSnapshot] = useState<PaymentSuccessSnapshot | null>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth/login?next=${encodeURIComponent('/payment/thank-you')}`);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const stored = readPaymentSuccessSnapshot();
    if (!stored?.orderId || !stored.paymentId || !stored.signature) {
      router.replace('/pricing');
      return;
    }

    setSnapshot(stored);

    if (stored.verified && stored.balance != null) {
      setPhase('success');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await verifyCheckout({
          orderId: stored.orderId,
          paymentId: stored.paymentId,
          signature: stored.signature,
        }).unwrap();

        if (cancelled) return;

        const next: PaymentSuccessSnapshot = {
          ...stored,
          planName: res.data.planName,
          coinQuantity: res.data.coinsCredited,
          amountPaise: res.data.amountPaise,
          currency: res.data.currency,
          balance: res.data.balance,
          verified: true,
        };
        savePaymentSuccessSnapshot(next);
        setSnapshot(next);
        setPhase('success');
      } catch {
        if (!cancelled) setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, verifyCheckout, authLoading, isAuthenticated]);

  useEffect(() => {
    if (phase === 'success') {
      const timer = window.setTimeout(() => clearPaymentSuccessSnapshot(), 60_000);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  if (authLoading || !isAuthenticated) return null;
  if (!snapshot) return null;

  const showSuccess = phase === 'success';

  return (
    <CelestialBackground className="min-h-[calc(100vh-4rem)] px-4 py-10 sm:px-6 sm:py-14 lg:px-16">
      <motion.div
        className="relative mx-auto max-w-lg"
        initial={{ opacity: 0, y: reduced ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <PaymentSuccessParticles active={showSuccess} />

        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl shadow-astro-purple/10 backdrop-blur-md sm:p-8">
          <AnimatePresence mode="wait">
            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: reduced ? 0.12 : 0.3 }}
              >
                <FadeIn preset="fadeUp" inView={false} className="flex flex-col items-center py-8 text-center">
                  <Loader2 className="mb-5 h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />
                  <h1 className="text-2xl font-extrabold text-gray-900">{t('processingTitle')}</h1>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{t('processingSubtitle')}</p>
                </FadeIn>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0.12 : 0.3 }}
              >
                <FadeIn preset="fadeUp" inView={false} className="flex flex-col items-center py-6 text-center">
                  <h1 className="text-2xl font-extrabold text-gray-900">{t('errorTitle')}</h1>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">{t('errorSubtitle')}</p>
                  <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                    <Button variant="outline" className="flex-1" onClick={() => router.push('/pricing')}>
                      {t('backToPricing')}
                    </Button>
                    <CosmicButton className="flex-1" onClick={() => window.location.reload()}>
                      {t('retry')}
                    </CosmicButton>
                  </div>
                </FadeIn>
              </motion.div>
            )}

            {showSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
              <FadeIn preset="scaleIn" inView={false} className="mb-5 flex justify-center">
                <SuccessCheckmark />
              </FadeIn>

              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.15} className="text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('badge')}
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t('title')}</h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
                  {t('subtitle')}
                </p>
              </FadeIn>

              <Stagger inView={false} className="mt-8 space-y-4">
                <StaggerItem>
                  <motion.div
                    className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/80 p-5"
                    whileHover={reduced ? undefined : { y: -2 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-300/60 bg-white shadow-sm">
                        <CoinGlyph className="h-8 w-8" />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">
                          {t('coinsAdded', { n: snapshot.coinQuantity })}
                        </p>
                        <p className="truncate text-lg font-extrabold text-gray-900">{snapshot.planName}</p>
                        <p className="text-sm text-gray-500">
                          {t('amountPaid')}: {formatInr(snapshot.amountPaise, snapshot.currency)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>

                {snapshot.balance != null && (
                  <StaggerItem>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/90 px-5 py-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('newBalance')}</p>
                      <p className="mt-1 flex items-center justify-center gap-2 text-3xl font-extrabold tabular-nums text-gray-900">
                        <AnimatedBalance value={snapshot.balance} />
                        <span className="text-base font-semibold text-gray-500">{t('coinsLabel')}</span>
                      </p>
                    </div>
                  </StaggerItem>
                )}

                <StaggerItem>
                  <p className="text-center text-xs text-gray-400">
                    {t('orderRef')}: {snapshot.orderId.slice(-12)}
                  </p>
                </StaggerItem>
              </Stagger>

              <FadeIn preset="fadeUp" inView={false} delay={reduced ? 0 : 0.35} className="mt-8 space-y-3">
                <CosmicButton asChild className="h-12 w-full text-base">
                  <Link href="/services/kundli/generate">
                    {t('generateKundli')}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </CosmicButton>
                <Button asChild variant="outline" className="h-12 w-full text-base">
                  <Link href="/wallet">
                    <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('goToWallet')}
                  </Link>
                </Button>
              </FadeIn>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </CelestialBackground>
  );
}
