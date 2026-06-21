"use client"

import { LayoutGroup } from "framer-motion"
import { usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useSelector } from "react-redux"
import { CoinNavPill } from "@/components/coins/CoinNavPill"
import { NavDesktopLink } from "@/components/layout/NavDesktopLink"
import { NavLanguageSwitcher } from "@/components/layout/NavLanguageSwitcher"
import { NavMobileMenu } from "@/components/layout/NavMobileMenu"
import { NavServicesDropdown } from "@/components/layout/NavServicesDropdown"
import { NavUserMenu } from "@/components/layout/NavUserMenu"
import { isNavActive } from "@/components/layout/nav-utils"
import { BrandLogo } from "@/components/brand/BrandLogo"
import { useAuth } from "@/store/hooks/useAuth"
import { selectIsAstrologer } from "@/store/slices/authSlice"

export function Navbar() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const isAstrologer = useSelector(selectIsAstrologer)

  const navLinks = [
    { href: "/astrologers", label: t("astrologers") },
    ...(!isAstrologer
      ? [{ href: "/astrologer/register", label: t("becomeAstrologer") }]
      : []),
    { href: "/pricing", label: t("pricing") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-hero-gradient px-6 lg:px-24">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <NavMobileMenu navLinks={navLinks} isAuthenticated={isAuthenticated} />
          <BrandLogo href="/" size="md" text={t("brand")} className="text-black" priority />
        </div>

        <LayoutGroup>
          <nav
            className="hidden h-10 items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <NavServicesDropdown />
            {navLinks.map(({ href, label }) => (
              <NavDesktopLink
                key={href}
                href={href}
                label={label}
                active={isNavActive(href, pathname)}
              />
            ))}
            <NavLanguageSwitcher />
            {isAuthenticated && <CoinNavPill />}
          </nav>
        </LayoutGroup>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated && <CoinNavPill className="lg:hidden" />}
          <NavUserMenu />
        </div>
      </div>
    </header>
  )
}
