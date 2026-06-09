'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildWhatsAppShareUrl, shareViaInstagram } from '@/lib/social-share';

export interface SocialShareButtonsProps {
  shareUrl: string;
  /** i18n message key under commonUi with `{url}` param */
  messageKey?: 'shareKundliMessage';
  size?: 'sm' | 'default';
  className?: string;
}

export function SocialShareButtons({
  shareUrl,
  messageKey = 'shareKundliMessage',
  size = 'sm',
  className,
}: SocialShareButtonsProps) {
  const tc = useTranslations('commonUi');

  const shareOnInstagram = useCallback(async () => {
    if (!shareUrl) return;
    const result = await shareViaInstagram(shareUrl);
    if (result === 'copied') {
      toast.success(tc('instagramShareCopied'));
    } else {
      toast.error(tc('instagramShareFailed'));
    }
  }, [shareUrl, tc]);

  if (!shareUrl) return null;

  const whatsAppHref = buildWhatsAppShareUrl(tc(messageKey, { url: shareUrl }));

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      <Button asChild variant="outline" size={size} className="gap-2">
        <a href={whatsAppHref} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
          {tc('shareWhatsApp')}
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size={size}
        className="gap-2"
        onClick={() => void shareOnInstagram()}
      >
        <Instagram className="h-4 w-4 text-[#E4405F]" />
        {tc('shareInstagram')}
      </Button>
    </div>
  );
}
