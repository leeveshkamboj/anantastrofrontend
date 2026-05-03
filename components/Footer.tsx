"use client"

import { Link } from "@/i18n/navigation"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")
  const tNav = useTranslations("nav")
  const year = new Date().getFullYear()

  return (
    <footer className="footer-gradient text-[#794235]">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary-light to-cream flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-primary-light flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">A</span>
                </div>
              </div>
              <span className="text-xl font-serif font-bold ">{tNav("brand")}</span>
            </div>
            <p className="text-sm leading-relaxed">{t("tagline")}</p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold ">{t("servicesHeading")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/kundli/generate" className=" hover:text-primary transition-colors">
                  {t("kundliGeneration")}
                </Link>
              </li>
              <li>
                <Link href="/services/horoscope" className=" hover:text-primary transition-colors">
                  {t("horoscope")}
                </Link>
              </li>
              <li>
                <Link href="/services/matchmaking" className=" hover:text-primary transition-colors">
                  {t("matchmaking")}
                </Link>
              </li>
              <li>
                <Link href="/services/ai-reports" className=" hover:text-primary transition-colors">
                  {t("reports")}
                </Link>
              </li>
              <li>
                <Link href="/services/consultation" className=" hover:text-primary transition-colors">
                  {t("liveConsultation")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold ">{t("quickLinksHeading")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/astrologers" className=" hover:text-primary transition-colors">
                  {t("ourAstrologers")}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className=" hover:text-primary transition-colors">
                  {t("pricingPlans")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className=" hover:text-primary transition-colors">
                  {tNav("profile")}
                </Link>
              </li>
              <li>
                <Link href="/about" className=" hover:text-primary transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className=" hover:text-primary transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold ">{t("contactHeading")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5  mt-0.5 shrink-0" />
                <span className="">support@anantastro.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5  mt-0.5 shrink-0" />
                <span className="">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5  mt-0.5 shrink-0" />
                <span className="">
                  123 Astrology Street<br />
                  Mystic City, MC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-black/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm ">
          <p>{t("copyright", { year })}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {t("termsOfService")}
            </Link>
            <Link href="/refund" className="hover:text-primary transition-colors">
              {t("refundPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
