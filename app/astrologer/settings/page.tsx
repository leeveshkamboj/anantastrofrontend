'use client';

import { useState, useEffect } from 'react';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useGetCurrenciesQuery, useGetTimezonesQuery } from '@/store/api/astrologerProfileApi';
import { useUpdateUserSettings } from '@/store/api/userApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export default function AstrologerSettingsPage() {
  const { data: userData, isLoading: isUserLoading } = useGetProfileQuery();
  const { data: currenciesData } = useGetCurrenciesQuery();
  const { data: timezonesData } = useGetTimezonesQuery();
  const { updateSettings } = useUpdateUserSettings();

  const currencies = currenciesData?.data || [];
  const timezones = timezonesData?.data || [];

  const [settings, setSettings] = useState({
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData?.data) {
      setSettings({
        currency: userData.data.currency || 'INR',
        timezone: userData.data.timezone || 'Asia/Kolkata',
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSettings({
        currency: settings.currency,
        timezone: settings.timezone,
      }).unwrap();
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Loading settings...</div>
        </div>
      </div>
    );
  }

  // Prepare timezones - keep grouped by region for better UX
  const timezoneRegions = Array.isArray(timezones) ? timezones : [];
  
  // Also create a flat list for the select (since Select doesn't support groups easily)
  const timezoneOptions: { value: string; label: string }[] = [];
  timezoneRegions.forEach((region: any) => {
    if (region.timezones && Array.isArray(region.timezones)) {
      region.timezones.forEach((tz: any) => {
        timezoneOptions.push({
          value: tz.value,
          label: `${tz.label} (${region.region})`,
        });
      });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Configure your currency and timezone preferences
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency: any) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                This currency will be used to display prices and amounts throughout the platform.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timezoneOptions.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Your timezone is used to display times and schedule consultations in your local time.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={isSaving} className="min-w-[140px] shadow-sm">
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
