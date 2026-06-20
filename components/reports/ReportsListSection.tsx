"use client"

import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  BookOpen,
  FileText,
  Heart,
  Loader2,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import type {
  HoroscopeReport,
  KundliGeneration,
  MatchmakingReport,
} from "@/store/api/kundliApi"

type ReportsListSectionProps = {
  kundliReports: KundliGeneration[]
  horoscopeReports: HoroscopeReport[]
  matchmakingReports: MatchmakingReport[]
  isLoading: boolean
}

function ReportsSectionCard({
  icon: Icon,
  iconClassName,
  title,
  count,
  children,
}: {
  icon: LucideIcon
  iconClassName: string
  title: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md">
      <div
        className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
        aria-hidden="true"
      />
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl",
              iconClassName,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold tabular-nums text-gray-600">
                {count}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2 px-4 py-4 sm:px-5">{children}</div>
    </div>
  )
}

function ReportCard({
  href,
  title,
  children,
}: {
  href: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-2xl border border-transparent bg-gray-50 px-4 py-3.5 transition-colors hover:border-astro-purple/10 hover:bg-white"
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-extrabold text-gray-900">{title}</h3>
        <div className="mt-1.5 space-y-1 text-sm text-gray-600">{children}</div>
      </div>
      <ArrowRight
        className="mt-0.5 h-5 w-5 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-astro-orange"
        aria-hidden="true"
      />
    </Link>
  )
}

function SectionEmpty({
  message,
  linkHref,
  linkLabel,
}: {
  message: string
  linkHref: string
  linkLabel: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 px-4 py-8 text-center text-sm text-gray-600">
      {message}{" "}
      <Link href={linkHref} className="font-semibold text-astro-purple hover:underline">
        {linkLabel}
      </Link>
    </div>
  )
}

export function ReportsListSection({
  kundliReports,
  horoscopeReports,
  matchmakingReports,
  isLoading,
}: ReportsListSectionProps) {
  const t = useTranslations("reports")
  const hasAny =
    kundliReports.length > 0 || horoscopeReports.length > 0 || matchmakingReports.length > 0

  return (
    <section className="bg-gray-50/80 px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
      <Container>
        <ServiceSectionHeader
          eyebrow={t("libraryEyebrow")}
          title={t("libraryTitle")}
          subtitle={hasAny ? t("librarySubtitle") : undefined}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-astro-purple" />
          </div>
        ) : !hasAny ? (
          <div className="mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md">
            <div
              className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
              aria-hidden="true"
            />
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto h-14 w-14 text-astro-purple/25" />
              <h2 className="mt-4 text-lg font-extrabold text-gray-900">{t("emptyTitle")}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">{t("emptyHint")}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <CosmicButton asChild className="normal-case tracking-normal">
                  <Link href="/services/kundli/generate">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t("ctaCreateKundli")}
                  </Link>
                </CosmicButton>
                <CosmicButton asChild variant="outline" className="normal-case tracking-normal">
                  <Link href="/services/horoscope">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t("ctaGetHoroscope")}
                  </Link>
                </CosmicButton>
                <CosmicButton asChild variant="outline" className="normal-case tracking-normal">
                  <Link href="/services/matchmaking">
                    <Heart className="mr-2 h-4 w-4" />
                    {t("ctaCreateGunMilan")}
                  </Link>
                </CosmicButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <ReportsSectionCard
              icon={BookOpen}
              iconClassName="bg-astro-purple/10 text-astro-purple"
              title={t("headingKundli")}
              count={kundliReports.length}
            >
              {kundliReports.length === 0 ? (
                <SectionEmpty
                  message={t("kundliSectionEmpty")}
                  linkHref="/services/kundli/generate"
                  linkLabel={t("kundliSectionLink")}
                />
              ) : (
                kundliReports.map((report) => (
                  <ReportCard
                    key={report.uuid}
                    href={`/services/kundli/result/${report.uuid}`}
                    title={report.name || t("fallbackKundliTitle")}
                  >
                    <div className="flex flex-wrap gap-x-2">
                      <span>{report.dob}</span>
                      {report.time ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{report.time}</span>
                        </>
                      ) : null}
                    </div>
                    {report.placeOfBirth ? <p className="truncate">{report.placeOfBirth}</p> : null}
                  </ReportCard>
                ))
              )}
            </ReportsSectionCard>

            <ReportsSectionCard
              icon={Sparkles}
              iconClassName="bg-astro-orange/10 text-astro-orange"
              title={t("headingHoroscope")}
              count={horoscopeReports.length}
            >
              {horoscopeReports.length === 0 ? (
                <SectionEmpty
                  message={t("horoscopeSectionEmpty")}
                  linkHref="/services/horoscope"
                  linkLabel={t("horoscopeSectionLink")}
                />
              ) : (
                horoscopeReports.map((report) => (
                  <ReportCard
                    key={report.uuid}
                    href={`/services/horoscope/result/${report.uuid}`}
                    title={report.name || t("fallbackHoroscopeTitle")}
                  >
                    <div className="flex flex-wrap gap-x-2 capitalize">
                      <span>{report.period}</span>
                      {report.dob ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>{report.dob}</span>
                        </>
                      ) : null}
                    </div>
                    {report.placeOfBirth ? <p className="truncate">{report.placeOfBirth}</p> : null}
                  </ReportCard>
                ))
              )}
            </ReportsSectionCard>

            <ReportsSectionCard
              icon={Heart}
              iconClassName="bg-rose-500/10 text-rose-700"
              title={t("headingGunMilan")}
              count={matchmakingReports.length}
            >
              {matchmakingReports.length === 0 ? (
                <SectionEmpty
                  message={t("gunMilanSectionEmpty")}
                  linkHref="/services/matchmaking"
                  linkLabel={t("gunMilanSectionLink")}
                />
              ) : (
                matchmakingReports.map((report) => (
                  <ReportCard
                    key={report.uuid}
                    href={`/services/matchmaking/result/${report.uuid}`}
                    title={
                      report.partner1Name && report.partner2Name
                        ? `${report.partner1Name} & ${report.partner2Name}`
                        : t("fallbackGunMilanTitle")
                    }
                  >
                    {report.result != null ? (
                      <p>
                        {t("scoreLine", {
                          score: report.result.totalPoints,
                          max: report.result.maxPoints,
                          pct: report.result.percentage,
                        })}
                      </p>
                    ) : null}
                  </ReportCard>
                ))
              )}
            </ReportsSectionCard>
          </div>
        )}
      </Container>
    </section>
  )
}
