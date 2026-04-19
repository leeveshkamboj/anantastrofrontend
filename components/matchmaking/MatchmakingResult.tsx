import type { MatchmakingResult as MatchmakingResultType } from '@/store/api/kundliApi';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MatchmakingResultProps {
  result: MatchmakingResultType;
}

export function MatchmakingResult({ result }: MatchmakingResultProps) {
  const topKoota = result.kootas.reduce((best, k) => {
    const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
    const bestRatio = best.maxPoints > 0 ? best.points / best.maxPoints : 0;
    return ratio > bestRatio ? k : best;
  }, result.kootas[0]);

  const weakKoota = result.kootas.reduce((worst, k) => {
    const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
    const worstRatio = worst.maxPoints > 0 ? worst.points / worst.maxPoints : 0;
    return ratio < worstRatio ? k : worst;
  }, result.kootas[0]);

  return (
    <Card className="mt-12 border-2 border-primary/20">
      <CardContent className="pt-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gun Milan Result</h2>
        <div className="flex flex-col items-center mb-8">
          <div
            className={cn(
              'text-4xl font-bold rounded-full h-24 w-24 flex items-center justify-center',
              result.percentage >= 25 ? 'bg-green-100 text-green-800' : result.percentage >= 18 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            )}
          >
            {result.totalPoints}/{result.maxPoints}
          </div>
          <p className="text-lg text-gray-600 mt-2">{result.percentage}% match</p>
          <p className="text-center text-gray-700 mt-4 max-w-xl">{result.interpretation}</p>
        </div>
        <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50/70 p-4">
          <h4 className="font-semibold text-violet-900 mb-2">Gun Milan Highlights</h4>
          <p className="text-sm text-violet-900">
            <strong>Total score:</strong> {result.totalPoints}/{result.maxPoints} ({result.percentage}%)
          </p>
          {topKoota && (
            <p className="text-sm text-violet-900 mt-1">
              <strong>Strongest koota:</strong> {topKoota.name} ({topKoota.points}/{topKoota.maxPoints})
            </p>
          )}
          {weakKoota && (
            <p className="text-sm text-violet-900 mt-1">
              <strong>Needs attention:</strong> {weakKoota.name} ({weakKoota.points}/{weakKoota.maxPoints})
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{result.partner1Summary.name || 'Partner 1'}</h4>
            <p><span className="text-gray-600">Nakshatra:</span> {result.partner1Summary.nakshatra}</p>
            <p><span className="text-gray-600">Rashi:</span> {result.partner1Summary.rashi}</p>
            <p><span className="text-gray-600">Varna:</span> {result.partner1Summary.varna} · Gana: {result.partner1Summary.gan} · Nadi: {result.partner1Summary.nadi}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{result.partner2Summary.name || 'Partner 2'}</h4>
            <p><span className="text-gray-600">Nakshatra:</span> {result.partner2Summary.nakshatra}</p>
            <p><span className="text-gray-600">Rashi:</span> {result.partner2Summary.rashi}</p>
            <p><span className="text-gray-600">Varna:</span> {result.partner2Summary.varna} · Gana: {result.partner2Summary.gan} · Nadi: {result.partner2Summary.nadi}</p>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 mb-3">Match Ashtakoot Points</h4>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left p-3 font-medium text-gray-900">Attribute</th>
                <th className="text-left p-3 font-medium text-gray-900">Male</th>
                <th className="text-left p-3 font-medium text-gray-900">Female</th>
                <th className="text-right p-3 font-medium text-gray-900">Received</th>
                <th className="text-right p-3 font-medium text-gray-900">Out of</th>
                <th className="text-left p-3 font-medium text-gray-900">Area Of Life</th>
                <th className="text-left p-3 font-medium text-gray-900 min-w-[200px]">Description</th>
                <th className="text-left p-3 font-medium text-gray-900 min-w-[220px]">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {result.kootas.map((k) => {
                const ratio = k.maxPoints > 0 ? k.points / k.maxPoints : 0;
                const rowHighlight = ratio === 1 ? 'bg-green-50/40' : ratio === 0 ? 'bg-red-50/40' : '';
                return (
                <tr key={k.name} className={cn('border-b border-gray-100 hover:bg-gray-50/50', rowHighlight)}>
                  <td className="p-3 font-medium text-gray-900">{k.name}</td>
                  <td className="p-3 text-gray-700">{k.maleValue ?? '—'}</td>
                  <td className="p-3 text-gray-700">{k.femaleValue ?? '—'}</td>
                  <td className="p-3 text-right">
                    <span className={k.points === k.maxPoints ? 'text-green-600 font-medium' : k.points === 0 ? 'text-red-600' : 'text-amber-600'}>
                      {k.points}
                    </span>
                  </td>
                  <td className="p-3 text-right text-gray-600">{k.maxPoints}</td>
                  <td className="p-3 text-gray-600">{k.areaOfLife ?? '—'}</td>
                  <td className="p-3 text-gray-600">{k.description}</td>
                  <td className="p-3 text-gray-500">{k.meaning ?? '—'}</td>
                </tr>
              )})}
              <tr className="bg-gray-50 font-medium border-t-2 border-gray-200">
                <td className="p-3 text-gray-900">Total</td>
                <td className="p-3" />
                <td className="p-3" />
                <td className="p-3 text-right text-gray-900">{result.totalPoints}</td>
                <td className="p-3 text-right text-gray-900">{result.maxPoints}</td>
                <td className="p-3" colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ashtakoot summary */}
        <p className="text-gray-700 mt-8 max-w-2xl">
          Ashtakoot Matching between male and female is <strong>{result.totalPoints}</strong> points out of <strong>{result.maxPoints}</strong> points.
          {result.totalPoints >= 25
            ? ' This is a reasonably good score. Hence, this is a favourable Ashtakoot match.'
            : result.totalPoints >= 18
              ? ' This is an average or acceptable score. Hence, this is an acceptable Ashtakoot match.'
              : ' This score is below the generally recommended minimum. Hence, this is not a favourable Ashtakoot match.'}
        </p>

        {/* Dosha section */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Dosha</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Ashtakoot</p>
              <p className="text-xl font-bold text-gray-900">{result.totalPoints}/{result.maxPoints}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Manglik Match</p>
              <p className="text-xl font-semibold text-gray-900">No</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            The overall points of this couple represent a great combination, both the bride and the groom have no mangal dosh. Marriage is preferred. Consult an astrologer to get rid of the few remedies and the doshas present for a harmonious married life ahead.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Both boy and girl are not Manglik, which does not lead to any problems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
