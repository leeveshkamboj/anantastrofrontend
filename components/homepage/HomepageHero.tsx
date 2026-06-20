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
    <CelestialBackground className="px-6 pb-20 pt-12 lg:px-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          className="flex w-full items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={slideLeft}
        >
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
        </motion.div>

        <motion.div
          className="flex w-full items-center justify-center"
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
