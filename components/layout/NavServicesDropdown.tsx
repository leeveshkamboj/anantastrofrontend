"use client"

import { ChevronDown } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const SERVICE_ITEMS = [
  {
    href: "/services/kundli/generate",
    titleKey: "menuKundliTitle",
    descKey: "menuKundliDesc",
  },
  {
    href: "/services/horoscope",
    titleKey: "menuHoroscopeTitle",
    descKey: "menuHoroscopeDesc",
  },
  {
    href: "/services/matchmaking",
    titleKey: "menuMatchmakingTitle",
    descKey: "menuMatchmakingDesc",
  },
] as const

export function isServicesNavActive(pathname: string) {
  return pathname.startsWith("/services")
}

export function NavServicesDropdown() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const active = isServicesNavActive(pathname)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex h-10 cursor-pointer items-center gap-1 px-0.5 text-sm font-medium text-black",
            "hover:opacity-80 focus:outline-none",
            active && "font-semibold"
          )}
          aria-haspopup="menu"
        >
          {t("services")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
          {active ? (
            <span
              className="absolute bottom-1 left-0 right-0 h-0.5 rounded-full bg-black"
              aria-hidden="true"
            />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(100vw-2rem,32rem)] p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {SERVICE_ITEMS.map(({ href, titleKey, descKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "cursor-pointer rounded-2xl p-3 text-left transition-colors hover:bg-astro-orange/10",
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "bg-astro-orange/10 ring-1 ring-astro-orange/30"
                  : "bg-transparent"
              )}
            >
              <p className="text-sm font-semibold text-gray-900">{t(titleKey)}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{t(descKey)}</p>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
