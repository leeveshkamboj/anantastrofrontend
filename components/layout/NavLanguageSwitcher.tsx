"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { selectorLocales } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type NavLangKey = `lang_${(typeof selectorLocales)[number]}`

interface NavLanguageSwitcherProps {
  className?: string
}

export function NavLanguageSwitcher({ className }: NavLanguageSwitcherProps) {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-1 px-0.5 text-sm font-medium text-black",
            className
          )}
          aria-label={t("language")}
        >
          <span>{t("language")}</span>
          <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {selectorLocales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            className={locale === loc ? "bg-astro-orange/10" : ""}
            onClick={() => router.replace(pathname, { locale: loc })}
          >
            {t(`lang_${loc}` as NavLangKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
