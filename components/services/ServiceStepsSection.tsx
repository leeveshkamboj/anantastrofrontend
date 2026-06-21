"use client"

import { Container } from "@/components/layout/Container"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { serviceContentSectionClassName } from "@/components/services/service-layout"
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
    <section className={cn("stars-bg bg-astro-purple text-white", serviceContentSectionClassName, className)}>
      <Container>
        <ServiceSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} light />
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {steps.map(({ step, title: stepTitle, description }) => (
            <StaggerItem key={step} className="h-full">
              <CosmicCard className="group flex h-full cursor-pointer flex-col items-start rounded-3xl p-6 text-left backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-astro-orange text-sm font-extrabold text-white shadow-sm">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-extrabold">{stepTitle}</h3>
                <p className="text-sm leading-relaxed">{description}</p>
              </CosmicCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
