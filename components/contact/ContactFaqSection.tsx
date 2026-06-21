"use client"

import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicCard } from "@/components/ui/CosmicCard"

const faqs = [
  { q: "faq1q" as const, a: "faq1a" as const },
  { q: "faq2q" as const, a: "faq2a" as const },
  { q: "faq3q" as const, a: "faq3a" as const },
  { q: "faq4q" as const, a: "faq4a" as const },
]

export function ContactFaqSection() {
  const t = useTranslations("contact")

  return (
    <AnimatedSection className="bg-astro-dark px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <Container>
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">{t("faqTitle")}</h2>
          <p className="px-2 text-sm sm:px-0 sm:text-base">{t("faqSubtitle")}</p>
        </div>

        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map(({ q, a }) => (
            <StaggerItem key={q}>
              <HoverLift className="h-full">
                <CosmicCard variant="glass" padding="md" className="h-full items-start text-left">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{t(q)}</h3>
                  <p className="text-sm text-gray-600 md:text-base">{t(a)}</p>
                </CosmicCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
