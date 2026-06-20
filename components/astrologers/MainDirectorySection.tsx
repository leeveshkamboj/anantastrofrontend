"use client"

import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { AstrologersSectionHeader } from "@/components/astrologers/AstrologersSectionHeader"
import { DirectoryAstrologerCard } from "@/components/astrologers/DirectoryAstrologerCard"
import type { ChatAstrologer } from "@/store/api/chatApi"

type MainDirectorySectionProps = {
  astrologers: ChatAstrologer[]
  isLoading: boolean
  onStartConsultation: (id: number) => void
  starting?: boolean
}

export function MainDirectorySection({
  astrologers,
  isLoading,
  onStartConsultation,
  starting = false,
}: MainDirectorySectionProps) {
  const t = useTranslations("astrologersPage")

  return (
    <section className="relative px-6 pb-20 pt-2 lg:px-24">
      <Container>
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{t("directoryDivider")}</span>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
        </div>

        <AstrologersSectionHeader
          light
          eyebrow={t("directoryEyebrow")}
          title={t("directoryTitle")}
          subtitle={t("directorySubtitle")}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/10 px-10 py-8 backdrop-blur-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-astro-orange border-t-transparent" />
              <p className="font-medium text-purple-100">{t("loadingList")}</p>
            </div>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-sm">
            <p className="text-lg font-semibold text-white">{t("noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {astrologers.map((astrologer) => (
              <DirectoryAstrologerCard
                key={astrologer.id}
                astrologer={astrologer}
                onStartConsultation={onStartConsultation}
                starting={starting}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
