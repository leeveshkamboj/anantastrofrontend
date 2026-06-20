"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { SpriteIcon, type SpritePosition } from "@/components/homepage/SpriteIcon"

const SPRITE_SRC = "/images/homepage/reports/reports-sprite.jpg"

const reports = [
  {
    key: "career",
    position: "top-left" as SpritePosition,
    sampleHref: "/pricing",
    getHref: "/services/kundli/generate",
  },
  {
    key: "love",
    position: "top-right" as SpritePosition,
    sampleHref: "/pricing",
    getHref: "/services/matchmaking",
  },
  {
    key: "personality",
    position: "bottom-left" as SpritePosition,
    sampleHref: "/pricing",
    getHref: "/services/kundli/generate",
  },
  {
    key: "daily",
    position: "bottom-right" as SpritePosition,
    sampleHref: "/services/horoscope",
    getHref: "/services/horoscope",
  },
] as const

export function ReportsSection() {
  const t = useTranslations("home.aiReports")
  const tHome = useTranslations("home.homepage")

  return (
    <section
      className="relative overflow-hidden bg-white px-6 py-20 text-astro-purple lg:px-24"
      aria-labelledby="reports-heading"
    >
      <DecorativePlanets />

      <Container className="relative z-10">
        <div className="mb-16 text-center">
          <h2 id="reports-heading" className="mb-4 text-3xl font-bold">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reports.map(({ key, position, sampleHref, getHref }) => (
            <CosmicCard key={key} className="flex flex-col border border-gray-100 shadow-md">
              <SpriteIcon
                src={SPRITE_SRC}
                alt={t(`${key}Title`)}
                position={position}
              />
              <h3 className="mb-2 text-xl font-bold">{t(`${key}Title`)}</h3>
              <p className="mb-6 text-xs text-gray-600">{t(`${key}Desc`)}</p>
              <div className="mt-auto flex w-full gap-2">
                <CosmicButton asChild variant="outline" size="pill">
                  <Link href={sampleHref}>{tHome("viewSample")}</Link>
                </CosmicButton>
                <CosmicButton asChild variant="secondary" size="pill">
                  <Link href={getHref}>{tHome("getReport")}</Link>
                </CosmicButton>
              </div>
            </CosmicCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
