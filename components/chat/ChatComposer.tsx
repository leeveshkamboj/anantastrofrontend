"use client"

import { useTranslations } from "next-intl"
import { CosmicButton } from "@/components/ui/CosmicButton"
import { Input } from "@/components/ui/input"

type ChatComposerProps = {
  text: string
  onTextChange: (value: string) => void
  onSubmit: () => void
  sending: boolean
  isSessionClosed: boolean
  isLoading: boolean
}

export function ChatComposer({
  text,
  onTextChange,
  onSubmit,
  sending,
  isSessionClosed,
  isLoading,
}: ChatComposerProps) {
  const t = useTranslations("chatSession")

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <Input
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={isSessionClosed ? t("placeholderClosed") : t("placeholderType")}
          className="h-10 flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 sm:h-11"
          disabled={isSessionClosed || isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit()
          }}
        />
        <CosmicButton
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={sending || !text.trim() || isSessionClosed || isLoading}
          className="shrink-0 normal-case tracking-normal"
        >
          {isSessionClosed ? t("closed") : isLoading ? t("loading") : sending ? t("sending") : t("send")}
        </CosmicButton>
      </div>
      <p className="text-center text-xs text-gray-500">
        {isSessionClosed ? t("billingStopped") : t("billingActive")}
      </p>
    </div>
  )
}
