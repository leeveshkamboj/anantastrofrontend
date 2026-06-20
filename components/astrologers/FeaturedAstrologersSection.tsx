"use client"

import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { AstrologersSectionHeader } from "@/components/astrologers/AstrologersSectionHeader"
import { FeaturedAstrologerCard } from "@/components/astrologers/FeaturedAstrologerCard"
import { HoverLift } from "@/components/motion/HoverLift"
import { Stagger, StaggerItem } from "@/components/motion/Stagger"
import type { ChatAstrologer } from "@/store/api/chatApi"

type FeaturedAstrologersSectionProps = {
  astrologers: ChatAstrologer[]
  onStartConsultation: (id: number) => void
  starting?: boolean
}

export function FeaturedAstrologersSection({
  astrologers,
  onStartConsultation,
  starting = false,
}: FeaturedAstrologersSectionProps) {
  const t = useTranslations("astrologersPage")

  if (astrologers.length === 0) return null

  return (
    <section className="relative overflow-hidden px-6 pb-6 pt-4 lg:px-24">
      <DecorativePlanets variant="pricing" />
      <Container className="relative">
        <AstrologersSectionHeader
          eyebrow={t("featuredEyebrow")}
          title={t("featuredTitle")}
          subtitle={t("featuredSubtitle")}
        />

        <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {astrologers.map((astrologer) => (
            <StaggerItem key={astrologer.id}>
              <HoverLift className="h-full">
                <FeaturedAstrologerCard
                  astrologer={astrologer}
                  onStartConsultation={onStartConsultation}
                  starting={starting}
                />
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
