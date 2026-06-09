'use client';

import { useState } from 'react';
import { useLazyGetKundliCalculationMetadataQuery } from '@/store/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function KundliSupportPage() {
  const [uuid, setUuid] = useState('');
  const [searchUuid, setSearchUuid] = useState('');
  const [fetchMetadata, { data, isFetching, error }] = useLazyGetKundliCalculationMetadataQuery();

  const handleLookup = () => {
    const trimmed = uuid.trim();
    if (!trimmed) return;
    setSearchUuid(trimmed);
    fetchMetadata(trimmed);
  };

  const meta = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kundli Calculation Support</h1>
        <p className="text-gray-600 mt-1">
          Look up calculation metadata for a generation to diagnose parity and timezone issues.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Generation lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="generation-uuid">Generation UUID</Label>
              <Input
                id="generation-uuid"
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
            </div>
            <Button onClick={handleLookup} disabled={isFetching || !uuid.trim()} className="sm:self-end">
              {isFetching ? 'Looking up…' : 'Lookup'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && searchUuid && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-700">
            Generation not found or lookup failed for <code className="text-sm">{searchUuid}</code>
          </CardContent>
        </Card>
      )}

      {meta && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              Calculation metadata
              <Badge variant={meta.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {meta.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">UUID</dt>
                <dd className="font-mono text-gray-900 break-all">{meta.uuid}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Engine version</dt>
                <dd className="font-medium">{meta.engineVersion ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Birth date / time</dt>
                <dd>{meta.dob} {meta.time}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Place</dt>
                <dd>{meta.placeOfBirth ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Coordinates</dt>
                <dd>{meta.latitude}, {meta.longitude}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Timezone ID</dt>
                <dd>{meta.timezoneId ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Timezone confidence</dt>
                <dd>
                  {meta.timezoneConfidence ? (
                    <Badge variant={meta.timezoneConfidence === 'verified' ? 'default' : 'outline'}>
                      {meta.timezoneConfidence}
                    </Badge>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Timezone offset (hours)</dt>
                <dd>{meta.timezoneOffsetHours ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd>{new Date(meta.createdAt).toLocaleString()}</dd>
              </div>
            </dl>

            {meta.calculationMetadata && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Full calculation metadata</h3>
                <pre className="bg-gray-50 border rounded-lg p-4 text-xs overflow-auto max-h-96">
                  {JSON.stringify(meta.calculationMetadata, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
