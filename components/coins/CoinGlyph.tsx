import Image from "next/image"
import { cn } from "@/lib/utils"

/** Full-resolution coin mark (public/coin.png). */
export const COIN_SRC = "/coin.png"

/** UI-sized mark derived from coin.png for inline use across the app. */
export const COIN_MARK_SRC = "/coin-mark.png"

/** Consistent branded coin mark used wherever coin balance or cost is shown. */
export function CoinGlyph({ className }: { className?: string }) {
  return (
    <Image
      src={COIN_MARK_SRC}
      alt=""
      width={32}
      height={32}
      className={cn("inline-block shrink-0 object-contain", className)}
      aria-hidden
    />
  )
}
