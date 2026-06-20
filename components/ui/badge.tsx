import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-astro-orange focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-astro-orange text-white hover:bg-orange-600",
        secondary: "border-transparent bg-astro-purple text-white hover:bg-astro-purple/90",
        destructive:
          "border-transparent bg-destructive text-white hover:bg-destructive/80",
        outline: "border-astro-purple text-astro-purple bg-transparent",
        cosmic: "border-transparent bg-black/10 px-4 py-1.5 text-sm font-bold text-black",
        muted: "border-transparent bg-transparent text-sm font-bold text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
