import { cn } from '@/lib/utils';

/** Consistent branded coin mark (star in circle — celestial + value). */
export function CoinGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block', className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" className="fill-amber-400/25 stroke-amber-600" strokeWidth="1.5" />
      <path
        d="M12 4.5l1.2 3.6h3.8l-3 2.2 1.1 3.5L12 12.4 8.9 13.8l1.1-3.5-3-2.2h3.8L12 4.5z"
        className="fill-amber-500"
      />
    </svg>
  );
}
