"use client"

import { useCallback } from "react"
import { useMotion } from "@/components/motion/MotionProvider"
import {
  ensureChatAudioReady,
  playChatReceiveSound,
  playChatSendSound,
  playChatTypingSound,
} from "@/lib/chat-sounds"

export function useChatSounds() {
  const { reduced } = useMotion()

  const playIfAllowed = useCallback(
    async (play: () => void) => {
      if (reduced) return
      const ready = await ensureChatAudioReady()
      if (!ready) return
      play()
    },
    [reduced],
  )

  const prime = useCallback(() => {
    void ensureChatAudioReady()
  }, [])

  const playSend = useCallback(() => {
    void playIfAllowed(playChatSendSound)
  }, [playIfAllowed])

  const playReceive = useCallback(() => {
    void playIfAllowed(playChatReceiveSound)
  }, [playIfAllowed])

  const playTyping = useCallback(() => {
    void playIfAllowed(playChatTypingSound)
  }, [playIfAllowed])

  return { prime, playSend, playReceive, playTyping }
}
