'use client';

import { useGetMyKundlisQuery } from '@/store/api/kundliApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function KundliProfileTab() {
  const { data: kundlisData } = useGetMyKundlisQuery();
  const kundlis = kundlisData?.data ?? [];

  return (
    <Card className="border-0 shadow-xl bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Kundli Profile
        </CardTitle>
        <CardDescription>
          Birth details saved for you and family members. Add more from the home page or when
          generating a kundli.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {kundlis.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No kundli profiles yet.</p>
            <p className="text-sm mt-1">
              Fill the form on the home page to generate a kundli, or add one when you use
              our services.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <a href="/">Go to Home</a>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {kundlis.map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-lg border border-gray-200 bg-gray-50/50"
              >
                <div>
                  <p className="font-medium text-gray-900">{k.name}</p>
                  <p className="text-sm text-gray-500">
                    {k.dateOfBirth && `DOB: ${k.dateOfBirth}`}
                    {k.timeOfBirth && ` • Time: ${k.timeOfBirth}`}
                    {k.placeOfBirth && ` • ${k.placeOfBirth}`}
                    {k.timezoneOffsetHours != null && !Number.isNaN(Number(k.timezoneOffsetHours)) && (() => {
                      const h = Number(k.timezoneOffsetHours);
                      const sign = h >= 0 ? '+' : '-';
                      const abs = Math.abs(h);
                      const hrs = Math.floor(abs);
                      const mins = Math.round((abs - hrs) * 60);
                      const tzStr = mins ? `GMT${sign}${hrs}:${mins.toString().padStart(2, '0')}` : `GMT${sign}${hrs}:00`;
                      return <span> • {tzStr}</span>;
                    })()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
