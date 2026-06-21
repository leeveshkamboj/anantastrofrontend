let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    audioCtx = new Ctx()
  }
  return audioCtx
}

export async function ensureChatAudioReady(): Promise<boolean> {
  const ctx = getAudioContext()
  if (!ctx) return false
  if (ctx.state === "suspended") {
    try {
      await ctx.resume()
    } catch {
      return false
    }
  }
  return ctx.state === "running"
}

function playTone(
  frequency: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
) {
  const ctx = getAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, startTime)
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.02)
}

/** Soft upward pop when the user sends a message. */
export function playChatSendSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  playTone(520, t, 0.07, 0.045, "sine")
  playTone(780, t + 0.04, 0.08, 0.035, "sine")
}

/** Gentle two-note chime when an astrologer message arrives. */
export function playChatReceiveSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  playTone(660, t, 0.11, 0.05, "sine")
  playTone(880, t + 0.09, 0.14, 0.042, "sine")
}

/** Subtle tap when the typing indicator appears. */
export function playChatTypingSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  playTone(420, t, 0.05, 0.028, "triangle")
  playTone(520, t + 0.035, 0.06, 0.022, "triangle")
}
