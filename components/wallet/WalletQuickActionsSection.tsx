"use client"

import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { cn } from "@/lib/utils"

const ACTIONS = [
  {
    key: "kundli" as const,
    href: "/services/kundli/generate",
    icon: Sparkles,
    accent: "bg-astro-purple/10 text-astro-purple",
  },
  {
    key: "astrologers" as const,
    href: "/astrologers",
    icon: MessageCircle,
    accent: "bg-astro-orange/10 text-astro-orange",
  },
  {
    key: "pricing" as const,
    href: "/pricing",
    icon: Star,
    accent: "bg-emerald-500/10 text-emerald-800",
  },
]

export function WalletQuickActionsSection() {
  const t = useTranslations("wallet")
  const tNav = useTranslations("nav")

  const labels: Record<(typeof ACTIONS)[number]["key"], string> = {
    kundli: tNav("menuKundliTitle"),
    astrologers: tNav("astrologers"),
    pricing: tNav("pricingPlans"),
  }

  const descriptions: Record<(typeof ACTIONS)[number]["key"], string> = {
    kundli: tNav("menuKundliDesc"),
    astrologers: t("quickActionAstrologers"),
    pricing: t("quickActionPricing"),
  }

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-16 lg:py-14">
      <DecorativePlanets variant="wallet-quick-actions" />
      <Container className="relative z-10">
        <ServiceSectionHeader
          eyebrow={t("quickActionsEyebrow")}
          title={t("quickActionsTitle")}
          subtitle={t("quickActionsSubtitle")}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {ACTIONS.map(({ key, href, icon: Icon, accent }) => (
            <Link
              key={key}
              href={href}
              className="group overflow-hidden rounded-[1.5rem] border border-gray-100 bg-gray-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-astro-orange/20 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    accent,
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-astro-orange"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 text-base font-extrabold text-gray-900">{labels[key]}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{descriptions[key]}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
