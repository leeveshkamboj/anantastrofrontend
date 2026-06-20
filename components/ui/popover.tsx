"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { motion } from "framer-motion"

import { useMotion } from "@/components/motion"
import { getPresetForTier, getReducedPreset } from "@/lib/motion"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
  const { reduced } = useMotion()
  const variants = reduced
    ? getReducedPreset("fadeDown")
    : getPresetForTier("fadeDown", "instrument")

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content asChild align={align} sideOffset={sideOffset} {...props} ref={ref}>
        <motion.div
          className={cn(
            "z-50 w-auto rounded-md border border-gray-200 bg-white p-0 text-gray-900 shadow-lg outline-none",
            className
          )}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
