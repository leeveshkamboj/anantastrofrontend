"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AnimatedSection } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"

export function AboutCTASection() {
  const t = useTranslations("about")

  return (
    <AnimatedSection className="bg-white px-6 py-20 lg:px-24" preset="scaleIn">
      <Container>
        <CosmicCard variant="glass" padding="md" className="mx-auto max-w-3xl items-center text-center">
          <h2 className="mb-4 text-3xl font-bold text-astro-purple md:text-4xl">{t("ctaTitle")}</h2>
          <p className="mb-8 text-gray-600">{t("ctaSubtitle")}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CosmicButton asChild variant="primary">
              <Link href="/auth/register">{t("getStartedFree")}</Link>
            </CosmicButton>
            <CosmicButton asChild variant="outline">
              <Link href="/contact">{t("contactUs")}</Link>
            </CosmicButton>
          </div>
        </CosmicCard>
      </Container>
    </AnimatedSection>
  )
}
