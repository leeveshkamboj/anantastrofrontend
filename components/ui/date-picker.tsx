"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"

/** Parse "yyyy-MM-dd" as local calendar date (no timezone shift). */
function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function formatDate(date: Date) {
  return format(date, "PPP")
}

interface DatePickerProps {
  value?: string
  onChange: (date: string | undefined) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  name?: string
  min?: Date
  max?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  error,
  disabled,
  name,
  min,
  max,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const valueAsDate = value ? parseLocalDate(value) : undefined
  const [newValue, setNewValue] = React.useState<Date | "">(valueAsDate ?? "")

  const handleSelect = (val: Date | undefined) => {
    if (val) {
      const y = val.getFullYear()
      const m = String(val.getMonth() + 1).padStart(2, "0")
      const d = String(val.getDate()).padStart(2, "0")
      onChange(`${y}-${m}-${d}`)
    } else {
      onChange(undefined)
    }
    setIsOpen(false)
  }

  const handleMonthChange = (val: Date | undefined) => {
    if (val) {
      const year = val.getFullYear()
      const month = val.getMonth()
      const day = valueAsDate ? new Date(valueAsDate).getDate() : 1
      const updatedDate = new Date(year, month, day)
      updatedDate.setDate(updatedDate.getDate() + 2)
      const formatted = format(updatedDate, "yyyy-MM-dd")
      onChange(formatted)
      setNewValue(updatedDate)
    } else {
      setNewValue("")
      onChange(undefined)
    }
  }

  React.useEffect(() => {
    setNewValue(value ? parseLocalDate(value) : "")
  }, [value])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            formatDate(parseLocalDate(value))
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          mode="single"
          selected={valueAsDate}
          onSelect={handleSelect}
          initialFocus
          month={newValue || undefined}
          onMonthChange={handleMonthChange}
          fromDate={min}
          toDate={max}
          captionLayout="dropdown"
          showOutsideDays={true}
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
