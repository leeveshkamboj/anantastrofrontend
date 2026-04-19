import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export function KundliFinalCta() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-primary/5 border-t border-primary/10">
      <div className="max-w-3xl mx-auto text-center">
        <Star className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to explore your chart?</h2>
        <p className="text-gray-600 mb-6">
          Scroll up to enter birth details or select a profile and get your kundli. Kundli generation uses coins based on current pricing.
        </p>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          size="lg"
        >
          <a href="#get-kundli">Go to Get your Kundli</a>
        </Button>
      </div>
    </section>
  );
}
