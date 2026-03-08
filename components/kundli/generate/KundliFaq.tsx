import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'Why is time of birth important?', a: 'The exact time determines your moon sign, ascendant (Lagna), and the division of houses in your chart. Even a few minutes can change the result.' },
  { q: 'Can I get kundli for family members?', a: 'Yes. Use "Get for someone else" to add birth details for family or friends and generate their kundli.' },
  { q: 'Is my data secure?', a: 'Your birth details and kundli profiles are stored securely and only accessible to you when logged in.' },
];

export function KundliFaq() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4 flex items-center justify-center gap-2">
          <HelpCircle className="h-9 w-9 text-primary" />
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Common questions about kundli and birth details.
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
