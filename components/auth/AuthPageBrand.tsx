"use client"

import { useTranslations } from "next-intl"
import { BrandLogo } from "@/components/brand/BrandLogo"

export function AuthPageBrand() {
  const t = useTranslations("nav")

  return (
    <div className="mb-6 flex justify-center">
      <BrandLogo href="/" size="lg" text={t("brand")} priority />
    </div>
  )
}
