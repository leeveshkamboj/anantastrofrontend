"use client"

import { Container } from "@/components/layout/Container"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

type ServiceFormSectionProps = {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function ServiceFormSection({
  id,
  title,
  subtitle,
  children,
  className,
  narrow = true,
}: ServiceFormSectionProps) {
  return (
    <section id={id} className={cn("bg-gray-50/80 px-6 py-20 lg:px-24", className)}>
      <Container size={narrow ? "narrow" : "default"}>
        <ServiceSectionHeader title={title} subtitle={subtitle} />
        {children}
      </Container>
    </section>
  )
}

export const serviceFormCardClassName =
  "overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md"

export const serviceProfileButtonClassName = (selected: boolean) =>
  selected
    ? "border-2 !border-astro-orange bg-astro-orange/10 shadow-sm"
    : "border-2 border-gray-200 bg-white hover:border-astro-orange/50 hover:bg-astro-orange/5"

export const serviceProfileIconClassName = (selected: boolean) =>
  selected ? "bg-astro-orange text-white" : "bg-gray-100 text-gray-500"
