import { describe, expect, it } from "vitest"
import {
  getReducedFloatLoop,
  getReducedPreset,
  getReducedTransition,
  presetKeys,
  presets,
  getFloatLoopPreset,
} from "./presets"
import { visibleState, instantTransition } from "./reduced"
import { getTransition, staggerDelays, transitionTiers } from "./transitions"

describe("motion presets", () => {
  it("exports stable preset keys", () => {
    expect(presetKeys).toContain("fadeUp")
    expect(presetKeys).toContain("floatLoop")
    expect(presetKeys).toContain("gradientReveal")
    expect(Object.keys(presets).sort()).toEqual([...presetKeys].sort())
  })

  it("fadeUp has hidden and visible states", () => {
    expect(presets.fadeUp.hidden).toEqual({ opacity: 0, y: 24 })
    expect(presets.fadeUp.visible).toMatchObject({ opacity: 1, y: 0 })
  })

  it("floatLoop supports infinite repeat with configurable options", () => {
    const custom = getFloatLoopPreset(false, { duration: 12, delay: 0.5, amplitude: 8 })
    expect(custom.float).toMatchObject({
      y: [-4, 4, -4],
      transition: { duration: 12, delay: 0.5, repeat: Infinity },
    })
  })
})

describe("reduced motion fallbacks", () => {
  it("returns identity transform presets", () => {
    const reduced = getReducedPreset("fadeUp")
    expect(reduced.hidden).toEqual(visibleState)
    expect(reduced.visible).toEqual(visibleState)
  })

  it("returns static floatLoop under reduced motion", () => {
    const reduced = getFloatLoopPreset(true)
    expect(reduced).toEqual(getReducedFloatLoop())
    expect(reduced.float).toEqual(visibleState)
  })

  it("returns zero-duration transition", () => {
    expect(getReducedTransition()).toEqual(instantTransition)
    expect(instantTransition.duration).toBe(0)
  })
})

describe("transition tiers", () => {
  it("editorial tier is slower than instrument", () => {
    expect(transitionTiers.editorial.duration).toBeGreaterThan(transitionTiers.instrument.duration)
  })

  it("auth tier has no field stagger", () => {
    expect(staggerDelays.auth).toBe(0)
  })

  it("instrument tier uses fast transitions", () => {
    expect(getTransition("instrument").duration).toBe(0.35)
  })
})
