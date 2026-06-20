"use client"

import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { CosmicCard } from "@/components/ui/CosmicCard"

export function AboutMissionSection() {
  const t = useTranslations("about")

  return (
    <section className="bg-white px-6 py-20 lg:px-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-3xl font-bold text-astro-purple md:text-4xl">{t("missionTitle")}</h2>
          <p className="mb-4 text-base leading-relaxed text-gray-600 md:text-lg">{t("missionP1")}</p>
          <p className="mb-4 text-base leading-relaxed text-gray-600 md:text-lg">{t("missionP2")}</p>
          <p className="text-base leading-relaxed text-gray-600 md:text-lg">{t("missionP3")}</p>
        </div>

        <CosmicCard
          variant="default"
          padding="md"
          className="flex min-h-72 items-center justify-center bg-astro-purple text-white"
        >
          <div className="text-center">
            <Sparkles className="mx-auto mb-4 h-16 w-16 text-astro-orange" aria-hidden="true" />
            <p className="text-lg font-semibold">{t("missionTitle")}</p>
          </div>
        </CosmicCard>
      </Container>
    </section>
  )
}
