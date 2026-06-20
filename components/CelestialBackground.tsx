"use client"

import { motion } from "framer-motion"
import {
  TbZodiacAries,
  TbZodiacTaurus,
  TbZodiacGemini,
  TbZodiacCancer,
  TbZodiacLeo,
  TbZodiacVirgo,
  TbZodiacLibra,
  TbZodiacScorpio,
  TbZodiacSagittarius,
  TbZodiacCapricorn,
  TbZodiacAquarius,
  TbZodiacPisces,
} from "react-icons/tb"
import { useMotion } from "@/components/motion/MotionProvider"
import { getFloatLoopPreset, getPresetForTier, getReducedPreset, presets } from "@/lib/motion"
import { cn } from "@/lib/utils"

const zodiacSigns = [
  { Icon: TbZodiacAries, rotation: -12 },
  { Icon: TbZodiacTaurus, rotation: -6 },
  { Icon: TbZodiacGemini, rotation: 0 },
  { Icon: TbZodiacCancer, rotation: 6 },
  { Icon: TbZodiacLeo, rotation: 12 },
  { Icon: TbZodiacVirgo, rotation: 18 },
  { Icon: TbZodiacLibra, rotation: -12 },
  { Icon: TbZodiacScorpio, rotation: -6 },
  { Icon: TbZodiacSagittarius, rotation: 0 },
  { Icon: TbZodiacCapricorn, rotation: 6 },
  { Icon: TbZodiacAquarius, rotation: 12 },
  { Icon: TbZodiacPisces, rotation: 18 },
]

const offsets = [5, -8, 12, -5, 8, -12, 6, -9, 11, -7, 9, -11, 7, -6, 10, -10]
const scatterPositions = [
  { left: 10, top: 15, rotation: 8, opacity: 0.04 },
  { left: 85, top: 20, rotation: -12, opacity: 0.05 },
  { left: 25, top: 60, rotation: 15, opacity: 0.035 },
  { left: 70, top: 55, rotation: -8, opacity: 0.045 },
  { left: 5, top: 80, rotation: 12, opacity: 0.04 },
  { left: 90, top: 75, rotation: -15, opacity: 0.05 },
  { left: 50, top: 10, rotation: 10, opacity: 0.035 },
  { left: 15, top: 40, rotation: -10, opacity: 0.045 },
  { left: 80, top: 45, rotation: 12, opacity: 0.04 },
  { left: 35, top: 85, rotation: -8, opacity: 0.05 },
  { left: 60, top: 25, rotation: 15, opacity: 0.035 },
  { left: 95, top: 65, rotation: -12, opacity: 0.045 },
  { left: 20, top: 30, rotation: 9, opacity: 0.04 },
  { left: 75, top: 35, rotation: -11, opacity: 0.05 },
  { left: 40, top: 70, rotation: 13, opacity: 0.035 },
  { left: 65, top: 90, rotation: -9, opacity: 0.045 },
  { left: 30, top: 5, rotation: 11, opacity: 0.04 },
  { left: 55, top: 50, rotation: -13, opacity: 0.05 },
  { left: 45, top: 95, rotation: 7, opacity: 0.035 },
  { left: 88, top: 12, rotation: -14, opacity: 0.045 },
]

interface CelestialBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function CelestialBackground({ children, className = "" }: CelestialBackgroundProps) {
  const { reduced, tier } = useMotion()
  const gridFade = reduced ? getReducedPreset("fadeIn") : getPresetForTier("fadeIn", tier)
  const gridBreathe = reduced ? getReducedPreset("pulseSoft") : presets.pulseSoft

  return (
    <div className={cn("celestial-header relative isolate", className)}>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="relative h-full w-full">
          <motion.div
            className="absolute inset-0"
            initial="hidden"
            animate="visible"
            variants={gridFade}
          >
            <motion.div
              className="h-full w-full"
              initial="hidden"
              animate={reduced ? "visible" : "visible"}
              variants={gridBreathe}
            >
              <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4 md:grid-cols-12 md:gap-6 md:p-8 lg:grid-cols-16 lg:gap-8">
                {Array.from({ length: 96 }).map((_, index) => {
                  const zodiacIndex = index % zodiacSigns.length
                  const { Icon, rotation } = zodiacSigns[zodiacIndex]
                  const offset = offsets[index % offsets.length]

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                      style={{
                        transform: `rotate(${rotation + offset}deg)`,
                        opacity: 0.035 + (index % 3) * 0.055,
                      }}
                    >
                      <Icon className="h-8 w-8 text-astro-purple md:h-12 md:w-12 lg:h-16 lg:w-16" />
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

          <div className="absolute inset-0">
            {scatterPositions.map((pos, index) => {
              const zodiacIndex = index % zodiacSigns.length
              const { Icon, rotation } = zodiacSigns[zodiacIndex]
              const floatVariants = getFloatLoopPreset(reduced, {
                delay: reduced ? 0 : index * 0.1,
                duration: 8 + (index % 4) * 2,
                amplitude: 6 + (index % 3) * 2,
                rotateAmplitude: 3 + (index % 2) * 2,
              })

              return (
                <div
                  key={`scatter-${index}`}
                  className="absolute"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: `rotate(${rotation + pos.rotation}deg)`,
                    opacity: pos.opacity,
                  }}
                >
                  <motion.div
                    initial="hidden"
                    animate={reduced ? "visible" : ["visible", "float"]}
                    variants={floatVariants}
                  >
                    <Icon className="h-16 w-16 text-astro-purple/20 md:h-24 md:w-24 lg:h-32 lg:w-32" />
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="celestial-content w-full">{children}</div>
    </div>
  )
}
