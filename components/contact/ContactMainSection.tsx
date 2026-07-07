"use client"

import { useState } from "react"
import { Clock, Mail, Phone, Send, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Container } from "@/components/layout/Container"
import { DecorativePlanets } from "@/components/layout/DecorativePlanets"
import { AnimatedSection, FadeIn, HoverLift, Stagger, StaggerItem } from "@/components/motion"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { CosmicCard } from "@/components/ui/CosmicCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { config } from "@/lib/config"
import { parseFetchBaseError } from "@/lib/api-errors"

type ContactInfoItem =
  | {
      icon: LucideIcon
      titleKey: "emailTitle" | "phoneTitle" | "hoursTitle"
      descKey: "emailDesc" | "phoneDesc" | "hoursDesc"
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
    value: "+91 9811927240",
    link: "tel:+919811927240",
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
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const payload = {
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || undefined,
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    }

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.subject || !payload.message) {
      toast.error(t("submitError"))
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${config.apiBaseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw parseFetchBaseError({ status: response.status, data: body })
      }

      toast.success(t("submitSuccess"))
      form.reset()
    } catch {
      toast.error(t("submitError"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatedSection className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <DecorativePlanets variant="contact" />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <FadeIn preset="scaleIn" inView>
            <CosmicCard variant="glass" padding="md" className="items-stretch p-5 text-left sm:p-8">
              <h2 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">{t("formTitle")}</h2>
              <p className="mb-5 text-sm text-gray-600 sm:mb-6">{t("formSubtitle")}</p>

              <form className="space-y-5" aria-label={t("formTitle")} onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-first-name" className="text-sm font-medium text-gray-700">
                      {t("firstName")}
                    </Label>
                    <Input
                      id="contact-first-name"
                      name="firstName"
                      type="text"
                      required
                      placeholder={t("placeholderFirst")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-last-name" className="text-sm font-medium text-gray-700">
                      {t("lastName")}
                    </Label>
                    <Input
                      id="contact-last-name"
                      name="lastName"
                      type="text"
                      required
                      placeholder={t("placeholderLast")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                    {t("email")}
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("placeholderEmail")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                    {t("phoneOptional")}
                  </Label>
                  <Input id="contact-phone" name="phone" type="tel" placeholder={t("placeholderPhone")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-sm font-medium text-gray-700">
                    {t("subject")}
                  </Label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder={t("placeholderSubject")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-sm font-medium text-gray-700">
                    {t("message")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    placeholder={t("placeholderMessage")}
                    className="min-h-32 rounded-3xl border-gray-300 px-4 py-3 focus-visible:border-astro-orange focus-visible:ring-astro-orange/50"
                  />
                </div>

                <CosmicButton type="submit" variant="primary" className="w-full" disabled={submitting}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitting ? t("submitting") : t("submit")}
                </CosmicButton>
              </form>
            </CosmicCard>
          </FadeIn>

          <div className="space-y-5 sm:space-y-6">
            <FadeIn preset="fadeUp" inView>
              <div>
                <h2 className="mb-3 text-xl font-bold text-astro-purple sm:mb-4 sm:text-2xl">{t("getInTouchTitle")}</h2>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{t("getInTouchBody")}</p>
              </div>
            </FadeIn>

            <Stagger className="grid grid-cols-1 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const displayValue = "valueKey" in info ? t(info.valueKey) : info.value

                return (
                  <StaggerItem key={index}>
                    <HoverLift>
                      <CosmicCard className="items-start text-left">
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
                    </HoverLift>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  )
}
