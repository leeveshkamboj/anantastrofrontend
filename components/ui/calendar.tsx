"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="bg-white rounded-md">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-4", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center mb-4 min-h-[2.5rem]",
          caption_label: "text-base font-semibold text-gray-900",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-white border border-gray-300 p-0 hover:bg-orange-50 hover:border-primary hover:text-primary flex items-center justify-center"
          ),
          nav_button_previous: "absolute left-1 top-1/2 -translate-y-1/2",
          nav_button_next: "absolute right-1 top-1/2 -translate-y-1/2",
          table: "w-full border-collapse",
          head_row: "flex mb-2 w-full",
          head_cell:
            "text-gray-700 rounded-md w-9 font-semibold text-xs text-center flex-shrink-0",
          row: "flex w-full mt-1",
          cell: "h-9 w-9 text-center text-sm p-0 relative flex-shrink-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-orange-50/50 [&:has([aria-selected])]:bg-orange-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-orange-50 text-gray-700"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-md font-semibold",
          day_today: "bg-orange-50 text-primary font-semibold border border-primary/20",
          day_outside:
            "day-outside text-gray-400 opacity-50 aria-selected:bg-orange-50/50 aria-selected:text-gray-400 aria-selected:opacity-30",
          day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
          day_range_middle:
            "aria-selected:bg-orange-50 aria-selected:text-gray-900",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
