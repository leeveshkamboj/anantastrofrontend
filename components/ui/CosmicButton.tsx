import * as React from "react"
import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type CosmicVariant = "primary" | "secondary" | "outline" | "gradient-dark"

const variantMap: Record<CosmicVariant, VariantProps<typeof buttonVariants>["variant"]> = {
  primary: "gradient",
  secondary: "secondary",
  outline: "outline",
  "gradient-dark": "gradient-dark",
}

export interface CosmicButtonProps extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  variant?: CosmicVariant
}

function CosmicButton({
  variant = "primary",
  className,
  ...props
}: CosmicButtonProps) {
  return (
    <Button
      variant={variantMap[variant]}
      className={cn(className)}
      {...props}
    />
  )
}

export { CosmicButton, buttonVariants as cosmicButtonVariants }
