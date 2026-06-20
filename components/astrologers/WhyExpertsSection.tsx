"use client"

import { Calendar, Moon, Sparkles, Sun, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AstrologersSectionHeader } from "@/components/astrologers/AstrologersSectionHeader"

const experts: {
  icon: LucideIcon
  titleKey: "why1t" | "why2t" | "why3t" | "why4t"
  descKey: "why1d" | "why2d" | "why3d" | "why4d"
  accent: string
}[] = [
  { icon: Sparkles, titleKey: "why1t", descKey: "why1d", accent: "from-orange-100 to-amber-50" },
  { icon: Sun, titleKey: "why2t", descKey: "why2d", accent: "from-yellow-100 to-orange-50" },
  { icon: Moon, titleKey: "why3t", descKey: "why3d", accent: "from-purple-100 to-violet-50" },
  { icon: Calendar, titleKey: "why4t", descKey: "why4d", accent: "from-rose-100 to-orange-50" },
]

export function WhyExpertsSection() {
  const t = useTranslations("astrologersPage")

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 lg:px-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-astro-purple/8 to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <AstrologersSectionHeader
          eyebrow={t("whyEyebrow")}
          title={t("whyTitle")}
          subtitle={t("whySubtitle")}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experts.map(({ icon: Icon, titleKey, descKey, accent }) => (
            <article
              key={titleKey}
              className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-astro-orange/20"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${accent} text-astro-purple transition group-hover:scale-105`}
              >
                <Icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-lg font-extrabold text-gray-900">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{t(descKey)}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
