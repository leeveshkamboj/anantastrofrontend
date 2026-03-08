import { CheckCircle2 } from 'lucide-react';

const items = [
  'Birth chart (Kundli) with planetary positions',
  'Rashi (Moon sign) and Nakshatra insights',
  'Lagna (Ascendant) and house analysis',
  'Personalized life and career guidance',
  'Compatibility and relationship insights',
];

export function WhatYouGet() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">What you get</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Your kundli unlocks a range of astrological insights and reports.
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
