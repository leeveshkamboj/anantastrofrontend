import * as React from "react"
import { Card, type cardVariants } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CosmicCardProps extends Omit<React.ComponentProps<typeof Card>, "variant"> {
  variant?: "default" | "glass"
  padding?: "sm" | "md"
}

function CosmicCard({
  variant = "default",
  padding = "sm",
  className,
  ...props
}: CosmicCardProps) {
  const cardVariant = variant === "glass" ? "glass" : "cosmic"

  return (
    <Card
      variant={cardVariant}
      className={cn(
        "items-center gap-0 text-center",
        padding === "md" ? "p-8" : "p-6",
        className
      )}
      {...props}
    />
  )
}

export { CosmicCard, cardVariants as cosmicCardVariants }
