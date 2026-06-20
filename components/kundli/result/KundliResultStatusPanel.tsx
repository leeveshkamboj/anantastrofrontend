'use client';

import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { useMotion } from '@/components/motion/MotionProvider';
import { getChoreographyDelay } from '@/lib/motion';
import { cn } from '@/lib/utils';

type KundliResultStatusPanelProps = {
  icon: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
  /** White card for loading/generating states; dark glass card for errors. */
  variant?: 'loading' | 'status';
};

export function KundliResultStatusPanel({
  icon,
  title,
  message,
  action,
  className,
  variant = 'status',
}: KundliResultStatusPanelProps) {
  const { reduced } = useMotion();
  const isLoading = variant === 'loading';

  return (
    <div
      className={cn(
        'flex min-h-screen items-center bg-astro-dark stars-bg px-6 py-16 lg:px-24',
        isLoading ? 'text-gray-900' : 'text-white',
        className,
      )}
    >
      <Container size="narrow" className="w-full text-center">
        <FadeIn
          preset="scaleIn"
          inView={false}
          className={cn(
            'mx-auto max-w-md overflow-hidden rounded-4xl',
            isLoading
              ? 'border border-white/70 bg-white shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)]'
              : 'border border-white/10 bg-white/5 backdrop-blur-md',
          )}
        >
          <div className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple" aria-hidden="true" />
          <div className="space-y-4 p-10">
            <FadeIn preset="scaleIn" inView={false} delay={getChoreographyDelay("icon", reduced)} className="flex justify-center">
              {icon}
            </FadeIn>
            {title ? (
              <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("title", reduced)}>
                <h2 className={cn('text-2xl font-extrabold', isLoading ? 'text-gray-900' : undefined)}>
                  {title}
                </h2>
              </FadeIn>
            ) : null}
            <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("content", reduced)}>
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  isLoading ? 'text-gray-600' : 'text-purple-100/80',
                )}
              >
                {message}
              </p>
            </FadeIn>
            {action ? (
              <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("action", reduced)} className="flex justify-center pt-2">
                {action}
              </FadeIn>
            ) : null}
          </div>
        </FadeIn>
      </Container>
    </div>
  );
}
