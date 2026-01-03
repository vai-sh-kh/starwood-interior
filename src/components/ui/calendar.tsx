"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  mode?: "single" | "range"
  selected?: Date | { from?: Date; to?: Date }
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void
  numberOfMonths?: number
  disabled?: (date: Date) => boolean
  className?: string
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  numberOfMonths = 1,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected instanceof Date
      ? selected
      : selected?.from
        ? selected.from
        : new Date()
  )

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const isDateInRange = (date: Date, range: { from?: Date; to?: Date }) => {
    if (!range.from && !range.to) return false
    if (range.from && isSameDay(date, range.from)) return true
    if (range.to && isSameDay(date, range.to)) return true
    if (range.from && range.to) {
      return date >= range.from && date <= range.to
    }
    return false
  }

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (disabled && disabled(date)) return

    if (mode === "single") {
      onSelect?.(date)
    } else {
      const range = selected && typeof selected === "object" && "from" in selected
        ? selected
        : { from: undefined, to: undefined }
      
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined })
      } else if (range.from && !range.to) {
        if (date < range.from) {
          onSelect?.({ from: date, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: date })
        }
      }
    }
  }

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const selectedDate = mode === "single" 
    ? (selected instanceof Date ? selected : undefined)
    : undefined

  const selectedRange = mode === "range"
    ? (selected && typeof selected === "object" && "from" in selected ? selected : undefined)
    : undefined

  return (
    <div className={cn("p-3 bg-white", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-sm">{monthName}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const isSelected =
            mode === "single"
              ? selectedDate && isSameDay(date, selectedDate)
              : selectedRange && isDateInRange(date, selectedRange)
          const isDisabled = disabled ? disabled(date) : false
          const isToday = isSameDay(date, new Date())
          const isStart = selectedRange?.from && isSameDay(date, selectedRange.from)
          const isEnd = selectedRange?.to && isSameDay(date, selectedRange.to)

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                "aspect-square rounded-md text-sm font-medium transition-colors",
                "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                isDisabled && "opacity-50 cursor-not-allowed",
                isSelected &&
                  "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
                !isSelected &&
                  !isDisabled &&
                  "hover:bg-gray-100",
                isToday && !isSelected && "border border-blue-600",
                mode === "range" &&
                  selectedRange?.from &&
                  !selectedRange?.to &&
                  date >= selectedRange.from &&
                  "bg-blue-100",
                mode === "range" &&
                  selectedRange?.from &&
                  selectedRange?.to &&
                  date > selectedRange.from &&
                  date < selectedRange.to &&
                  "bg-blue-100",
                isStart && "rounded-l-md",
                isEnd && "rounded-r-md"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }

