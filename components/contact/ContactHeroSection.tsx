"use client"

import { Mail, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion"

export function ContactHeroSection() {
  const t = useTranslations("contact")
  const tNav = useTranslations("nav")

  return (
    <CelestialBackground className="px-6 pb-16 pt-12 lg:px-24">
      <FadeIn preset="fadeUp">
        <Container className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-astro-dark/10 bg-white/80 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("contact")}
          </div>

          <div className="mb-4 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-white">
              <Mail className="h-7 w-7 text-astro-orange" aria-hidden="true" />
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">{t("heroTitle")}</h1>
          <p className="mx-auto max-w-xl text-sm md:text-base">{t("heroSubtitle")}</p>
        </Container>
      </FadeIn>
    </CelestialBackground>
  )
}
