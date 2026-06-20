"use client"

import { Container } from "@/components/layout/Container"
import { serviceFormCardClassName } from "@/components/services"
import { cn } from "@/lib/utils"

type ChatSessionShellProps = {
  children: React.ReactNode
  className?: string
}

export function ChatSessionShell({ children, className }: ChatSessionShellProps) {
  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 sm:px-6 lg:px-16 lg:py-10">
      <Container size="narrow">
        <div className={cn(serviceFormCardClassName, "flex min-h-[70vh] flex-col", className)}>
          <div
            className="h-1 bg-linear-to-r from-astro-orange via-astro-yellow to-astro-purple"
            aria-hidden="true"
          />
          {children}
        </div>
      </Container>
    </div>
  )
}

export function ChatSessionSkeleton() {
  return (
    <ChatSessionShell>
      <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
        <div className="mb-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="flex animate-pulse items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="h-3 w-52 rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="min-h-[50vh] flex-1 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-12 rounded-2xl bg-gray-200" />
      </div>
    </ChatSessionShell>
  )
}
