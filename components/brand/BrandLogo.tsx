"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

/** Full-resolution brand mark (public/logo.png). */
export const BRAND_LOGO_SRC = "/logo.png"

/** UI-sized mark derived from logo.png for nav, footer, and sidebars. */
export const BRAND_LOGO_MARK_SRC = "/logo-mark.png"

const SIZE_CONFIG = {
  xs: { dimension: 24, text: "text-sm" },
  sm: { dimension: 32, text: "text-base" },
  md: { dimension: 40, text: "text-xl sm:text-2xl" },
  lg: { dimension: 48, text: "text-2xl" },
  xl: { dimension: 64, text: "text-3xl" },
} as const

export type BrandLogoSize = keyof typeof SIZE_CONFIG

export interface BrandLogoProps {
  text?: string
  showText?: boolean
  size?: BrandLogoSize
  href?: string | null
  className?: string
  imageClassName?: string
  onClick?: () => void
  priority?: boolean
}

export function BrandLogo({
  text = "AnantAstro",
  showText = true,
  size = "md",
  href = "/",
  className,
  imageClassName,
  onClick,
  priority,
}: BrandLogoProps) {
  const { dimension, text: textClass } = SIZE_CONFIG[size]

  const mark = (
    <Image
      src={BRAND_LOGO_MARK_SRC}
      alt={text}
      width={dimension}
      height={dimension}
      className={cn("shrink-0 rounded-full object-cover", imageClassName)}
      priority={priority ?? size === "md"}
    />
  )

  const label = showText ? (
    <span className={cn("truncate font-bold tracking-tight", textClass)}>{text}</span>
  ) : null

  const content = (
    <>
      {mark}
      {label}
    </>
  )

  const wrapperClass = cn("flex min-w-0 items-center gap-2", className)

  if (href) {
    return (
      <Link href={href} className={cn("link-reset", wrapperClass)} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <div className={wrapperClass} onClick={onClick}>
      {content}
    </div>
  )
}
