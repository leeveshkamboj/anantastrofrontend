import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export function MatchmakingFinalCta() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-primary/5 border-t border-primary/10">
      <div className="max-w-3xl mx-auto text-center">
        <Star className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to check compatibility?</h2>
        <p className="text-gray-600 mb-6">
          Enter birth details for both partners above and get your Ashtakoot Gun Milan result.
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          size="lg"
        >
          <a href="#get-matchmaking">Check compatibility now</a>
        </Button>
      </div>
    </section>
  );
}
