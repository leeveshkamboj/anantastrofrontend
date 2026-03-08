import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { step: 1, title: 'Enter birth details', desc: 'Provide name, date, time, and place of birth for accurate chart calculation.' },
  { step: 2, title: 'Create your profile', desc: 'Your kundli profile is saved so you can access it anytime.' },
  { step: 3, title: 'Get your kundli', desc: 'View your birth chart and personalized astrological insights.' },
  { step: 4, title: 'Explore insights', desc: 'Discover personality, career, relationships, and life path guidance.' },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">How it works</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Four simple steps to get your kundli and start exploring your astrological profile.
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
