"use client"

import { Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicCard } from "@/components/ui/CosmicCard"

const team = [
  { nameKey: "team1n" as const, roleKey: "team1r" as const, descKey: "team1d" as const },
  { nameKey: "team2n" as const, roleKey: "team2r" as const, descKey: "team2d" as const },
  { nameKey: "team3n" as const, roleKey: "team3r" as const, descKey: "team3d" as const },
]

export function AboutTeamSection() {
  const t = useTranslations("about")

  return (
    <AnimatedSection className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <DecorativePlanets variant="about" />
      <Container className="relative z-10">
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold text-astro-purple sm:mb-4 sm:text-3xl">{t("teamTitle")}</h2>
          <p className="mx-auto max-w-2xl px-2 text-sm text-gray-600 sm:px-0 sm:text-base">{t("teamSubtitle")}</p>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map(({ nameKey, roleKey, descKey }) => (
            <StaggerItem key={nameKey}>
              <HoverLift className="h-full">
                <CosmicCard className="flex h-full flex-col text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-astro-purple text-white">
                    <Users className="h-10 w-10" aria-hidden="true" />
                  </div>
                  <h3 className="mb-1 text-xl font-bold">{t(nameKey)}</h3>
                  <p className="mb-4 text-sm font-semibold text-astro-orange">{t(roleKey)}</p>
                  <p className="text-sm text-gray-600">{t(descKey)}</p>
                </CosmicCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
