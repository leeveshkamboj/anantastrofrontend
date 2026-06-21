"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { KundliHeroForm } from "@/components/homepage/KundliHeroForm"
import { CelestialBackground } from "@/components/CelestialBackground"
import { getChoreographyDelay, getPresetForTier, getReducedPreset } from "@/lib/motion"
import { useMotion } from "@/components/motion/MotionProvider"

const HERO_ARTWORK = "/images/homepage/hero/hero-premium-bg.png"

export function HomepageHero() {
  const { reduced, tier } = useMotion()
  const slideLeft = reduced ? getReducedPreset("slideInLeft") : getPresetForTier("slideInLeft", tier)
  const slideRight = reduced ? getReducedPreset("slideInRight") : getPresetForTier("slideInRight", tier)

  return (
    <CelestialBackground className="px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-24 lg:pb-20 lg:pt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          className="order-2 flex w-full items-center justify-center lg:order-1"
          initial="hidden"
          animate="visible"
          variants={slideLeft}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-sm lg:max-w-none">
            <Image
              src={HERO_ARTWORK}
              alt=""
              fill
              priority
              className="hero-premium-blend object-contain object-center"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 384px, 50vw"
            />
          </div>
        </motion.div>

        <motion.div
          className="order-1 flex w-full items-center justify-center lg:order-2"
          initial="hidden"
          animate="visible"
          variants={slideRight}
          transition={{ delay: getChoreographyDelay("artwork", reduced) }}
        >
          <KundliHeroForm />
        </motion.div>
      </div>
    </CelestialBackground>
  )
}
