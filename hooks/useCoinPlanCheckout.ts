"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useCoinLaunchFlags } from "@/hooks/useServiceRunPrice"
import { useCreateCoinCheckoutOrderMutation } from "@/store/api/coinsApi"
import { useAuth } from "@/store/hooks/useAuth"
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay-checkout"
import { savePaymentSuccessSnapshot } from "@/lib/payment-success-storage"
import { toast } from "sonner"

export function useCoinPlanCheckout(returnPath: string) {
  const t = useTranslations("pricing")
  const tNav = useTranslations("nav")
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { coinPurchasesEnabled } = useCoinLaunchFlags()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateCoinCheckoutOrderMutation()
  const [checkoutPlanId, setCheckoutPlanId] = useState<number | null>(null)

  const handleBuy = async (planId: number) => {
    if (!coinPurchasesEnabled) return
    if (!isAuthenticated) {
      router.push(`/auth/login?next=${encodeURIComponent(returnPath)}`)
      return
    }
    setCheckoutPlanId(planId)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        toast.error(t("toastWidgetError"))
        return
      }
      const res = await createOrder({ planId }).unwrap()
      const d = res.data
      openRazorpayCheckout({
        keyId: d.keyId,
        orderId: d.orderId,
        currency: d.currency,
        name: tNav("brand"),
        description: t("checkoutDescription", {
          name: d.plan.name,
          quantity: d.plan.coinQuantity,
        }),
        userEmail: user?.email,
        userName: user?.name,
        onSuccess: (paymentId, orderId, signature) => {
          savePaymentSuccessSnapshot({
            orderId,
            paymentId,
            signature,
            planName: d.plan.name,
            coinQuantity: d.plan.coinQuantity,
            amountPaise: d.amountPaise,
            currency: d.currency,
          })
          router.push("/payment/thank-you", { scroll: true })
        },
      })
    } catch {
      toast.error(t("toastCheckoutError"))
    } finally {
      setCheckoutPlanId(null)
    }
  }

  return {
    isAuthenticated,
    checkoutPlanId,
    isCreatingOrder,
    coinPurchasesEnabled,
    handleBuy,
  }
}
