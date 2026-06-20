import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface CosmicBadgeProps extends React.ComponentProps<typeof Badge> {
  variant?: "default" | "muted"
}

function CosmicBadge({ className, variant = "default", ...props }: CosmicBadgeProps) {
  if (variant === "muted") {
    return (
      <Badge variant="muted" className={cn("rounded-none border-0 px-0", className)} {...props} />
    )
  }

  return (
    <span className={cn("text-xl font-bold text-black", className)} {...props} />
  )
}

export { CosmicBadge }
