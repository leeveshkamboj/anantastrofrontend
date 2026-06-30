"use client"

import { motion } from "framer-motion"
import { ArrowLeft, MapPin, PhoneOff } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { CoinGlyph } from "@/components/coins/CoinGlyph"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { cn } from "@/lib/utils"
import type { ChatAstrologer } from "@/store/api/chatApi"

type ChatSessionHeaderProps = {
  astrologer?: ChatAstrologer
  balance: number
  coinsPerMinute: number
  freeServicesEnabled?: boolean
  elapsedLabel: string
  nextBillLabel: string
  billedSecondsLive: number
  isSessionClosed: boolean
  ending: boolean
  onEndChat: () => void
}

export function ChatSessionHeader({
  astrologer,
  balance,
  coinsPerMinute,
  freeServicesEnabled = false,
  elapsedLabel,
  nextBillLabel,
  billedSecondsLive,
  isSessionClosed,
  ending,
  onEndChat,
}: ChatSessionHeaderProps) {
  const t = useTranslations("chatSession")
  const tConv = useTranslations("conversations")

  const astroName = astrologer?.displayName || t("astrologerFallback")
  const specialtyText = astrologer?.specialties?.length
    ? astrologer.specialties.slice(0, 3).join(" • ")
    : t("specialtyFallback")
  const locationText = [astrologer?.locationCity, astrologer?.locationState, astrologer?.locationCountry]
    .filter(Boolean)
    .join(", ")

  return (
    <FadeIn preset="fadeDown" className="shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
      <div className="mb-4">
        <Link
          href="/conversations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-astro-purple transition hover:text-astro-orange"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {tConv("title")}
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {astrologer ? (
            <motion.div
              className="relative shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <AstrologerAvatar
                astrologer={astrologer}
                variant="directory"
                size={52}
                className="border-2 border-white shadow-sm"
              />
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                  astrologer.isOnlineNow ? "bg-emerald-500" : "bg-gray-400",
                )}
                aria-hidden="true"
              />
              {astrologer.isOnlineNow ? (
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                  animate={{ scale: [1, 1.45, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              ) : null}
            </motion.div>
          ) : null}

          <div className="min-w-0">
            <h1 className="truncate font-serif text-xl font-extrabold text-gray-900 sm:text-2xl">
              {astroName}
            </h1>
            <p className="mt-0.5 text-xs font-medium text-gray-600 sm:text-sm">{specialtyText}</p>
            {locationText ? (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {locationText}
              </p>
            ) : null}

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-semibold text-gray-700">
                {freeServicesEnabled && coinsPerMinute > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <CoinGlyph className="h-3.5 w-3.5 text-astro-orange" />
                    <span className="line-through tabular-nums text-gray-500">{coinsPerMinute}</span>
                    <span className="text-emerald-700">Free</span>
                    <span>/min</span>
                  </span>
                ) : (
                  <>
                    <CoinGlyph className="h-3.5 w-3.5 text-astro-orange" />
                    {t("perMin", { n: coinsPerMinute })}
                  </>
                )}
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-semibold text-gray-700">
                {t("wallet")} {balance}
              </span>
            </div>
          </div>
        </div>

        <CosmicButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onEndChat}
          disabled={ending || isSessionClosed}
          className="w-full shrink-0 border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 sm:w-auto normal-case tracking-normal"
        >
          <PhoneOff className="mr-1.5 h-4 w-4" />
          {isSessionClosed ? t("chatEnded") : ending ? t("ending") : t("endChat")}
        </CosmicButton>
      </div>

      <Stagger inView={false} className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <StaggerItem preset="fadeIn">
          <StatChip label={t("session")} value={elapsedLabel} />
        </StaggerItem>
        <StaggerItem preset="fadeIn">
          <StatChip label={t("nextBill")} value={nextBillLabel} />
        </StaggerItem>
        <StaggerItem preset="fadeIn">
          <StatChip label={t("billed")} value={`${billedSecondsLive}s`} />
        </StaggerItem>
      </Stagger>
    </FadeIn>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-gray-700">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold tabular-nums text-gray-900">{value}</span>
    </span>
  )
}
