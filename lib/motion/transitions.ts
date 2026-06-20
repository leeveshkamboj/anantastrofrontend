export type MotionTier = "editorial" | "instrument" | "auth" | "none"

export const transitionTiers = {
  editorial: {
    duration: 0.85,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  instrument: {
    duration: 0.35,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  auth: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  none: {
    duration: 0,
    ease: "linear" as const,
  },
} as const

export const staggerDelays = {
  editorial: 0.14,
  instrument: 0.07,
  auth: 0,
  none: 0,
} as const

/** Staggered hero / panel entrance delays (seconds). */
export const choreographyDelays = {
  badge: 0.2,
  icon: 0.15,
  title: 0.4,
  subtitle: 0.6,
  subtitle2: 0.8,
  artwork: 0.5,
  content: 0.35,
  action: 0.55,
} as const

export type ChoreographyDelayKey = keyof typeof choreographyDelays

export function getTransition(tier: MotionTier = "editorial") {
  return transitionTiers[tier]
}

export function getStaggerDelay(tier: MotionTier = "editorial") {
  return staggerDelays[tier]
}

export function getChoreographyDelay(key: ChoreographyDelayKey, reduced: boolean) {
  return reduced ? 0 : choreographyDelays[key]
}

export function getStaggerChildrenDelay(tier: MotionTier = "editorial") {
  if (tier === "editorial") return 0.2
  return 0
}
