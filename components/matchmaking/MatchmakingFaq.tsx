import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'What is Ashtakoot or Gun Milan?', a: 'Gun Milan (also called Ashtakoot) is a Vedic astrology method that scores marriage compatibility using 8 factors (kootas) totaling 36 points. It compares the birth charts of both partners, especially Moon nakshatra and sign.' },
  { q: 'Why is time of birth important for matchmaking?', a: 'Time of birth fixes the Moon sign and nakshatra, which drive most of the gun milan rules (Tara, Yoni, Gana, Bhakoot, Nadi). Even a small time difference can change the result.' },
  { q: 'Can I use saved kundli profiles?', a: 'Yes. If you have already added birth details in your kundli profiles, use "Quick fill from saved profiles" and assign a profile to Partner 1 or Partner 2 with one click.' },
  { q: 'Is my data private?', a: 'Your birth details and matchmaking results are stored securely and are only accessible to you when you are logged in.' },
];

export function MatchmakingFaq() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="h-9 w-9 text-primary" />
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Common questions about Gun Milan and matchmaking.
        </p>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map(({ q, a }, i) => (
            <Card key={i} className="border border-gray-200 bg-white">
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600 leading-relaxed">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
