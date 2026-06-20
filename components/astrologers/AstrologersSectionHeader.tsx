"use client"

import { cn } from "@/lib/utils"

type AstrologersSectionHeaderProps = {
  eyebrow: string
  title: string
  subtitle: string
  light?: boolean
  className?: string
}

export function AstrologersSectionHeader({
  eyebrow,
  title,
  subtitle,
  light = false,
  className,
}: AstrologersSectionHeaderProps) {
  return (
    <div className={cn("mb-10 text-center md:mb-12", className)}>
      <p
        className={cn(
          "mb-3 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider",
          light
            ? "bg-white/10 text-astro-yellow ring-1 ring-white/20"
            : "bg-astro-purple/10 text-astro-purple ring-1 ring-astro-purple/15",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mb-3 text-3xl font-extrabold tracking-tight md:text-4xl",
          light ? "text-white" : "text-gray-900",
        )}
      >
        {title}
      </h2>
      <p className={cn("mx-auto max-w-2xl text-base", light ? "text-purple-100/80" : "text-gray-600")}>
        {subtitle}
      </p>
    </div>
  )
}
