"use client"

import { Container } from "@/components/layout/Container"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"
import { CosmicCard } from "../ui/CosmicCard"

type ServiceStep = {
  step: number
  title: string
  description: string
}

type ServiceStepsSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  steps: ServiceStep[]
  className?: string
}

export function ServiceStepsSection({
  eyebrow,
  title,
  subtitle,
  steps,
  className,
}: ServiceStepsSectionProps) {
  return (
    <section className={cn("stars-bg bg-astro-purple px-6 py-20 text-white lg:px-24", className)}>
      <Container>
        <ServiceSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} light />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title: stepTitle, description }) => (
            <CosmicCard
              key={step}
              className="group rounded-3xl  p-6 backdrop-blur-sm transition hover:-translate-y-1 cursor-pointer hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-astro-orange text-sm font-extrabold text-white shadow-sm">
                {step}
              </div>
              <h3 className="mb-2 text-lg font-extrabold ">{stepTitle}</h3>
              <p className="text-sm leading-relaxed ">{description}</p>
            </CosmicCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
