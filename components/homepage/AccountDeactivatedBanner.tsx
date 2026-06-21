"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertTriangle, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export function AccountDeactivatedBanner() {
  const t = useTranslations("home.accountDeactivated")
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(searchParams.get("error") === "account_deactivated")
  }, [searchParams])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    const url = new URL(window.location.href)
    url.searchParams.delete("error")
    router.replace(url.pathname + url.search, { scroll: false })
  }

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 sm:px-6 lg:px-24"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t("title")}</p>
          <p className="text-sm">{t("message")}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-amber-950 hover:bg-amber-100"
          onClick={dismiss}
          aria-label={t("dismiss")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
