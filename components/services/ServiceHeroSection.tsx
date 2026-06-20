"use client"

import { Sparkles, type LucideIcon } from "lucide-react"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"
import { ServiceHeroArtwork } from "@/components/services/ServiceHeroArtwork"
import type { SpritePosition } from "@/components/homepage/SpriteIcon"

type ServiceHeroSectionProps = {
  badge: string
  title: string
  subtitle: string
  subtitle2?: string
  icon: LucideIcon
  spritePosition: SpritePosition
}

export function ServiceHeroSection({
  badge,
  title,
  subtitle,
  subtitle2,
  icon: Icon,
  spritePosition,
}: ServiceHeroSectionProps) {
  return (
    <CelestialBackground className="px-4 pb-9 pt-8 sm:px-6 lg:px-16 lg:pb-24 lg:pt-10">
      <Container>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md sm:rounded-[2rem]">
          <div className="h-1.5 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple" aria-hidden="true" />

          <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-6 lg:p-10 xl:gap-10">
            <div className="w-full text-center lg:flex-1 lg:text-left">
              <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-astro-purple/10 px-4 py-1.5 text-xs font-semibold text-astro-purple">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {badge}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-astro-purple/20 bg-astro-yellow/30 shadow-sm">
                  <Icon className="h-5 w-5 text-astro-orange" aria-hidden="true" />
                </span>
              </div>

              <h1 className="mb-3 font-serif text-4xl font-extrabold leading-[1.08] text-gray-900 md:text-5xl">
                {title}
              </h1>
              <p className="mx-auto mb-3 max-w-md text-base font-medium leading-relaxed text-gray-600 md:text-lg lg:mx-0">
                {subtitle}
              </p>
              {subtitle2 ? (
                <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500 md:text-base lg:mx-0">
                  {subtitle2}
                </p>
              ) : null}
            </div>

            <div className="flex w-full shrink-0 justify-center lg:w-[46%] lg:justify-center xl:w-[44%]">
              <ServiceHeroArtwork position={spritePosition} />
            </div>
          </div>
        </div>
      </Container>
    </CelestialBackground>
  )
}
