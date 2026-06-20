"use client"

import { Menu } from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { selectorLocales } from "@/i18n/routing"

type NavLangKey = `lang_${(typeof selectorLocales)[number]}`

interface NavLink {
  href: string
  label: string
}

interface NavMobileMenuProps {
  navLinks: NavLink[]
  isAuthenticated: boolean
}

export function NavMobileMenu({ navLinks, isAuthenticated }: NavMobileMenuProps) {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-black lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
              {navLinks.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href}>{label}</Link>
                </DropdownMenuItem>
              ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/services/kundli/generate">{t("mobileKundli")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/horoscope">{t("mobileHoroscope")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/services/matchmaking">{t("mobileMatchmaking")}</Link>
        </DropdownMenuItem>
        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/wallet">{t("wallet")}</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
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
