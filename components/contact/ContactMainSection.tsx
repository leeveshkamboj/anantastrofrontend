"use client"

import { Clock, Mail, MapPin, Phone, Send, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ContactInfoItem =
  | {
      icon: LucideIcon
      titleKey: "emailTitle" | "phoneTitle" | "addressTitle" | "hoursTitle"
      descKey: "emailDesc" | "phoneDesc" | "addressDesc" | "hoursDesc"
      value: string
      link: string
    }
  | {
      icon: LucideIcon
      titleKey: "hoursTitle"
      descKey: "hoursDesc"
      valueKey: "hoursValue"
      link: "#"
    }

const contactInfo: ContactInfoItem[] = [
  {
    icon: Mail,
    titleKey: "emailTitle",
    descKey: "emailDesc",
    value: "support@anantastro.com",
    link: "mailto:support@anantastro.com",
  },
  {
    icon: Phone,
    titleKey: "phoneTitle",
    descKey: "phoneDesc",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: MapPin,
    titleKey: "addressTitle",
    descKey: "addressDesc",
    value: "123 Astrology Street, Cosmic City, CC 12345",
    link: "#",
  },
  {
    icon: Clock,
    titleKey: "hoursTitle",
    descKey: "hoursDesc",
    valueKey: "hoursValue",
    link: "#",
  },
]

export function ContactMainSection() {
  const t = useTranslations("contact")

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 lg:px-24">
      <DecorativePlanets variant="contact" />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <CosmicCard variant="glass" padding="md" className="items-stretch text-left">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">{t("formTitle")}</h2>
            <p className="mb-6 text-sm text-gray-600">{t("formSubtitle")}</p>

            <form className="space-y-5" aria-label={t("formTitle")} onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-first-name" className="text-sm font-medium text-gray-700">
                    {t("firstName")}
                  </Label>
                  <Input id="contact-first-name" type="text" placeholder={t("placeholderFirst")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-last-name" className="text-sm font-medium text-gray-700">
                    {t("lastName")}
                  </Label>
                  <Input id="contact-last-name" type="text" placeholder={t("placeholderLast")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                  {t("email")}
                </Label>
                <Input id="contact-email" type="email" placeholder={t("placeholderEmail")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                  {t("phoneOptional")}
                </Label>
                <Input id="contact-phone" type="tel" placeholder={t("placeholderPhone")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-sm font-medium text-gray-700">
                  {t("subject")}
                </Label>
                <Input id="contact-subject" type="text" placeholder={t("placeholderSubject")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
                  {t("message")}
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder={t("placeholderMessage")}
                  className="min-h-32 rounded-3xl border-gray-300 px-4 py-3 focus-visible:border-astro-orange focus-visible:ring-astro-orange/50"
                />
              </div>

              <CosmicButton type="submit" variant="primary" className="w-full">
                <Send className="h-4 w-4" aria-hidden="true" />
                {t("submit")}
              </CosmicButton>
            </form>
          </CosmicCard>

          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-astro-purple">{t("getInTouchTitle")}</h2>
              <p className="leading-relaxed text-gray-600">{t("getInTouchBody")}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const displayValue =
                  "valueKey" in info ? t(info.valueKey) : info.value

                return (
                  <CosmicCard key={index} className="items-start text-left">
                    <div className="flex w-full items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-astro-purple text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-semibold text-gray-900">{t(info.titleKey)}</h3>
                        <p className="mb-2 text-sm text-gray-600">{t(info.descKey)}</p>
                        {info.link !== "#" ? (
                          <a href={info.link} className="link-reset font-medium text-astro-purple">
                            {displayValue}
                          </a>
                        ) : (
                          <p className="font-medium text-astro-purple">{displayValue}</p>
                        )}
                      </div>
                    </div>
                  </CosmicCard>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
