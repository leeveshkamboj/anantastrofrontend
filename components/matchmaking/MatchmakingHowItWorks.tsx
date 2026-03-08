import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { step: 1, title: 'Enter both birth details', desc: 'Add name, date, time, and place of birth for Partner 1 and Partner 2. Use saved kundli profiles for a quick fill.' },
  { step: 2, title: 'Check match', desc: 'We run Ashtakoot (8 kootas, 36 gunas) matching using Vedic astrology rules.' },
  { step: 3, title: 'View your result', desc: 'See total score, interpretation, and a breakdown of each koota (Varna, Vashya, Tara, Yoni, and more).' },
  { step: 4, title: 'Understand compatibility', desc: 'Learn how your nakshatras, rashis, and other factors align for marriage compatibility.' },
];

export function MatchmakingHowItWorks() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">How it works</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Four simple steps to get your matchmaking result.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, title, desc }) => (
            <Card key={step} className="border-2 border-gray-100 bg-white shadow-sm">
              <CardContent>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
