"use client"

import { Heart, Shield, Star, Users, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { CosmicCard } from "@/components/ui/CosmicCard"

const values: { icon: LucideIcon; titleKey: "v1t" | "v2t" | "v3t" | "v4t"; descKey: "v1d" | "v2d" | "v3d" | "v4d" }[] = [
  { icon: Heart, titleKey: "v1t", descKey: "v1d" },
  { icon: Shield, titleKey: "v2t", descKey: "v2d" },
  { icon: Star, titleKey: "v3t", descKey: "v3d" },
  { icon: Users, titleKey: "v4t", descKey: "v4d" },
]

export function AboutValuesSection() {
  const t = useTranslations("about")

  return (
    <section className="stars-bg bg-astro-purple px-6 py-20 text-white lg:px-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t("valuesTitle")}</h2>
          <p className="mx-auto max-w-2xl text-gray-400">{t("valuesSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, titleKey, descKey }) => (
            <CosmicCard key={titleKey} className="flex flex-col items-start text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-astro-purple text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{t(titleKey)}</h3>
              <p className="text-xs text-gray-600">{t(descKey)}</p>
            </CosmicCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
