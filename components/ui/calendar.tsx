"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        root: "rdp-root",
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-11",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md border border-gray-300 bg-white p-0 hover:bg-orange-50 hover:border-primary hover:text-primary inline-flex items-center justify-center"
        ),
        button_next: cn(
          "absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md border border-gray-300 bg-white p-0 hover:bg-orange-50 hover:border-primary hover:text-primary inline-flex items-center justify-center"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full mb-2",
        weekday: "text-gray-700 rounded-md w-9 font-semibold text-xs text-center flex-shrink-0",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative flex-shrink-0 [&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-md hover:bg-orange-50 text-gray-700 aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-md font-semibold",
        today: "bg-orange-50 text-primary font-semibold border border-primary/20 rounded-md",
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          ...chevronProps
        }: {
          orientation?: "left" | "right" | "up" | "down"
          className?: string
          size?: number
          disabled?: boolean
        }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" {...chevronProps} />
          ) : (
            <ChevronRight className="h-4 w-4" {...chevronProps} />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
