import { Heart } from 'lucide-react';

export function MatchmakingHero() {
  return (
    <section className="bg-primary-light text-primary-dark relative py-20 md:py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 flex items-center justify-center gap-4">
          <Heart className="h-12 w-12 md:h-14 md:w-14 text-primary" />
          Matchmaking
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700 mb-4">
          Ashtakoot (36-point) Gun Milan for marriage compatibility based on Vedic astrology.
        </p>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Enter birth details for both partners or use saved kundli profiles. Get an instant compatibility score and koota breakdown.
        </p>
      </div>
    </section>
  );
}
