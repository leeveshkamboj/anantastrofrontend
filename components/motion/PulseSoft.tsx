"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { presets, visibleState } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type PulseSoftProps = HTMLMotionProps<"div">

export function PulseSoft({ children, ...props }: PulseSoftProps) {
  const { reduced } = useMotion()
  const variants = reduced
    ? { hidden: visibleState, visible: visibleState }
    : presets.pulseSoft

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} {...props}>
      {children}
    </motion.div>
  )
}
