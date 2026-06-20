import Image from "next/image"
import { cn } from "@/lib/utils"

export type SpritePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"

const positionClasses: Record<SpritePosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
}

interface SpriteIconProps {
  src: string
  alt: string
  position: SpritePosition
  className?: string
}

export function SpriteIcon({ src, alt, position, className }: SpriteIconProps) {
  return (
    <div
      className={cn("relative mb-4 h-24 w-24 overflow-hidden", className)}
    >
      <Image
        src={src}
        alt={alt}
        width={192}
        height={192}
        className={cn(
          "absolute max-w-none object-cover",
          "h-[200%] w-[200%]",
          positionClasses[position]
        )}
        sizes="96px"
      />
    </div>
  )
}
