"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { getPresetForTier, getReducedPreset, getViewportOptions, type PresetKey } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type AnimatedSectionProps = HTMLMotionProps<"section"> & {
  preset?: PresetKey
}

export function AnimatedSection({
  children,
  className,
  preset = "fadeUp",
  ...props
}: AnimatedSectionProps) {
  const { reduced, tier } = useMotion()
  const variants = reduced ? getReducedPreset(preset) : getPresetForTier(preset, tier)
  const viewport = getViewportOptions()

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      {...props}
    >
      {children}
    </motion.section>
  )
}
