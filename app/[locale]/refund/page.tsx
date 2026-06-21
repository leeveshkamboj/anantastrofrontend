"use client"

import { LegalPageLayout } from "@/components/legal/LegalPageLayout"
import { useTranslations } from "next-intl"

const LAST_UPDATED = "21 June 2026"

export default function RefundPage() {
  const t = useTranslations("legal.refund")

  const sections = ["intro", "coinPurchases", "failedServices", "chatBilling", "process", "contact"] as const

  return (
    <LegalPageLayout title={t("title")} lastUpdated={LAST_UPDATED}>
      {sections.map((key) => (
        <section key={key} className="mb-8">
          <h2>{t(`${key}.title`)}</h2>
          <p>{t(`${key}.body`)}</p>
        </section>
      ))}
    </LegalPageLayout>
  )
}
