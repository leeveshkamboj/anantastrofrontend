"use client"

import { Facebook, Globe, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://youtube.com", label: "YouTube", Icon: Youtube },
] as const

export function Footer() {
  const t = useTranslations("footer")
  const tNav = useTranslations("nav")
  const year = new Date().getFullYear()

  const serviceLinks = [
    { href: "/services/kundli/generate", label: t("kundliGeneration") },
    { href: "/services/horoscope", label: t("horoscope") },
    { href: "/services/matchmaking", label: t("matchmaking") },
    { href: "/pricing", label: t("reports") },
    { href: "/contact", label: t("liveConsultation") },
  ]

  const quickLinks = [
    { href: "/", label: tNav("brand") },
    { href: "/astrologers", label: t("ourAstrologers") },
    { href: "/pricing", label: t("pricingPlans") },
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contactUs") },
  ]

  const policyLinks = [
    { href: "/privacy", label: t("privacyPolicy") },
    { href: "/terms", label: t("termsOfService") },
    { href: "/refund", label: t("refundPolicy") },
  ]

  return (
    <footer className="bg-footer-gradient px-6 py-16 text-black lg:px-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-2 text-3xl font-bold">{tNav("brand")}</div>
          <p className="mb-6 text-sm text-gray-800">{t("tagline")}</p>
          <div className="flex space-x-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black p-2 text-white transition-opacity hover:opacity-80"
                aria-label={label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold">{t("servicesHeading")}</h4>
          <ul className="space-y-2 text-sm">
            {serviceLinks.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">{t("quickLinksHeading")}</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">{t("contactHeading")}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <Phone className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center">
              <Mail className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
              support@anantastro.com
            </li>
            <li className="flex items-start">
              <MapPin className="mr-2 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                123 Astrology Street
                <br />
                Mystic City, MC 12345
              </span>
            </li>
            <li className="flex items-center">
              <Globe className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
              www.anantastro.com
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-black/20 pt-6 text-xs font-medium md:flex-row md:items-center">
        <div>{t("copyright", { year })}</div>
        <div className="flex flex-wrap gap-4 md:gap-6">
          {policyLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="hover:underline">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
