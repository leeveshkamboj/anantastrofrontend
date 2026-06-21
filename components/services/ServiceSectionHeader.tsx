"use client"

import { FadeIn } from "@/components/motion/FadeIn"
import { cn } from "@/lib/utils"

type ServiceSectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
  className?: string
}

export function ServiceSectionHeader({
  eyebrow,
  title,
  subtitle,
  light = false,
  className,
}: ServiceSectionHeaderProps) {
  return (
    <FadeIn preset="fadeUp" className={cn("mb-8 text-center sm:mb-10 md:mb-12", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider sm:mb-3 sm:px-4 sm:py-1.5",
            light
              ? "bg-white/10 text-astro-yellow ring-1 ring-white/20"
              : "bg-astro-purple/10 text-astro-purple ring-1 ring-astro-purple/15",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mb-2 text-2xl font-extrabold tracking-tight sm:mb-3 sm:text-3xl md:text-4xl",
          light ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mx-auto max-w-2xl px-2 text-sm sm:px-0 sm:text-base", light ? "text-purple-100/80" : "text-gray-600")}>
          {subtitle}
        </p>
      ) : null}
    </FadeIn>
  )
}
