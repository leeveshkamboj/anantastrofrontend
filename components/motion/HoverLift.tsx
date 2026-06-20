"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { getHoverProps } from "@/lib/motion"
import { useMotion } from "./MotionProvider"

type HoverLiftProps = HTMLMotionProps<"div">

export function HoverLift({ children, className, ...props }: HoverLiftProps) {
  const { reduced } = useMotion()
  const hoverProps = getHoverProps(reduced)

  return (
    <motion.div className={className} {...hoverProps} {...props}>
      {children}
    </motion.div>
  )
}
