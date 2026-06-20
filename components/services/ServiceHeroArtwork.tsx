import Image from "next/image"
import { cn } from "@/lib/utils"
import type { SpritePosition } from "@/components/homepage/SpriteIcon"

const SPRITE_SRC = "/images/homepage/services/services-sprite.jpg"

const positionClasses: Record<SpritePosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
}

type ServiceHeroArtworkProps = {
  position: SpritePosition
  alt?: string
  className?: string
}

export function ServiceHeroArtwork({ position, alt = "", className }: ServiceHeroArtworkProps) {
  return (
    <div
      className={cn(
        "relative h-48 w-48 overflow-hidden sm:h-56 sm:w-56 lg:h-64 lg:w-64",
        className,
      )}
    >
      <Image
        src={SPRITE_SRC}
        alt={alt}
        width={512}
        height={512}
        priority
        className={cn(
          "absolute max-w-none object-cover drop-shadow-[0_12px_32px_rgba(46,10,94,0.2)]",
          "h-[200%] w-[200%]",
          positionClasses[position],
        )}
        sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
      />
    </div>
  )
}
