"use client"

import Image from "next/image"
import { Sparkles, Star, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"

const HERO_ARTWORK = "/images/astrologers/hero-artwork.png"

type AstrologersHeroSectionProps = {
  expertCount?: number
}

export function AstrologersHeroSection({ expertCount = 0 }: AstrologersHeroSectionProps) {
  const t = useTranslations("astrologersPage")
  const tNav = useTranslations("nav")

  return (
    <CelestialBackground className="px-4 pb-9 pt-8 sm:px-6 lg:px-16 lg:pb-24 lg:pt-10">
      <Container>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md sm:rounded-[2rem]">
          <div className="h-1.5 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple" aria-hidden="true" />

          <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-6 lg:p-10 xl:gap-10">
            <div className="w-full text-center lg:flex-1 lg:text-left">
              <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-astro-purple/10 px-4 py-1.5 text-xs font-semibold text-astro-purple">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {tNav("astrologers")}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-astro-purple/20 bg-astro-yellow/30 shadow-sm">
                  <Star className="h-5 w-5 fill-astro-orange text-astro-orange" aria-hidden="true" />
                </span>
              </div>

              <h1 className="mb-3 font-serif text-4xl font-extrabold leading-[1.08] text-gray-900 md:text-5xl">
                {t("heroTitle")}
              </h1>
              <p className="mx-auto mb-5 max-w-md text-base font-medium leading-relaxed text-gray-600 md:text-lg lg:mx-0">
                {t("heroSubtitle")}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                <HeroStat
                  icon={Users}
                  value={expertCount > 0 ? String(expertCount) : "7+"}
                  label={t("heroStatExperts")}
                />
                <HeroStat icon={Star} value="4.8" label={t("heroStatRating")} />
                <span className="rounded-full bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                  {t("heroStatLive")}
                </span>
              </div>
            </div>

            <div className="flex w-full shrink-0 justify-center lg:w-[46%] lg:justify-center xl:w-[44%]">
              <Image
                src={HERO_ARTWORK}
                alt=""
                width={832}
                height={1040}
                priority
                className="h-auto w-60 drop-shadow-[0_12px_32px_rgba(46,10,94,0.2)] sm:w-72 lg:w-96 xl:w-[26rem]"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 384px, 416px"
              />
            </div>
          </div>
        </div>
      </Container>
    </CelestialBackground>
  )
}

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3.5 py-2 shadow-sm">
      <Icon className="h-4 w-4 shrink-0 text-astro-orange" aria-hidden="true" />
      <div className="text-left">
        <p className="text-sm font-extrabold leading-none text-gray-900">{value}</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      </div>
    </div>
  )
}
