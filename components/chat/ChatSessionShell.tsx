"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/layout/Container"
import { FadeIn } from "@/components/motion"
import { serviceFormCardClassName } from "@/components/services"
import { cn } from "@/lib/utils"

type ChatSessionShellProps = {
  children: React.ReactNode
  className?: string
}

export function ChatSessionShell({ children, className }: ChatSessionShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col px-4 py-4 sm:px-6 lg:px-16">
      <Container size="narrow" className="flex h-full min-h-0 flex-col">
        <FadeIn preset="fadeUp" className="flex h-full min-h-0 flex-col">
          <div className={cn(serviceFormCardClassName, "flex h-full min-h-0 flex-col", className)}>
            <motion.div
              className="h-1 shrink-0 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
              aria-hidden="true"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            {children}
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}

export function ChatSessionSkeleton() {
  return (
    <ChatSessionShell>
      <div className="shrink-0 border-b border-gray-100 px-4 py-5 sm:px-6">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="flex animate-pulse items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="h-3 w-52 rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-12 shrink-0 rounded-2xl bg-gray-200" />
      </div>
    </ChatSessionShell>
  )
}
