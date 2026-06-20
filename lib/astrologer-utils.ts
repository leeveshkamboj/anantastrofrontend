import type { ChatAstrologer } from '@/store/api/chatApi';

export const FEATURED_ASTROLOGER_SLUGS = ['arya', 'nirav', 'maitri'] as const;

export const YEARS_OF_EXPERIENCE = 8;

export type AstrologerFilters = {
  language: string;
  expertise: string;
  rating: string;
  availability: string;
};

export const DEFAULT_ASTROLOGER_FILTERS: AstrologerFilters = {
  language: 'all',
  expertise: 'all',
  rating: 'all',
  availability: 'all',
};

export function getDisplayRating(slug: string): number {
  const hash = slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Math.round((4.3 + (hash % 7) * 0.1) * 10) / 10;
}

export function getDirectoryAvatarUrl(item: Pick<ChatAstrologer, 'slug' | 'avatarUrl'>): string {
  if (item.avatarUrl?.trim()) return item.avatarUrl;
  return `/images/astrologers/directory/${item.slug}.png`;
}

export function getVectorAvatarUrl(item: Pick<ChatAstrologer, 'slug' | 'displayName' | 'id'>): string {
  const seed = encodeURIComponent(item.slug || item.displayName || String(item.id));
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
}

export function getFeaturedAvatarUrl(item: Pick<ChatAstrologer, 'slug' | 'avatarUrl'>): string {
  if (item.avatarUrl?.trim()) return item.avatarUrl;
  return `/images/astrologers/featured/${item.slug}.jpg`;
}

export function isFeaturedAstrologer(slug: string): boolean {
  return FEATURED_ASTROLOGER_SLUGS.includes(slug as (typeof FEATURED_ASTROLOGER_SLUGS)[number]);
}

export function collectExpertiseOptions(astrologers: ChatAstrologer[]): string[] {
  const set = new Set<string>();
  for (const astro of astrologers) {
    for (const specialty of astro.specialties ?? []) {
      if (specialty.trim()) set.add(specialty);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function filterAstrologers(
  astrologers: ChatAstrologer[],
  filters: AstrologerFilters,
): ChatAstrologer[] {
  return astrologers.filter((item) => {
    if (filters.expertise !== 'all') {
      const specialties = item.specialties ?? [];
      if (!specialties.includes(filters.expertise)) return false;
    }

    if (filters.rating !== 'all') {
      const minRating = filters.rating === '4.5+' ? 4.5 : 4;
      if (getDisplayRating(item.slug) < minRating) return false;
    }

    if (filters.availability === 'online' && !item.isOnlineNow) return false;

    return true;
  });
}

export function splitFeaturedAndDirectory(
  astrologers: ChatAstrologer[],
): { featured: ChatAstrologer[]; directory: ChatAstrologer[] } {
  const featured = astrologers.filter((a) => isFeaturedAstrologer(a.slug));
  const directory = astrologers;
  return { featured, directory };
}
