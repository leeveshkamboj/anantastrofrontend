import Image from "next/image"
import { KundliHeroForm } from "@/components/homepage/KundliHeroForm"
import { CelestialBackground } from "../CelestialBackground"

const HERO_ARTWORK = "/images/homepage/hero/hero-premium-bg.png"

export function HeroSection() {
  return (
    <CelestialBackground className=" px-6 pb-20 pt-12 lg:px-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="flex w-full items-center justify-center">
          <div className="relative aspect-square w-full">
            <Image
              src={HERO_ARTWORK}
              alt=""
              fill
              priority
              className="hero-premium-blend object-contain object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <KundliHeroForm />
        </div>
      </div>
    </CelestialBackground>
  )
}
