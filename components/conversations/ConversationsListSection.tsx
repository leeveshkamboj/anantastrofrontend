"use client"

import { useEffect, useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowRight, Coins, Loader2, MessageCircleMore, User } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { AstrologerAvatar } from "@/components/astrologers/AstrologerAvatar"
import { Container } from "@/components/layout/Container"
import { Stagger, StaggerItem } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ChatSession } from "@/store/api/chatApi"

type ConversationsListSectionProps = {
  sessions: ChatSession[]
  isLoading: boolean
}

function sessionStatusLabel(
  status: ChatSession["status"],
  t: ReturnType<typeof useTranslations<"conversations">>,
) {
  if (status === "active") return t("statusActive")
  if (status === "paused") return t("statusPaused")
  if (status === "ended") return t("statusEnded")
  return status
}

function statusBadgeClass(status: ChatSession["status"]) {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800"
  }
  if (status === "paused") {
    return "border-amber-200 bg-amber-50 text-amber-900"
  }
  return "border-gray-200 bg-gray-100 text-gray-700"
}

function sortSessions(sessions: ChatSession[]) {
  return [...sessions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )
}

function SessionRow({
  session,
  t,
}: {
  session: ChatSession
  t: ReturnType<typeof useTranslations<"conversations">>
}) {
  const isActive = session.status === "active"
  const specialty = session.aiAstrologer?.specialties?.[0]

  return (
    <Link
      href={`/chat/${session.uuid}`}
      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-gray-50 px-3 py-3 transition-colors hover:border-astro-purple/10 hover:bg-white sm:gap-4 sm:px-4 sm:py-3.5"
    >
      <div className="relative shrink-0">
        {session.aiAstrologer ? (
          <AstrologerAvatar
            astrologer={session.aiAstrologer}
            variant="directory"
            size={48}
            className="border border-gray-200"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        {isActive ? (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-extrabold text-gray-900">
            {session.aiAstrologer?.displayName || t("sessionNumber", { id: session.id })}
          </p>
          <Badge
            variant="outline"
            className={cn("shrink-0 font-semibold capitalize", statusBadgeClass(session.status))}
          >
            {sessionStatusLabel(session.status, t)}
          </Badge>
        </div>

        {specialty ? (
          <p className="mt-0.5 truncate text-xs font-medium text-astro-purple/80">
            {specialty}
          </p>
        ) : null}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <time dateTime={session.startedAt}>
            {format(new Date(session.startedAt), "d MMM yyyy, HH:mm")} ·{" "}
            {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
          </time>
          <span className="inline-flex items-center gap-1 font-medium text-gray-600">
            <Coins className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            {t("coinsDebitedLine", { n: session.totalCoinsDebited ?? 0 })}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="hidden text-xs font-semibold text-astro-purple sm:block">
          {isActive ? t("continueChat") : t("open")}
        </span>
        <ArrowRight
          className="h-5 w-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-astro-orange"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

export function ConversationsListSection({ sessions, isLoading }: ConversationsListSectionProps) {
  const t = useTranslations("conversations")
  const tNav = useTranslations("nav")
  const sortedSessions = sortSessions(sessions)
  const [hasStaggered, setHasStaggered] = useState(false)
  const shouldStagger = !isLoading && sortedSessions.length > 0 && !hasStaggered

  useEffect(() => {
    if (!shouldStagger) return
    const timer = window.setTimeout(() => setHasStaggered(true), 900)
    return () => window.clearTimeout(timer)
  }, [shouldStagger])

  return (
    <section className="bg-gray-50/80 px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
      <Container>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md">
          <div
            className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
            aria-hidden="true"
          />

          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-astro-purple/10 text-astro-purple">
                  <MessageCircleMore className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-gray-900">{t("listTitle")}</h2>
                    {!isLoading ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold tabular-nums text-gray-600">
                        {sortedSessions.length}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500">{t("listDescription")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 px-4 py-4 sm:px-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-astro-purple" />
              </div>
            ) : sortedSessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 px-4 py-10 text-center">
                <MessageCircleMore className="mx-auto h-10 w-10 text-astro-purple/30" />
                <p className="mt-3 text-sm font-semibold text-gray-800">{t("empty")}</p>
                <p className="mt-1 text-xs text-gray-500">{t("emptyHint")}</p>
                <CosmicButton asChild size="sm" className="mt-4 normal-case tracking-normal">
                  <Link href="/astrologers">{tNav("astrologers")}</Link>
                </CosmicButton>
              </div>
            ) : shouldStagger ? (
              <Stagger inView={false} className="space-y-2">
                {sortedSessions.map((session) => (
                  <StaggerItem key={session.id}>
                    <SessionRow session={session} t={t} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <div className="space-y-2">
                {sortedSessions.map((session) => (
                  <SessionRow key={session.id} session={session} t={t} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
