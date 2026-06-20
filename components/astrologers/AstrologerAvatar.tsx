'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getDirectoryAvatarUrl, getFeaturedAvatarUrl, getVectorAvatarUrl } from '@/lib/astrologer-utils';
import type { ChatAstrologer } from '@/store/api/chatApi';

type AstrologerAvatarProps = {
  astrologer: Pick<ChatAstrologer, 'id' | 'slug' | 'displayName' | 'avatarUrl'>;
  variant: 'featured' | 'directory';
  size?: number;
  className?: string;
};

export function AstrologerAvatar({ astrologer, variant, size = 96, className }: AstrologerAvatarProps) {
  const primarySrc =
    variant === 'featured'
      ? getFeaturedAvatarUrl(astrologer)
      : getDirectoryAvatarUrl(astrologer);
  const fallbackSrc = getVectorAvatarUrl(astrologer);
  const [src, setSrc] = useState(primarySrc);

  return (
    <Image
      src={src}
      alt={astrologer.displayName}
      width={size}
      height={size}
      unoptimized
      className={cn('rounded-full bg-white object-cover', className)}
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}
