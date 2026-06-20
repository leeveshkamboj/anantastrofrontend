"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { getPresetForTier, getReducedPreset, getViewportOptions, type PresetKey } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type FadeInProps = HTMLMotionProps<"div"> & {
  preset?: PresetKey
  delay?: number
  inView?: boolean
}

export function FadeIn({
  preset = "fadeUp",
  delay = 0,
  inView = false,
  children,
  ...props
}: FadeInProps) {
  const { reduced, tier } = useMotion()
  const variants = reduced ? getReducedPreset(preset) : getPresetForTier(preset, tier)
  const viewport = getViewportOptions()

  return (
    <motion.div
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? viewport : undefined}
      variants={variants}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
