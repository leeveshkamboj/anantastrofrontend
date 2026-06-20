"use client"

import { AnimatePresence, motion } from "framer-motion"
import { getPresetForTier, getReducedPreset } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type AnimatePresenceTabsProps = {
  activeKey: string
  children: React.ReactNode
  className?: string
}

export function AnimatePresenceTabs({ activeKey, children, className }: AnimatePresenceTabsProps) {
  const { reduced, tier } = useMotion()
  const variants = reduced ? getReducedPreset("tabCrossfade") : getPresetForTier("tabCrossfade", tier)

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
