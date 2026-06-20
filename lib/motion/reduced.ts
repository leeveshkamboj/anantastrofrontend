import type { TargetAndTransition, Transition, Variant } from "framer-motion"

export const instantTransition: Transition = {
  duration: 0,
  delay: 0,
}

export const visibleState: TargetAndTransition = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
}

export function withReducedMotion<T extends Variant>(
  variant: T,
  reduced: boolean
): T | { initial: TargetAndTransition; animate: TargetAndTransition } {
  if (!reduced) return variant
  return {
    initial: visibleState,
    animate: visibleState,
  }
}

export function getMotionTransition(reduced: boolean, transition: Transition): Transition {
  if (!reduced) return transition
  return instantTransition
}

export function disableLoop(reduced: boolean, animate: TargetAndTransition): TargetAndTransition {
  if (!reduced) return animate
  return visibleState
}
