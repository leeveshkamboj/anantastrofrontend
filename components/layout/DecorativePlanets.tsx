import Image from "next/image"
import { cn } from "@/lib/utils"

const SATURN_SRC = "/images/homepage/backgrounds/saturn-vector.png"
const EARTH_SRC = "/images/homepage/backgrounds/earth-vector.png"

type DecorativePlanetsVariant =
  | "reports"
  | "about"
  | "contact"
  | "pricing"
  | "wallet-quick-actions"
  | "register-status"
  | "register-form"

interface PlanetConfig {
  className: string
  width: number
  height: number
}

interface DecorativePlanetsProps {
  variant?: DecorativePlanetsVariant
}

const VARIANTS: Record<
  DecorativePlanetsVariant,
  { saturn?: PlanetConfig; earth?: PlanetConfig }
> = {
  reports: {
    saturn: {
      className:
        "-left-8 top-2 h-14 w-14 opacity-40 sm:left-10 sm:top-10 sm:h-28 sm:w-28 sm:opacity-100",
      width: 112,
      height: 112,
    },
    earth: {
      className:
        "-right-8 bottom-2 h-16 w-16 opacity-40 sm:bottom-20 sm:right-10 sm:h-36 sm:w-36 sm:opacity-100",
      width: 144,
      height: 144,
    },
  },
  about: {
    saturn: {
      className:
        "-right-8 top-0 h-12 w-12 rotate-12 opacity-30 sm:right-16 sm:top-6 sm:h-32 sm:w-32 sm:opacity-100",
      width: 128,
      height: 128,
    },
    earth: {
      className:
        "-left-10 bottom-0 h-14 w-14 -rotate-6 opacity-30 sm:bottom-16 sm:left-8 sm:h-40 sm:w-40 sm:opacity-100",
      width: 160,
      height: 160,
    },
  },
  contact: {
    earth: {
      className:
        "-left-8 top-2 h-14 w-14 opacity-30 sm:left-16 sm:top-10 sm:h-36 sm:w-36 sm:opacity-100",
      width: 144,
      height: 144,
    },
    saturn: {
      className:
        "-right-8 bottom-4 h-10 w-10 rotate-[20deg] opacity-25 sm:bottom-32 sm:right-6 sm:h-24 sm:w-24 sm:opacity-50",
      width: 96,
      height: 96,
    },
  },
  pricing: {
    saturn: {
      className:
        "-left-8 bottom-2 h-12 w-12 opacity-30 sm:bottom-12 sm:left-20 sm:h-28 sm:w-28 sm:opacity-100",
      width: 112,
      height: 112,
    },
    earth: {
      className:
        "-right-8 top-2 h-14 w-14 -rotate-[15deg] opacity-30 sm:right-20 sm:top-4 sm:h-32 sm:w-32 sm:opacity-100",
      width: 128,
      height: 128,
    },
  },
  "wallet-quick-actions": {
    saturn: {
      className:
        "-left-6 top-6 h-14 w-14 -rotate-12 opacity-50 sm:left-10 sm:top-8 sm:h-28 sm:w-28 sm:opacity-80",
      width: 112,
      height: 112,
    },
    earth: {
      className:
        "-right-6 bottom-4 h-16 w-16 rotate-6 opacity-50 sm:bottom-10 sm:right-10 sm:h-36 sm:w-36 sm:opacity-100",
      width: 144,
      height: 144,
    },
  },
  "register-status": {
    saturn: {
      className:
        "left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] sm:h-64 sm:w-64 sm:opacity-[0.08]",
      width: 256,
      height: 256,
    },
  },
  "register-form": {
    earth: {
      className:
        "-right-6 bottom-4 h-20 w-20 opacity-50 sm:bottom-12 sm:right-12 sm:h-44 sm:w-44 sm:opacity-100",
      width: 176,
      height: 176,
    },
    saturn: {
      className:
        "-left-4 top-2 h-12 w-12 rotate-45 opacity-50 sm:left-20 sm:top-10 sm:h-20 sm:w-20 sm:opacity-70",
      width: 80,
      height: 80,
    },
  },
}

function Planet({
  src,
  config,
}: {
  src: string
  config: PlanetConfig
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        config.className
      )}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        width={config.width}
        height={config.height}
        unoptimized
        className="h-full w-full object-contain"
      />
    </div>
  )
}

export function DecorativePlanets({ variant = "reports" }: DecorativePlanetsProps) {
  const layout = VARIANTS[variant]

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {layout.saturn && <Planet src={SATURN_SRC} config={layout.saturn} />}
      {layout.earth && <Planet src={EARTH_SRC} config={layout.earth} />}
    </div>
  )
}
