"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import type { MotionTier } from "@/lib/motion"

type MotionContextValue = {
  reduced: boolean
  tier: MotionTier
}

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  tier: "editorial",
})

export function useMotion() {
  return useContext(MotionContext)
}

type MotionProviderProps = {
  children: ReactNode
  tier?: MotionTier
}

export function MotionProvider({ children, tier = "editorial" }: MotionProviderProps) {
  const prefersReduced = useReducedMotion() ?? false
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.body.setAttribute("data-motion-ready", "true")
    setReady(true)
    return () => {
      document.body.removeAttribute("data-motion-ready")
    }
  }, [])

  return (
    <MotionContext.Provider value={{ reduced: prefersReduced, tier }}>
      {children}
      {!ready ? null : null}
    </MotionContext.Provider>
  )
}
