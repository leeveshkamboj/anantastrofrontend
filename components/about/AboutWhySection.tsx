"use client"

import { Heart, Shield, Star, Zap, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicCard } from "@/components/ui/CosmicCard"

const whyItems: { icon: LucideIcon; titleKey: "w1t" | "w2t" | "w3t" | "w4t"; descKey: "w1d" | "w2d" | "w3d" | "w4d" }[] = [
  { icon: Zap, titleKey: "w1t", descKey: "w1d" },
  { icon: Shield, titleKey: "w2t", descKey: "w2d" },
  { icon: Star, titleKey: "w3t", descKey: "w3d" },
  { icon: Heart, titleKey: "w4t", descKey: "w4d" },
]

export function AboutWhySection() {
  const t = useTranslations("about")

  return (
    <AnimatedSection className="bg-footer-gradient px-6 py-20 lg:px-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-black">{t("whyTitle")}</h2>
        </div>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {whyItems.map(({ icon: Icon, titleKey, descKey }) => (
            <StaggerItem key={titleKey}>
              <HoverLift className="h-full">
                <CosmicCard variant="glass" padding="md" className="h-full items-start text-left">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-astro-purple text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{t(titleKey)}</h3>
                  </div>
                  <p className="text-sm text-gray-600 md:text-base">{t(descKey)}</p>
                </CosmicCard>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </AnimatedSection>
  )
}
