"use client"

import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicCard } from "@/components/ui/CosmicCard"

export function AboutMissionSection() {
  const t = useTranslations("about")

  return (
    <AnimatedSection className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <Container>
        <Stagger className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <StaggerItem>
            <h2 className="mb-4 text-2xl font-bold text-astro-purple sm:mb-6 sm:text-3xl md:text-4xl">{t("missionTitle")}</h2>
            <p className="mb-3 text-sm leading-relaxed text-gray-600 sm:mb-4 sm:text-base md:text-lg">{t("missionP1")}</p>
            <p className="mb-3 text-sm leading-relaxed text-gray-600 sm:mb-4 sm:text-base md:text-lg">{t("missionP2")}</p>
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">{t("missionP3")}</p>
          </StaggerItem>

          <StaggerItem>
            <HoverLift>
              <CosmicCard
                variant="default"
                padding="md"
                className="flex min-h-48 items-center justify-center bg-astro-purple p-6 text-white sm:min-h-72 sm:p-8"
              >
                <div className="text-center">
                  <Sparkles className="mx-auto mb-4 h-16 w-16 text-astro-orange" aria-hidden="true" />
                  <p className="text-lg font-semibold">{t("missionTitle")}</p>
                </div>
              </CosmicCard>
            </HoverLift>
          </StaggerItem>
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
