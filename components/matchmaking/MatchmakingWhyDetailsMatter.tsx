import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';

const items = [
  { icon: Calendar, title: 'Date of birth', desc: 'Determines sun sign and planetary positions at birth for both partners.' },
  { icon: Clock, title: 'Time of birth', desc: 'Essential for accurate moon sign, nakshatra, and ascendant—critical for gun milan.' },
  { icon: MapPin, title: 'Place of birth', desc: 'Used to compute exact longitude and latitude for correct chart calculation.' },
];

export function MatchmakingWhyDetailsMatter() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">Why birth details matter</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Accuracy of your Gun Milan result depends on precise birth data for both partners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-0 shadow-lg bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
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
