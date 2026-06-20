import { cn } from "@/lib/utils"

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "default" | "narrow"
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className
      )}
      {...props}
    />
  )
}
