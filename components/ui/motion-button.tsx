"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { motion, type HTMLMotionProps } from "framer-motion"
import { type VariantProps } from "class-variance-authority"
import { useMotion } from "@/components/motion/MotionProvider"
import { getTapProps } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "ref"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  function MotionButton(
    { className, variant = "default", size = "default", asChild = false, ...props },
    ref
  ) {
    const { reduced } = useMotion()
    const tapProps = getTapProps(reduced)
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={classes}
          {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
        />
      )
    }

    return (
      <motion.button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={classes}
        {...tapProps}
        {...props}
      />
    )
  }
)

export { MotionButton }
