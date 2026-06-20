"use client"

import { forwardRef } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { getPresetForTier, getReducedPreset, getViewportOptions, type PresetKey } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type StaggerProps = HTMLMotionProps<"div"> & {
  inView?: boolean
}

export function Stagger({ inView = true, children, ...props }: StaggerProps) {
  const { reduced, tier } = useMotion()
  const containerVariants = reduced
    ? getReducedPreset("staggerContainer")
    : getPresetForTier("staggerContainer", tier)
  const viewport = getViewportOptions()

  return (
    <motion.div
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? viewport : undefined}
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  preset?: PresetKey
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(function StaggerItem(
  { children, preset = "staggerItem", ...props },
  ref
) {
  const { reduced, tier } = useMotion()
  const itemVariants = reduced
    ? getReducedPreset(preset)
    : getPresetForTier(preset, tier)

  return (
    <motion.div ref={ref} variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
})
