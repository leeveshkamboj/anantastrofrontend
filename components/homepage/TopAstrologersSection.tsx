"use client"

import { useMemo, useState } from "react"
import { Link, useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useSelector } from "react-redux"
import { useGetChatAstrologersQuery } from "@/store/api/chatApi"
import { FeaturedAstrologerCard } from "@/components/astrologers/FeaturedAstrologerCard"
import { StartChatDialog } from "@/components/astrologers/StartChatDialog"
import { Container } from "@/components/layout/Container"
import { AnimatedSection, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { splitFeaturedAndDirectory } from "@/lib/astrologer-utils"
import { selectIsAuthenticated } from "@/store/slices/authSlice"

export function TopAstrologersSection() {
  const t = useTranslations("home.topAstrologers")
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { data, isLoading } = useGetChatAstrologersQuery()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [activeAstrologerId, setActiveAstrologerId] = useState<number | null>(null)

  const astrologers = data?.data ?? []
  const featured = useMemo(
    () => splitFeaturedAndDirectory(astrologers).featured,
    [astrologers],
  )
  const activeAstrologer = astrologers.find((a) => a.id === activeAstrologerId)

  const openStartChatDialog = (astrologerId: number) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=${encodeURIComponent("/")}`)
      return
    }
    setActiveAstrologerId(astrologerId)
    setShowProfileDialog(true)
  }

  if (isLoading || featured.length === 0) return null

  return (
    <>
      <AnimatedSection
        id="top-astrologers"
        className="stars-bg bg-astro-purple px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-20"
        aria-labelledby="top-astrologers-heading"
      >
        <Container>
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-astro-yellow ring-1 ring-white/20">
              {t("eyebrow")}
            </p>
            <h2 id="top-astrologers-heading" className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-2xl px-2 text-sm text-gray-400 sm:px-0 sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((astrologer) => (
              <StaggerItem key={astrologer.id}>
                <HoverLift className="h-full">
                  <FeaturedAstrologerCard
                    astrologer={astrologer}
                    onStartConsultation={openStartChatDialog}
                  />
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 text-center sm:mt-12">
            <CosmicButton asChild variant="secondary" size="lg">
              <Link href="/astrologers">{t("viewAll")}</Link>
            </CosmicButton>
          </div>
        </Container>
      </AnimatedSection>

      <StartChatDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        activeAstrologer={activeAstrologer}
      />
    </>
  )
}
