"use client"

import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { BrandLogo } from "@/components/brand/BrandLogo"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion/FadeIn"
import { useMotion } from "@/components/motion/MotionProvider"
import { getChoreographyDelay } from "@/lib/motion"

export function AstrologerRegisterHero() {
  const tNav = useTranslations("nav")
  const { reduced } = useMotion()

  return (
    <section className="bg-hero-gradient px-6 pb-10 pt-12 lg:px-24">
      <Container className="text-center">
        <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("badge", reduced)}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-1.5 text-xs font-semibold text-black">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("becomeAstrologer")}
          </div>
        </FadeIn>

        <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("icon", reduced)}>
          <div className="mb-4 flex justify-center">
            <BrandLogo href={null} size="lg" text={tNav("brand")} showText={false} />
          </div>
        </FadeIn>

        <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("title", reduced)}>
          <h1 className="mb-3 text-4xl font-extrabold text-black md:text-5xl">Become an Astrologer</h1>
        </FadeIn>
        <FadeIn preset="fadeUp" inView={false} delay={getChoreographyDelay("subtitle", reduced)}>
          <p className="mx-auto max-w-xl text-sm text-gray-800 md:text-base">
            Register to become a verified astrologer on {tNav("brand")}
          </p>
        </FadeIn>
      </Container>
    </section>
  )
}
