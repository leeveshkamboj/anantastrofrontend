import { Sparkles } from 'lucide-react';

export function WhatIsKundli() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is a Kundli?</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              A <strong>Kundli</strong> (also called Janam Kundli or birth chart) is a map of the sky at the exact moment you were born. It shows the positions of the sun, moon, and planets in the 12 zodiac signs and 12 houses.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              In Vedic astrology, your kundli is used to understand your personality, strengths, challenges, career potential, relationships, and life path. The more accurate your birth details—especially date, time, and place—the more precise your chart and insights.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              At AnantAstro you can create and save multiple kundli profiles (for yourself and family), so you can revisit your chart and get personalized reports whenever you need.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-primary/10 p-8 md:p-12 border border-primary/20">
              <Sparkles className="h-24 w-24 text-primary mx-auto opacity-80" />
              <p className="text-center text-gray-600 mt-4 font-medium">Your birth chart, your insights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
