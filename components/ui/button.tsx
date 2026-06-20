import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-astro-orange focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-astro-orange text-white shadow-md hover:bg-orange-600 rounded-full",
        gradient:
          "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg hover:from-orange-600 hover:to-yellow-600 rounded-full uppercase tracking-wide",
        "gradient-dark":
          "bg-gradient-to-r from-orange-400 to-yellow-500 text-black font-bold shadow-xl hover:from-orange-500 hover:to-yellow-600 rounded-full",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 rounded-full focus-visible:ring-destructive/20",
        outline:
          "border border-astro-purple text-astro-purple bg-transparent hover:bg-astro-purple/5 rounded-full",
        secondary: "bg-astro-orange text-white hover:bg-orange-600 rounded-full",
        ghost: "hover:bg-astro-orange/10 hover:text-astro-purple rounded-full",
        link: "text-astro-purple underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 px-8 py-2 text-sm has-[>svg]:px-3",
        lg: "h-auto w-full py-4 text-base has-[>svg]:px-4",
        pill: "h-auto flex-1 py-2 text-xs font-bold has-[>svg]:px-2",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
