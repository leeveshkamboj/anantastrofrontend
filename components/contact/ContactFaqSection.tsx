"use client"

import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
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
    <section className="bg-astro-dark text-white px-6 py-20 lg:px-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">{t("faqTitle")}</h2>
          <p>{t("faqSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map(({ q, a }) => (
            <CosmicCard key={q} variant="glass" padding="md" className="items-start text-left">
              <h3 className="mb-3 text-lg font-bold text-gray-900">{t(q)}</h3>
              <p className="text-sm text-gray-600 md:text-base">{t(a)}</p>
            </CosmicCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
