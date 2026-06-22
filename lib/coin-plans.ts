import type { CoinPlanPublic } from "@/store/api/coinsApi"

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

export function formatInrPerCoin(paise: number) {
  if (!Number.isFinite(paise) || paise < 0) return "—"
  const rupees = paise / 100
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: rupees < 100 ? 2 : 0,
  }).format(rupees)
}

export function effectiveCostPerCoinPaise(pricePaise: number, coinQuantity: number) {
  if (!Number.isFinite(pricePaise) || !Number.isFinite(coinQuantity) || coinQuantity < 1) {
    return null
  }
  return Math.round(pricePaise / coinQuantity)
}

export function computePlanComparison(plans: CoinPlanPublic[]) {
  const perCoinByPlanId = new Map<number, number>()
  const cpps: number[] = []

  for (const plan of plans) {
    const cpp = effectiveCostPerCoinPaise(plan.pricePaise, plan.coinQuantity)
    if (cpp != null) {
      perCoinByPlanId.set(plan.id, cpp)
      cpps.push(cpp)
    }
  }

  const minCostPerCoinPaise = cpps.length ? Math.min(...cpps) : null

  const isBestValuePlan = (planId: number) => {
    if (plans.length < 2 || minCostPerCoinPaise == null) return false
    const cpp = perCoinByPlanId.get(planId)
    return cpp != null && cpp === minCostPerCoinPaise
  }

  return { perCoinByPlanId, minCostPerCoinPaise, isBestValuePlan }
}
