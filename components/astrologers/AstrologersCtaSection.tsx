"use client"

import { Link } from "@/i18n/navigation"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion/FadeIn"

export function AstrologersCtaSection() {
  const t = useTranslations("astrologersPage")

  return (
    <section className="relative overflow-hidden bg-footer-gradient px-6 py-20 lg:px-24">
      <div
        className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-astro-purple/15 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative">
        <FadeIn preset="fadeUp">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/40 bg-white/75 px-8 py-12 text-center shadow-xl backdrop-blur-md md:px-12">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-astro-orange/15 text-astro-orange">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mb-3 text-3xl font-extrabold text-gray-900 md:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-gray-700">{t("ctaSubtitle")}</p>
          <CosmicButton asChild variant="primary" size="lg" className="rounded-full px-10 shadow-lg">
            <Link href="/auth/register" className="inline-flex items-center gap-2">
              {t("ctaButton")}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CosmicButton>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
