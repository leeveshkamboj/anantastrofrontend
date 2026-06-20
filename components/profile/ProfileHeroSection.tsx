"use client"

import Image from "next/image"
import { Sparkles, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { CelestialBackground } from "@/components/CelestialBackground"
import { Container } from "@/components/layout/Container"

type ProfileHeroSectionProps = {
  name?: string | null
  email?: string | null
  profileImage?: string | null
}

export function ProfileHeroSection({ name, email, profileImage }: ProfileHeroSectionProps) {
  const t = useTranslations("profile")
  const displayName = name?.trim() || t("guestName")

  return (
    <CelestialBackground className="px-4 pb-9 pt-8 sm:px-6 lg:px-16 lg:pb-16 lg:pt-10">
      <Container>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_64px_-16px_rgba(46,10,94,0.28)] backdrop-blur-md sm:rounded-[2rem]">
          <div
            className="h-1.5 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
            aria-hidden="true"
          />

          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:p-8 lg:p-10">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-[3px] border-astro-purple/20 bg-astro-yellow/20 shadow-sm">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <User className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="mb-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-astro-purple/10 px-4 py-1.5 text-xs font-semibold text-astro-purple">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("badge")}
                </span>
              </div>

              <h1 className="mb-1 font-serif text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
                {displayName}
              </h1>
              {email ? <p className="truncate text-sm font-medium text-gray-500">{email}</p> : null}
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:mx-0 md:text-base">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </CelestialBackground>
  )
}
