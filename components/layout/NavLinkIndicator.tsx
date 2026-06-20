"use client"

import { motion } from "framer-motion"
import { useMotion } from "@/components/motion"
import { getTransition } from "@/lib/motion"

export function NavLinkIndicator() {
  const { reduced } = useMotion()
  const transition = reduced ? { duration: 0 } : getTransition("instrument")

  return (
    <motion.span
      layoutId="nav-active-indicator"
      className="absolute bottom-1 left-0 right-0 h-0.5 rounded-full bg-black"
      aria-hidden="true"
      transition={transition}
    />
  )
}
