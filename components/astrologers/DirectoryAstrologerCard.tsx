"use client"

import { ArrowUpRight, MapPin, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatPerMinutePrice } from "@/components/coins/ChatPerMinutePrice"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { AstrologerTypeBadge } from "@/components/astrologers/AstrologerTypeBadge"
import { getDisplayRating, getDisplayYearsOfExperience } from "@/lib/astrologer-utils"
import type { ChatAstrologer } from "@/store/api/chatApi"
import { cn } from "@/lib/utils"

type DirectoryAstrologerCardProps = {
  astrologer: ChatAstrologer
  onStartConsultation: (id: number) => void
  starting?: boolean
}

export function DirectoryAstrologerCard({
  astrologer,
  onStartConsultation,
  starting = false,
}: DirectoryAstrologerCardProps) {
  const t = useTranslations("astrologersPage")
  const rating = getDisplayRating(astrologer.slug)
  const yearsOfExperience = getDisplayYearsOfExperience(astrologer)
  const isOffline = astrologer.isOnlineNow === false
  const location = [astrologer.locationCity, astrologer.locationState].filter(Boolean).join(", ")

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-3xl bg-white p-5 text-left shadow-md ring-1 ring-black/5",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-astro-orange/30",
      )}
    >
      <div className="mb-4 flex items-start gap-3.5">
        <div className="relative shrink-0">
          <div className="rounded-full bg-linear-to-br from-astro-yellow/40 to-astro-orange/20 p-0.5">
            <AstrologerAvatar
              astrologer={astrologer}
              variant="directory"
              size={76}
              className="h-[4.75rem] w-[4.75rem] border-[3px] border-white shadow-sm"
            />
          </div>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white shadow-sm",
              isOffline ? "bg-gray-400" : "bg-emerald-500",
            )}
            title={isOffline ? t("offline") : t("onlineNow")}
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate text-lg font-extrabold text-gray-900">{astrologer.displayName}</h3>
          <AstrologerTypeBadge astrologerType={astrologer.astrologerType} className="mt-1" />
          <p className="mt-1 text-sm font-medium text-astro-orange">{astrologer.persona || t("personaFallback")}</p>
          {location ? (
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              {location}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {(astrologer.specialties ?? []).slice(0, 2).map((specialty) => (
          <Badge
            key={specialty}
            variant="outline"
            className="rounded-full border-purple-100 bg-purple-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-astro-purple"
          >
            {specialty}
          </Badge>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-b from-gray-50 to-white">
        <StatCell
          label={t("statRating")}
          value={
            <span className="inline-flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-astro-yellow text-astro-yellow" aria-hidden="true" />
              {rating}
            </span>
          }
        />
        <StatCell label={t("statExperience")} value={`${yearsOfExperience}+`} />
        <StatCell
          label={t("statPerMin")}
          value={
            <ChatPerMinutePrice
              coinsPerMinute={astrologer.coinsPerMinute}
              className="text-sm font-extrabold text-gray-900"
              glyphClassName="h-3.5 w-3.5 text-astro-orange"
            />
          }
        />
      </div>

      <Button
        className="mt-auto h-11 w-full rounded-2xl bg-astro-orange text-sm font-bold text-white shadow-sm transition hover:bg-[#e87820] group-hover:shadow-md"
        onClick={() => onStartConsultation(astrologer.id)}
        disabled={starting || isOffline}
      >
        <span className="inline-flex items-center gap-1.5">
          {isOffline ? t("currentlyOffline") : t("startConsultation")}
          {!isOffline && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
        </span>
      </Button>
    </article>
  )
}

function StatCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-2 py-3 text-center">
      <p className="text-sm font-extrabold tabular-nums text-gray-900">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    </div>
  )
}
