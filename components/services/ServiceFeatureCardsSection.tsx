"use client"

import { Calendar, Clock, MapPin, type LucideIcon } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { HoverLift } from "@/components/motion/HoverLift"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

const defaultIcons = [Calendar, Clock, MapPin]

type ServiceFeature = {
  icon?: LucideIcon
  title: string
  description: string
}

type ServiceFeatureCardsSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  features: ServiceFeature[]
  className?: string
}

export function ServiceFeatureCardsSection({
  eyebrow,
  title,
  subtitle,
  features,
  className,
}: ServiceFeatureCardsSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-white px-6 py-20 lg:px-24", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-astro-purple/8 to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <ServiceSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map(({ icon, title: featureTitle, description }, index) => {
            const Icon = icon ?? defaultIcons[index % defaultIcons.length]
            return (
              <StaggerItem key={featureTitle}>
                <HoverLift className="h-full">
                  <article className="group h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg hover:ring-1 hover:ring-astro-orange/20">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-amber-50 text-astro-purple transition group-hover:scale-105">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 text-lg font-extrabold text-gray-900">{featureTitle}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                  </article>
                </HoverLift>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </section>
  )
}
