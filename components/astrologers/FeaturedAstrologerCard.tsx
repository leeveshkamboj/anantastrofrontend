"use client"

import { ArrowUpRight, MapPin, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { getDisplayRating } from "@/lib/astrologer-utils"
import type { ChatAstrologer } from "@/store/api/chatApi"
import { cn } from "@/lib/utils"

type FeaturedAstrologerCardProps = {
  astrologer: ChatAstrologer
  onStartConsultation: (id: number) => void
  starting?: boolean
}

export function FeaturedAstrologerCard({
  astrologer,
  onStartConsultation,
  starting = false,
}: FeaturedAstrologerCardProps) {
  const t = useTranslations("astrologersPage")
  const rating = getDisplayRating(astrologer.slug)
  const isOffline = astrologer.isOnlineNow === false
  const location = [astrologer.locationCity, astrologer.locationState].filter(Boolean).join(", ")

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-lg ring-1 ring-white/10",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/20",
      )}
    >
      <div className="relative h-28 bg-linear-to-r from-astro-orange/20 via-astro-yellow/30 to-astro-purple/15">
        <Badge className="absolute left-4 top-4 border-0 bg-astro-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
          {t("topRated")}
        </Badge>
        {isOffline ? (
          <span className="absolute right-4 top-4 rounded-full bg-gray-500/90 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
            {t("offline")}
          </span>
        ) : (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {t("onlineNow")}
          </span>
        )}
      </div>

      <div className="relative -mt-14 flex flex-1 flex-col px-5 pb-5 pt-0">
        <div className="mx-auto mb-4">
          <div className="relative">
            <div
              className="absolute inset-0 scale-110 rounded-full bg-astro-yellow/50 blur-lg transition group-hover:bg-astro-orange/40"
              aria-hidden="true"
            />
            <AstrologerAvatar
              astrologer={astrologer}
              variant="featured"
              size={120}
              className="relative h-[7.5rem] w-[7.5rem] border-[5px] border-white shadow-xl"
            />
          </div>
        </div>

        <div className="mb-3 text-center">
          <h3 className="text-xl font-extrabold text-gray-900">{astrologer.displayName}</h3>
          <p className="mt-0.5 text-sm font-semibold text-astro-orange">
            {astrologer.persona || t("personaFallback")}
          </p>
          {location ? (
            <p className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {location}
            </p>
          ) : null}
        </div>

        <div className="mb-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.floor(rating) ? "fill-astro-yellow text-astro-yellow" : "fill-gray-200 text-gray-200",
              )}
              aria-hidden="true"
            />
          ))}
          <span className="ml-1 text-sm font-bold text-gray-800">{rating}</span>
        </div>

        <p className="mb-4 min-h-[3rem] text-center text-sm leading-relaxed text-gray-600">
          {(astrologer.specialties ?? []).slice(0, 2).join(" · ")}
        </p>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {(astrologer.specialties ?? []).slice(0, 2).map((specialty) => (
            <Badge
              key={specialty}
              variant="outline"
              className="rounded-full border-orange-200/80 bg-orange-50 px-3 py-1 text-xs font-semibold text-[#7a3f23]"
            >
              {specialty}
            </Badge>
          ))}
        </div>

        <Button
          className="mt-auto h-12 w-full rounded-2xl bg-linear-to-r from-astro-orange to-[#e87820] text-sm font-bold text-white shadow-md transition group-hover:shadow-lg"
          onClick={() => onStartConsultation(astrologer.id)}
          disabled={starting || isOffline}
        >
          <span className="inline-flex items-center gap-1.5">
            {isOffline ? t("currentlyOffline") : t("startConsultation")}
            {!isOffline && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
          </span>
        </Button>
      </div>
    </article>
  )
}
