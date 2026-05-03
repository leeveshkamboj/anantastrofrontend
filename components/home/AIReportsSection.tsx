"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, Heart, User, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

const reportKeys = ["career", "love", "personality", "daily"] as const

const icons = [Briefcase, Heart, User, Calendar]

export function AIReportsSection() {
  const t = useTranslations("home.aiReports")

  return (
    <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t("title")}</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{t("subtitle")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportKeys.map((key, index) => {
                const Icon = icons[index]
                return (
                  <div key={key} className="flex items-start gap-3 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-primary-dark/20">
                    <div className="w-10 h-10 rounded-lg bg-primary-dark flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t(`${key}Title`)}</h3>
                      <p className="text-sm text-gray-600">{t(`${key}Desc`)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button asChild className="mt-8 bg-primary hover:bg-[#d6682a] text-white" size="lg">
              <Link href="/services/ai-reports">
                {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4 text-primary-dark" />
              </Link>
            </Button>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/homepage_woman.png"
              alt={t("imageAlt")}
              fill
              className="object-contain object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
