import { CheckCircle2 } from 'lucide-react';

const items = [
  'Ashtakoot (36-point) Gun Milan score and percentage',
  'Breakdown of all 8 kootas: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi',
  'Partner summaries: Nakshatra, Rashi, Varna, Gana, Nadi for each',
  'Clear interpretation (recommended / acceptable / good / excellent match)',
  'Based on traditional Vedic astrology marriage compatibility',
];

export function MatchmakingWhatYouGet() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">What you get</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Your matchmaking report includes the following.
        </p>
        <ul className="max-w-2xl mx-auto space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <span className="text-gray-700 text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
