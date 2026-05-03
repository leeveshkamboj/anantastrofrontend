"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function CTASection() {
  const t = useTranslations("home.cta")

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("title")}</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">{t("subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 px-8 rounded-lg hover:shadow-lg transition-all"
            size="lg"
          >
            <Link href="/auth/register">{t("getStarted")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-lg py-6 px-8"
            size="lg"
          >
            <Link href="/pricing">{t("viewPricing")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
