"use client"

import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { HoverLift, Stagger, StaggerItem } from "@/components/motion"
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
    pricing: tNav("pricing"),
  }

  const descriptions: Record<(typeof ACTIONS)[number]["key"], string> = {
    kundli: tNav("menuKundliDesc"),
    astrologers: t("quickActionAstrologers"),
    pricing: t("quickActionPricing"),
  }

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-16 lg:py-14">
      <Container>
        <ServiceSectionHeader
          eyebrow={t("quickActionsEyebrow")}
          title={t("quickActionsTitle")}
          subtitle={t("quickActionsSubtitle")}
        />

        <Stagger inView={false} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ACTIONS.map(({ key, href, icon: Icon, accent }) => (
            <StaggerItem key={key} className="h-full">
              <HoverLift className="h-full">
                <Link
                  href={href}
                  className="group flex h-full min-h-38 flex-col rounded-3xl border border-gray-100 bg-gray-50/80 p-5 shadow-sm transition hover:border-astro-orange/20 hover:bg-white hover:shadow-md"
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
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-500">
                    {descriptions[key]}
                  </p>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
