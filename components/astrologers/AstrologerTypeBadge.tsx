"use client"

import { useTranslations } from "next-intl"
import { normalizeAiAstrologerType } from "@/lib/astrologer-types"
import { cn } from "@/lib/utils"

type AstrologerTypeBadgeProps = {
  astrologerType?: string | null
  className?: string
}

export function AstrologerTypeBadge({ astrologerType, className }: AstrologerTypeBadgeProps) {
  const t = useTranslations("astrologersPage")
  const type = normalizeAiAstrologerType(astrologerType)

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full bg-astro-purple/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-astro-purple",
        className,
      )}
    >
      {t(`type.${type}`)}
    </span>
  )
}
