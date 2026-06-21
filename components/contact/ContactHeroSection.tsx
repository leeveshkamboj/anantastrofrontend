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
    <CelestialBackground className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-24 lg:pb-16 lg:pt-12">
      <FadeIn preset="fadeUp">
        <Container className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-astro-dark/10 bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("contact")}
          </div>

          <div className="mb-3 flex justify-center sm:mb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-white sm:h-14 sm:w-14">
              <Mail className="h-6 w-6 text-astro-orange sm:h-7 sm:w-7" aria-hidden="true" />
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-extrabold sm:mb-4 sm:text-4xl md:text-5xl">{t("heroTitle")}</h1>
          <p className="mx-auto max-w-xl px-2 text-sm sm:px-0 md:text-base">{t("heroSubtitle")}</p>
        </Container>
      </FadeIn>
    </CelestialBackground>
  )
}
