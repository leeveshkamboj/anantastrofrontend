'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useGetKundliByShareTokenQuery } from '@/store/api/kundliApi';
import type { KundliGenerationResponse } from '@/store/api/kundliApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KundliResultContent } from '../../result/KundliResultContent';
import { KundliResultHeader, KundliResultStatusPanel } from '@/components/kundli/result';
import { Container } from '@/components/layout/Container';
import { shareViaInstagram } from '@/lib/social-share';

export default function KundliSharePage() {
  const t = useTranslations('shareView.kundli');
  const tc = useTranslations('commonUi');
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const result = useGetKundliByShareTokenQuery(token, {
    skip: !token,
  });
  const data = result.data as KundliGenerationResponse | undefined;
  const { isLoading, isFetching, isError, isUninitialized } = result;
  const [pageShareUrl, setPageShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const waitingForData = Boolean(token) && !data?.data && (isLoading || isFetching || isUninitialized);

  useEffect(() => {
    setPageShareUrl(window.location.href);
  }, []);

  const copyLink = useCallback(() => {
    if (!pageShareUrl) return;
    navigator.clipboard.writeText(pageShareUrl).then(() => {
      setCopied(true);
      toast.success(tc('shareLinkCopied'));
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pageShareUrl, tc]);

  const shareOnInstagram = useCallback(async () => {
    if (!pageShareUrl) return;
    const shareResult = await shareViaInstagram(pageShareUrl);
    if (shareResult === 'copied') {
      toast.success(tc('instagramShareCopied'));
    } else {
      toast.error(tc('instagramShareFailed'));
    }
  }, [pageShareUrl, tc]);

  const ctaButton = (
    <Button
      asChild
      variant="outline"
      className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
    >
      <Link href="/services/kundli/generate">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('ctaOwn')}
      </Link>
    </Button>
  );

  if (!token) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-amber-500" aria-hidden="true" />}
        message={t('invalid')}
        action={ctaButton}
      />
    );
  }

  if (waitingForData) {
    return (
      <KundliResultStatusPanel
        variant="loading"
        icon={<Loader2 className="h-12 w-12 animate-spin text-astro-orange" aria-hidden="true" />}
        message={t('loading')}
      />
    );
  }

  if (isError || !data?.data) {
    return (
      <KundliResultStatusPanel
        icon={<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />}
        message={t('disabled')}
        action={ctaButton}
      />
    );
  }

  const gen = data.data;

  return (
    <div className="overflow-x-hidden">
      <KundliResultHeader
        view="share"
        gen={gen}
        shareUrl={pageShareUrl}
        copied={copied}
        onCopyLink={copyLink}
        onShareInstagram={shareOnInstagram}
      />

      <section className="relative bg-gray-50/80 px-6 pb-20 pt-6 lg:px-24 lg:pt-8">
        <Container className="relative z-10">
          <KundliResultContent gen={gen} shareToken={token} />
        </Container>
      </section>
    </div>
  );
}
