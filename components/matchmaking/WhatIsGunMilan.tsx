import { Sparkles } from 'lucide-react';

export function WhatIsGunMilan() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is Gun Milan?</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              <strong>Gun Milan</strong> (also called Ashtakoot Milan) is a traditional Vedic astrology method used to assess marriage compatibility. It compares the birth charts of two people across eight factors, or <strong>kootas</strong>, that together add up to 36 points.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              The eight kootas are Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi. Each evaluates a different aspect—from mental compatibility and temperament to health and progeny. A score of 18 or more out of 36 is generally considered acceptable; higher scores indicate a better match.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              At AnantAstro you can get your Gun Milan result in seconds by entering birth details for both partners or by selecting from your saved kundli profiles.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-primary/10 p-8 md:p-12 border border-primary/20">
              <Sparkles className="h-24 w-24 text-primary mx-auto opacity-80" />
              <p className="text-center text-gray-600 mt-4 font-medium">36 gunas, one result</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
