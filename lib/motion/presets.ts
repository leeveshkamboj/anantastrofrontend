import type { TargetAndTransition, Transition, Variants } from "framer-motion"
import { visibleState, instantTransition } from "./reduced"
import {
  createAccordionExpand,
  createBackdropFade,
  createDialogScale,
  createDrawerSlide,
  createFadeDown,
  createFadeIn,
  createFadeUp,
  createFloatLoop,
  createGradientReveal,
  createHoverLift,
  createHoverScale,
  createPulseSoft,
  createScaleIn,
  createSlideInLeft,
  createSlideInRight,
  createStaggerContainer,
  createStaggerItem,
  createTabCrossfade,
  createTapScale,
} from "./variants"
import { getTransition, type MotionTier } from "./transitions"

export const presetKeys = [
  "fadeUp",
  "fadeIn",
  "fadeDown",
  "slideInLeft",
  "slideInRight",
  "scaleIn",
  "staggerContainer",
  "staggerItem",
  "hoverLift",
  "hoverScale",
  "tapScale",
  "accordionExpand",
  "tabCrossfade",
  "drawerSlide",
  "backdropFade",
  "dialogScale",
  "floatLoop",
  "gradientReveal",
  "pulseSoft",
] as const

export type PresetKey = (typeof presetKeys)[number]

export const presets = {
  fadeUp: createFadeUp(),
  fadeIn: createFadeIn(),
  fadeDown: createFadeDown(),
  slideInLeft: createSlideInLeft(),
  slideInRight: createSlideInRight(),
  scaleIn: createScaleIn(),
  staggerContainer: createStaggerContainer(),
  staggerItem: createStaggerItem(),
  hoverLift: createHoverLift(),
  hoverScale: createHoverScale(),
  tapScale: createTapScale(),
  accordionExpand: createAccordionExpand(),
  tabCrossfade: createTabCrossfade(),
  drawerSlide: createDrawerSlide(),
  backdropFade: createBackdropFade(),
  dialogScale: createDialogScale(),
  floatLoop: createFloatLoop(),
  gradientReveal: createGradientReveal(),
  pulseSoft: createPulseSoft(),
} as const

export function getPresetForTier(key: PresetKey, tier: MotionTier): Variants {
  switch (key) {
    case "fadeUp":
      return createFadeUp(tier)
    case "fadeIn":
      return createFadeIn(tier)
    case "fadeDown":
      return createFadeDown(tier)
    case "slideInLeft":
      return createSlideInLeft(tier)
    case "slideInRight":
      return createSlideInRight(tier)
    case "scaleIn":
      return createScaleIn(tier)
    case "staggerContainer":
      return createStaggerContainer(tier)
    case "staggerItem":
      return createStaggerItem(tier)
    case "tabCrossfade":
      return createTabCrossfade(tier)
    case "drawerSlide":
      return createDrawerSlide(tier)
    case "backdropFade":
      return createBackdropFade(tier)
    case "dialogScale":
      return createDialogScale(tier)
    case "gradientReveal":
      return createGradientReveal(tier)
    case "accordionExpand":
      return createAccordionExpand(tier)
    default:
      return presets[key] as Variants
  }
}

export function getReducedPreset(key: PresetKey): Variants {
  return {
    hidden: visibleState,
    visible: visibleState,
    ...(key === "tabCrossfade" || key === "drawerSlide" || key === "backdropFade" || key === "dialogScale" || key === "accordionExpand"
      ? { exit: visibleState }
      : {}),
  }
}

export function getReducedFloatLoop(): Variants {
  return {
    hidden: visibleState,
    visible: visibleState,
    float: visibleState,
  }
}

export function getReducedTransition(): Transition {
  return instantTransition
}

export function getFloatLoopPreset(
  reduced: boolean,
  options?: Parameters<typeof createFloatLoop>[0]
): Variants {
  if (reduced) return getReducedFloatLoop()
  return createFloatLoop(options)
}

export function getHoverProps(reduced: boolean) {
  if (reduced) return {}
  return {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 },
  }
}

export function getTapProps(reduced: boolean) {
  if (reduced) return {}
  return { whileTap: { scale: 0.98 } }
}

export function getViewportOptions() {
  return {
    once: true as const,
    margin: "-10%" as const,
  }
}

export { type MotionTier, getTransition }
