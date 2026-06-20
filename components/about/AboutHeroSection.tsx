"use client"

import { Sparkles, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion"

export function AboutHeroSection() {
  const t = useTranslations("about")
  const tNav = useTranslations("nav")

  return (
    <CelestialBackground className="px-6 pb-16 pt-12 lg:px-24">
      <FadeIn preset="fadeUp">
        <Container className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-1.5 text-xs font-semibold text-black">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("about")}
          </div>

          <div className="mb-4 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-white">
              <Star className="h-7 w-7 fill-astro-orange text-astro-orange" aria-hidden="true" />
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold text-black md:text-5xl">{t("heroTitle")}</h1>
          <p className="mx-auto max-w-xl text-sm text-gray-800 md:text-base">{t("heroSubtitle")}</p>
        </Container>
      </FadeIn>
    </CelestialBackground>
  )
}
