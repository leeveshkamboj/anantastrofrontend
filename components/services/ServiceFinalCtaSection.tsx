"use client"

import { ArrowUpRight, Sparkles } from "lucide-react"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion/FadeIn"
import { cn } from "@/lib/utils"

type ServiceFinalCtaSectionProps = {
  title: string
  subtitle: string
  buttonLabel: string
  href: string
  className?: string
}

export function ServiceFinalCtaSection({
  title,
  subtitle,
  buttonLabel,
  href,
  className,
}: ServiceFinalCtaSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-footer-gradient px-6 py-20 lg:px-24", className)}>
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
            <h2 className="mb-3 text-3xl font-extrabold text-gray-900 md:text-4xl">{title}</h2>
            <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-gray-700">{subtitle}</p>
            <CosmicButton asChild variant="primary" size="lg" className="rounded-full px-10 shadow-lg">
              <a href={href} className="inline-flex items-center gap-2">
                {buttonLabel}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </CosmicButton>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
