'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGetMyProfileQuery, useUpdateServicePricingMutation, useCheckProfileCompletionQuery } from '@/store/api/astrologerProfileApi';
import { useGetProfileQuery } from '@/store/api/authApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/currency';

const SERVICE_TYPES = [
  { value: 'full_kundli', labelKey: 'svcKundli' as const, descKey: 'svcKundliDesc' as const },
  { value: 'horoscope', labelKey: 'svcHoroscope' as const, descKey: 'svcHoroscopeDesc' as const },
  { value: 'matchmaking', labelKey: 'svcMatchmaking' as const, descKey: 'svcMatchmakingDesc' as const },
  { value: 'consultation', labelKey: 'svcConsultation' as const, descKey: 'svcConsultationDesc' as const },
];

export default function AstrologerServicesPage() {
  const t = useTranslations('astrologer');
  const { data: userData } = useGetProfileQuery();
  const userCurrency = userData?.data?.currency || 'INR';
  const { data: profileData, isLoading } = useGetMyProfileQuery({
    currency: userCurrency,
  });
  const { data: completionData } = useCheckProfileCompletionQuery();
  const [updatePricing] = useUpdateServicePricingMutation();

  const profile = profileData?.data;
  const isComplete = completionData?.data?.isComplete;
  const profileApproved = completionData?.data?.profileApproved;

  const [pricing, setPricing] = useState<Record<string, number>>({});

  useEffect(() => {
    if (profile?.servicePricing) {
      const pricingMap: Record<string, number> = {};
      profile.servicePricing.forEach((sp) => {
        pricingMap[sp.serviceType] = sp.price || 0;
      });
      setPricing(pricingMap);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileApproved) {
      toast.error(t('approvedBeforePricing'));
      return;
    }

    try {
      await updatePricing({
        pricing: SERVICE_TYPES.map((service) => ({
          serviceType: service.value as any,
          price: pricing[service.value] || undefined,
        })),
      }).unwrap();
      toast.success(t('pricingPending'));
    } catch (error: any) {
      toast.error(error?.data?.message || t('pricingUpdateFailed'));
    }
  };

  const getPricingStatus = (serviceType: string) => {
    const servicePricing = profile?.servicePricing?.find(sp => sp.serviceType === serviceType);
    if (!servicePricing) return null;
    return {
      isApproved: servicePricing.isApproved,
      approvedPrice: servicePricing.approvedPrice,
      currentPrice: servicePricing.price,
      rejectionReason: servicePricing.rejectionReason,
      formattedPrice: servicePricing.formattedPrice || formatCurrency(servicePricing.price || 0, userCurrency),
      displayCurrency: servicePricing.displayCurrency || userCurrency,
      originalPrice: servicePricing.originalPrice,
      originalCurrency: servicePricing.originalCurrency,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">{t('svcLoading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('svcPageTitle')}</h1>
        <p className="text-gray-600 mt-1.5">{t('svcPageSubtitle')}</p>
      </div>

      {!isComplete && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 font-medium">{t('svcCompleteProfile')}</AlertDescription>
        </Alert>
      )}

      {!profileApproved && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">{t('svcNeedApproval')}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('svcCardTitle')}</CardTitle>
            <p className="text-sm text-gray-500 mt-2">{t('svcCardHelp')}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {SERVICE_TYPES.map((service) => {
              const status = getPricingStatus(service.value);
              const hasPendingChanges = status && status.currentPrice !== status.approvedPrice && !status.isApproved;

              return (
                <div key={service.value} className="border rounded-lg p-5 space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{t(service.labelKey)}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{t(service.descKey)}</p>
                    </div>
                    {status && (
                      <div className="flex items-center gap-2">
                        {status.isApproved ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            {t('svcApproved')}
                          </Badge>
                        ) : hasPendingChanges ? (
                          <Badge className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {t('svcPending')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="px-2.5 py-1">{t('svcNotSet')}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`price-${service.value}`}>
                        {t('svcPriceLabel', { currency: status?.displayCurrency || userCurrency })}
                      </Label>
                      <Input
                        id={`price-${service.value}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricing[service.value] || ''}
                        onChange={(e) => setPricing({
                          ...pricing,
                          [service.value]: parseFloat(e.target.value) || 0,
                        })}
                        placeholder="0.00"
                        disabled={!profileApproved}
                      />
                      {status?.originalPrice && status.originalCurrency && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t('svcBasePrice')} {formatCurrency(status.originalPrice, status.originalCurrency)}
                        </p>
                      )}
                    </div>
                    {status?.approvedPrice && (
                      <div className="space-y-2">
                        <Label>{t('svcApprovedPrice')}</Label>
                        <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                          {status.formattedPrice || formatCurrency(status.approvedPrice, status.displayCurrency || userCurrency)}
                        </div>
                      </div>
                    )}
                  </div>

                  {hasPendingChanges && status.currentPrice && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      {t('svcPendingApproval')} {status.formattedPrice || formatCurrency(status.currentPrice, status.displayCurrency || userCurrency)}
                    </div>
                  )}

                  {status?.rejectionReason && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      <strong>{t('svcRejectedLabel')}</strong> {status.rejectionReason}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={!profileApproved} className="min-w-[140px] shadow-sm">
            {t('svcSavePricing')}
          </Button>
        </div>
      </form>
    </div>
  );
}
