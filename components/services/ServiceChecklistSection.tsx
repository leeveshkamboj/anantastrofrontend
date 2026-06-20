"use client"

import { CheckCircle2 } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

type ServiceChecklistSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  items: string[]
  className?: string
}

export function ServiceChecklistSection({
  eyebrow,
  title,
  subtitle,
  items,
  className,
}: ServiceChecklistSectionProps) {
  return (
    <section className={cn("bg-gray-50/80 px-6 py-20 lg:px-24", className)}>
      <Container>
        <ServiceSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <Stagger className="mx-auto max-w-2xl space-y-4">
          {items.map((item) => (
            <StaggerItem key={item}>
              <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-astro-orange" aria-hidden="true" />
                <span className="text-base leading-relaxed text-gray-700 md:text-lg">{item}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
