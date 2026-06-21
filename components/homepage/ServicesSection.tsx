"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { SpriteIcon, type SpritePosition } from "@/components/homepage/SpriteIcon"

const SPRITE_SRC = "/images/homepage/services/services-sprite.jpg"

const services = [
  { key: "kundli", href: "/services/kundli/generate", position: "top-left" as SpritePosition },
  { key: "horoscope", href: "/services/horoscope", position: "top-right" as SpritePosition },
  { key: "matchmaking", href: "/services/matchmaking", position: "bottom-left" as SpritePosition },
  { key: "reports", href: "/pricing", position: "bottom-right" as SpritePosition },
] as const

export function ServicesSection() {
  const t = useTranslations("home.features")
  const tHome = useTranslations("home.homepage")

  return (
    <AnimatedSection
      id="services"
      className="stars-bg bg-astro-purple px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-20"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <h2 id="services-heading" className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl px-2 text-sm text-gray-400 sm:px-0 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ key, href, position }) => (
            <StaggerItem key={key}>
              <HoverLift className="h-full">
                <CosmicCard className="flex h-full flex-col">
                  <SpriteIcon src={SPRITE_SRC} alt={t(key)} position={position} />
                  <h3 className="mb-2 text-xl font-bold">{t(key)}</h3>
                  <p className="mb-6 text-xs text-gray-600">{t(`${key}Desc`)}</p>
                  <CosmicButton asChild variant="secondary" size="sm" className="mt-auto">
                    <Link href={href}>{tHome("explore")}</Link>
                  </CosmicButton>
                </CosmicCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </AnimatedSection>
  )
}
