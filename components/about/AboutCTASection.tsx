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
    <AnimatedSection className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20" preset="scaleIn">
      <Container>
        <CosmicCard variant="glass" padding="md" className="mx-auto max-w-3xl items-center p-5 text-center sm:p-8">
          <h2 className="mb-3 text-2xl font-bold text-astro-purple sm:mb-4 sm:text-3xl md:text-4xl">{t("ctaTitle")}</h2>
          <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">{t("ctaSubtitle")}</p>
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
