"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useMotion } from "@/components/motion"
import { getPresetForTier, getReducedPreset, getTransition } from "@/lib/motion"
import { selectorLocales } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/brand/BrandLogo"

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
  const [open, setOpen] = useState(false)
  const { reduced } = useMotion()
  const backdropVariants = reduced
    ? getReducedPreset("backdropFade")
    : getPresetForTier("backdropFade", "instrument")
  const drawerTransition = getTransition("instrument")
  const drawerVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: drawerTransition },
    exit: {
      x: "-100%",
      transition: { ...drawerTransition, duration: drawerTransition.duration * 0.8 },
    },
  }

  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-black lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key="nav-mobile-backdrop"
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={close}
              aria-hidden="true"
            />
            <motion.nav
              key="nav-mobile-drawer"
              className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,20rem)] flex-col gap-1 overflow-y-auto bg-white p-4 shadow-xl lg:hidden"
              aria-label="Mobile navigation"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mb-4 flex items-center justify-between">
                <BrandLogo href="/" size="sm" text={t("brand")} className="text-gray-900" onClick={close} />
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-black"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-astro-orange/10"
                  onClick={close}
                >
                  {label}
                </Link>
              ))}

              <div className="my-2 h-px bg-gray-200" />

              <Link
                href="/services/kundli/generate"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-astro-orange/10"
                onClick={close}
              >
                {t("mobileKundli")}
              </Link>
              <Link
                href="/services/horoscope"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-astro-orange/10"
                onClick={close}
              >
                {t("mobileHoroscope")}
              </Link>
              <Link
                href="/services/matchmaking"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-astro-orange/10"
                onClick={close}
              >
                {t("mobileMatchmaking")}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="my-2 h-px bg-gray-200" />
                  <Link
                    href="/wallet"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-astro-orange/10"
                    onClick={close}
                  >
                    {t("wallet")}
                  </Link>
                </>
              ) : null}

              <div className="my-2 h-px bg-gray-200" />

              {selectorLocales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-astro-orange/10",
                    locale === loc && "bg-astro-orange/10"
                  )}
                  onClick={() => {
                    router.replace(pathname, { locale: loc })
                    close()
                  }}
                >
                  {t(`lang_${loc}` as NavLangKey)}
                </button>
              ))}
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
