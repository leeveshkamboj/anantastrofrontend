"use client"

import { HelpCircle } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

type ServiceFaqItem = {
  question: string
  answer: string
}

type ServiceFaqSectionProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  items: ServiceFaqItem[]
  className?: string
}

export function ServiceFaqSection({ eyebrow, title, subtitle, items, className }: ServiceFaqSectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-white px-6 py-20 lg:px-24", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-astro-purple/8 to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <div className="mb-10 flex justify-center md:mb-12">
          <HelpCircle className="h-10 w-10 text-astro-purple" aria-hidden="true" />
        </div>
        <ServiceSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mx-auto max-w-3xl space-y-4">
          {items.map(({ question, answer }) => (
            <article
              key={question}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-extrabold text-gray-900">{question}</h3>
              <p className="leading-relaxed text-gray-600">{answer}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
