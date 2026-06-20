"use client"

import { Sparkles } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

type ServiceInfoSectionProps = {
  eyebrow?: string
  title: string
  paragraphs: string[]
  aside: string
  className?: string
}

export function ServiceInfoSection({
  eyebrow,
  title,
  paragraphs,
  aside,
  className,
}: ServiceInfoSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-white px-6 py-20 lg:px-24", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-astro-purple/8 to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <ServiceSectionHeader
              eyebrow={eyebrow}
              title={title}
              className="mb-6 text-left md:mb-8 [&_h2]:text-left [&_p]:mx-0 [&_p]:text-left"
            />
            <div className="space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-gray-600 md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-3xl border border-astro-purple/15 bg-linear-to-br from-astro-purple/10 via-white to-astro-yellow/10 p-8 md:p-12 shadow-sm">
              <Sparkles className="mx-auto h-24 w-24 text-astro-purple opacity-80" aria-hidden="true" />
              <p className="mt-4 text-center text-base font-semibold text-gray-700">{aside}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
