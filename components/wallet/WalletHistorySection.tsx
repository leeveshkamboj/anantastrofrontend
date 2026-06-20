"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  History,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion/FadeIn"
import { ServiceSectionHeader } from "@/components/services/ServiceSectionHeader"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatInr, paymentStatusBadgeClass } from "@/components/wallet/wallet-utils"

type CoinTransaction = {
  id: number
  delta: number
  balanceAfter: number
  type: string
  referenceType: string | null
  createdAt: string
}

type PaymentRecord = {
  id: number
  amountPaise: number
  coinsCredited: number
  coinsToCredit: number
  status: string
  createdAt: string
}

type WalletHistorySectionProps = {
  payments: PaymentRecord[]
  transactions: CoinTransaction[]
  paymentsLoading: boolean
  transactionsLoading: boolean
  humanizeReference: (ref: string | null | undefined) => string
  humanizeCoinType: (type: string | null | undefined) => string
  paymentStatusLabel: (status: string | null | undefined) => string
}

type HistoryTab = "payments" | "activity"

function SectionCard({
  icon: Icon,
  iconClassName,
  title,
  description,
  count,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconClassName: string
  title: string
  description: string
  count?: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md",
        className,
      )}
    >
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
              {count != null ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold tabular-nums text-gray-600">
                  {count}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4 sm:max-h-[32rem] sm:px-5">
        {children}
      </div>
    </div>
  )
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  )
}

function PaymentsList({
  payments,
  loading,
  paymentStatusLabel,
}: {
  payments: PaymentRecord[]
  loading: boolean
  paymentStatusLabel: (status: string | null | undefined) => string
}) {
  const t = useTranslations("wallet")

  if (loading) return <LoadingRows count={3} />

  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-astro-purple/20 bg-astro-purple/5 px-4 py-10 text-center">
        <CreditCard className="mx-auto h-10 w-10 text-astro-purple/30" />
        <p className="mt-3 text-sm font-semibold text-gray-800">{t("payEmpty")}</p>
        <p className="mt-1 text-xs text-gray-500">{t("payEmptyHint")}</p>
        <CosmicButton asChild variant="outline" size="sm" className="mt-4">
          <Link href="/pricing">{t("browsePacks")}</Link>
        </CosmicButton>
      </div>
    )
  }

  return (
    <>
      {payments.map((p) => (
        <div
          key={p.id}
          className="group flex flex-col gap-3 rounded-2xl border border-transparent bg-gray-50 px-4 py-3.5 transition-colors hover:border-astro-purple/10 hover:bg-white md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="text-lg font-extrabold tabular-nums text-gray-900">
              {formatInr(p.amountPaise)}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-astro-purple">
                {t("coinsAdded", {
                  n: Number(p.coinsCredited || p.coinsToCredit) || 0,
                })}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
            <Badge
              variant="outline"
              className={cn("capitalize font-semibold", paymentStatusBadgeClass(p.status))}
            >
              {paymentStatusLabel(p.status)}
            </Badge>
            <time
              className="text-xs tabular-nums text-gray-500"
              dateTime={typeof p.createdAt === "string" ? p.createdAt : undefined}
            >
              {format(new Date(p.createdAt), "d MMM yyyy, HH:mm")}
              <span className="hidden sm:inline">
                {" · "}
                {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
              </span>
            </time>
          </div>
        </div>
      ))}
    </>
  )
}

function ActivityList({
  transactions,
  loading,
  humanizeReference,
  humanizeCoinType,
}: {
  transactions: CoinTransaction[]
  loading: boolean
  humanizeReference: (ref: string | null | undefined) => string
  humanizeCoinType: (type: string | null | undefined) => string
}) {
  const t = useTranslations("wallet")

  if (loading) return <LoadingRows count={4} />

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-astro-orange/20 bg-astro-orange/5 px-4 py-10 text-center">
        <History className="mx-auto h-10 w-10 text-astro-orange/30" />
        <p className="mt-3 text-sm font-semibold text-gray-800">{t("activityEmptyTitle")}</p>
        <p className="mt-1 text-xs text-gray-500">{t("activityEmptyHint")}</p>
      </div>
    )
  }

  return (
    <>
      {transactions.map((r) => (
        <div
          key={r.id}
          className="group flex gap-3 rounded-2xl border border-transparent px-3 py-3 transition-colors hover:border-astro-orange/10 hover:bg-white"
        >
          <div
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              r.delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
            )}
          >
            {r.delta >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p
                className={cn(
                  "font-extrabold tabular-nums",
                  r.delta >= 0 ? "text-emerald-800" : "text-rose-800",
                )}
              >
                {r.delta >= 0 ? "+" : ""}
                {r.delta} {t("coinsLabel")}
              </p>
              <span className="text-xs tabular-nums text-gray-500">
                {t("balanceAfter", { n: r.balanceAfter })}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {humanizeCoinType(r.type)}
              {r.referenceType ? (
                <>
                  {" · "}
                  <span className="text-gray-700">{humanizeReference(r.referenceType)}</span>
                </>
              ) : null}
            </p>
            <time
              className="mt-1 block text-xs text-gray-500"
              dateTime={typeof r.createdAt === "string" ? r.createdAt : undefined}
            >
              {format(new Date(r.createdAt), "d MMM yyyy, HH:mm")} ·{" "}
              {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
            </time>
          </div>
        </div>
      ))}
    </>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition",
        active
          ? "bg-astro-purple text-white shadow-sm"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50",
      )}
    >
      {children}
    </button>
  )
}

export function WalletHistorySection({
  payments,
  transactions,
  paymentsLoading,
  transactionsLoading,
  humanizeReference,
  humanizeCoinType,
  paymentStatusLabel,
}: WalletHistorySectionProps) {
  const t = useTranslations("wallet")
  const [activeTab, setActiveTab] = useState<HistoryTab>("payments")

  const listProps = {
    paymentStatusLabel,
  }

  return (
    <section className="bg-gray-50/80 px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
      <Container>
        <ServiceSectionHeader
          eyebrow={t("historyEyebrow")}
          title={t("historyTitle")}
          subtitle={t("historySubtitle")}
        />

        <div className="mb-5 flex gap-2 lg:hidden">
          <TabButton
            active={activeTab === "payments"}
            onClick={() => setActiveTab("payments")}
          >
            {t("tabPayments")} ({payments.length})
          </TabButton>
          <TabButton
            active={activeTab === "activity"}
            onClick={() => setActiveTab("activity")}
          >
            {t("tabCoins")} ({transactions.length})
          </TabButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <FadeIn preset="fadeIn" inView={false}>
          <SectionCard
            icon={CreditCard}
            iconClassName="bg-astro-purple/10 text-astro-purple"
            title={t("tabPayments")}
            description={t("paymentsDesc")}
            count={payments.length}
            className={cn(activeTab !== "payments" && "hidden lg:flex")}
          >
            <PaymentsList
              payments={payments}
              loading={paymentsLoading}
              {...listProps}
            />
          </SectionCard>
          </FadeIn>

          <FadeIn preset="fadeIn" inView={false}>
          <SectionCard
            icon={History}
            iconClassName="bg-astro-orange/10 text-astro-orange"
            title={t("tabCoins")}
            description={t("activityDesc")}
            count={transactions.length}
            className={cn(activeTab !== "activity" && "hidden lg:flex")}
          >
            <ActivityList
              transactions={transactions}
              loading={transactionsLoading}
              humanizeReference={humanizeReference}
              humanizeCoinType={humanizeCoinType}
            />
          </SectionCard>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
