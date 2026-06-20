export const LOW_BALANCE_THRESHOLD = 15
export const HEALTHY_BALANCE_THRESHOLD = 100

export type BalanceTone = "empty" | "low" | "moderate" | "healthy"

export function getBalanceTone(balance: number): BalanceTone {
  if (balance <= 0) return "empty"
  if (balance < LOW_BALANCE_THRESHOLD) return "low"
  if (balance < HEALTHY_BALANCE_THRESHOLD) return "moderate"
  return "healthy"
}

export function getBalanceLabelKey(balance: number): string {
  const tone = getBalanceTone(balance)
  if (tone === "empty") return "balanceLabelEmpty"
  if (tone === "low") return "balanceLabelLow"
  return "balanceLabelAvailable"
}

export function getBalanceMessageKey(balance: number): string {
  const tone = getBalanceTone(balance)
  if (tone === "empty") return "balanceMessageEmpty"
  if (tone === "low") return "balanceMessageLow"
  if (tone === "moderate") return "balanceMessageModerate"
  return "balanceMessageHealthy"
}

export function formatInr(paise: number | undefined) {
  const n = Number(paise)
  if (!Number.isFinite(n)) return "—"
  const rupees = n / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees)
}

export function paymentStatusBadgeClass(status: string | null | undefined): string {
  const s = (status ?? "").toUpperCase()
  if (s === "PAID") {
    return "border-transparent bg-emerald-600 text-white shadow-sm hover:bg-emerald-600"
  }
  if (s === "PENDING") {
    return "border-amber-300/80 bg-amber-50 text-amber-950 shadow-sm hover:bg-amber-50"
  }
  if (s === "FAILED") {
    return "border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-600"
  }
  return "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100"
}
