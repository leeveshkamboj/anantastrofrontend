import type { Variants } from "framer-motion"
import { getStaggerDelay, getStaggerChildrenDelay, getTransition, type MotionTier } from "./transitions"

export function createFadeUp(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: t },
  }
}

export function createFadeIn(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: t },
  }
}

export function createFadeDown(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: t },
  }
}

export function createSlideInLeft(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0, transition: t },
  }
}

export function createSlideInRight(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: t },
  }
}

export function createScaleIn(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: t },
  }
}

export function createStaggerContainer(tier: MotionTier = "editorial"): Variants {
  const delay = getStaggerDelay(tier)
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: getStaggerChildrenDelay(tier),
      },
    },
  }
}

export function createStaggerItem(tier: MotionTier = "editorial"): Variants {
  return createFadeUp(tier)
}

export function createHoverLift() {
  return {
    rest: { y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
    hover: { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
  }
}

export function createHoverScale() {
  return {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
  }
}

export function createTapScale() {
  return {
    rest: { scale: 1 },
    tap: { scale: 0.98 },
  }
}

export function createTabCrossfade(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: t },
    exit: { opacity: 0, transition: { ...t, duration: t.duration * 0.6 } },
  }
}

export function createDrawerSlide(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { x: "100%" },
    visible: { x: 0, transition: t },
    exit: { x: "100%", transition: { ...t, duration: t.duration * 0.8 } },
  }
}

export function createBackdropFade(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: t },
    exit: { opacity: 0, transition: { ...t, duration: t.duration * 0.6 } },
  }
}

export function createDialogScale(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: t },
    exit: { opacity: 0, scale: 0.95, transition: { ...t, duration: t.duration * 0.6 } },
  }
}

export function createFloatLoop(options?: {
  duration?: number
  delay?: number
  amplitude?: number
  rotateAmplitude?: number
}) {
  const duration = options?.duration ?? 14
  const delay = options?.delay ?? 0
  const amplitude = options?.amplitude ?? 10
  const rotateAmplitude = options?.rotateAmplitude ?? 4

  return {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.75, delay },
    },
    float: {
      y: [-amplitude / 2, amplitude / 2, -amplitude / 2],
      rotate: [-rotateAmplitude, rotateAmplitude, -rotateAmplitude],
      transition: {
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  }
}

export function createGradientReveal(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, originX: 0, transition: { ...t, duration: t.duration * 1.2 } },
  }
}

export function createPulseSoft(): Variants {
  return {
    hidden: { opacity: 0.6 },
    visible: {
      opacity: [0.6, 1, 0.6],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
  }
}

export function createAccordionExpand(tier: MotionTier = "editorial"): Variants {
  const t = getTransition(tier)
  return {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: t },
    exit: { opacity: 0, height: 0, transition: { ...t, duration: t.duration * 0.6 } },
  }
}
