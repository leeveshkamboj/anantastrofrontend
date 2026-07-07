"use client"

import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion"

type LegalPageLayoutProps = {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const t = useTranslations("legal")

  return (
    <div className="overflow-x-hidden bg-white text-gray-900">
      <CelestialBackground className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-24 lg:pb-16 lg:pt-12">
        <FadeIn preset="fadeUp">
          <Container className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-black sm:mb-4 sm:px-4 sm:py-1.5">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {t("badge")}
            </div>
            <h1 className="mb-3 text-2xl font-extrabold text-black sm:mb-4 sm:text-4xl">{title}</h1>
            <p className="mx-auto max-w-xl text-sm text-gray-700">{t("lastUpdated", { date: lastUpdated })}</p>
          </Container>
        </FadeIn>
      </CelestialBackground>

      <Container className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <article className="prose prose-gray max-w-3xl prose-headings:font-bold prose-h2:text-xl prose-p:text-gray-700">
          {children}
        </article>
      </Container>
    </div>
  )
}
