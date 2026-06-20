'use client';

import { Container } from '@/components/layout/Container';
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
        <div
          className={cn(
            'mx-auto max-w-md overflow-hidden rounded-4xl',
            isLoading
              ? 'border border-white/70 bg-white shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)]'
              : 'border border-white/10 bg-white/5 backdrop-blur-md',
          )}
        >
          <div className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple" aria-hidden="true" />
          <div className="space-y-4 p-10">
            <div className="flex justify-center">{icon}</div>
            {title ? (
              <h2 className={cn('text-2xl font-extrabold', isLoading ? 'text-gray-900' : undefined)}>
                {title}
              </h2>
            ) : null}
            <p
              className={cn(
                'text-sm leading-relaxed',
                isLoading ? 'text-gray-600' : 'text-purple-100/80',
              )}
            >
              {message}
            </p>
            {action ? <div className="flex justify-center pt-2">{action}</div> : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
