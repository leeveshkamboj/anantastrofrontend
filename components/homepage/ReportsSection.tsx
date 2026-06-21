"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { SpriteIcon, type SpritePosition } from "@/components/homepage/SpriteIcon"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"

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
    <AnimatedSection
      className="relative overflow-hidden bg-white px-4 py-12 text-astro-purple sm:px-6 sm:py-16 lg:px-24 lg:py-20"
      aria-labelledby="reports-heading"
    >
      <DecorativePlanets />

      <Container className="relative z-10">
        <div className="mb-10 text-center sm:mb-16">
          <h2 id="reports-heading" className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl px-2 text-sm text-gray-600 sm:px-0 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reports.map(({ key, position, sampleHref, getHref }) => (
            <StaggerItem key={key}>
              <HoverLift className="h-full">
                <CosmicCard className="flex h-full flex-col border border-gray-100 shadow-md">
                  <SpriteIcon
                    src={SPRITE_SRC}
                    alt={t(`${key}Title`)}
                    position={position}
                  />
                  <h3 className="mb-2 text-xl font-bold">{t(`${key}Title`)}</h3>
                  <p className="mb-6 text-xs text-gray-600">{t(`${key}Desc`)}</p>
                  <div className="mt-auto flex w-full flex-col gap-2 sm:flex-row">
                    <CosmicButton asChild variant="outline" size="pill">
                      <Link href={sampleHref}>{tHome("viewSample")}</Link>
                    </CosmicButton>
                    <CosmicButton asChild variant="secondary" size="pill">
                      <Link href={getHref}>{tHome("getReport")}</Link>
                    </CosmicButton>
                  </div>
                </CosmicCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
