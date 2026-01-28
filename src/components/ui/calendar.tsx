"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

  // Update current month when selected changes (if valid)
  React.useEffect(() => {
    if (selected instanceof Date) {
      setCurrentMonth(selected)
    } else if (selected?.from) {
      setCurrentMonth(selected.from)
    }
  }, [selected])

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

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value)
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1))
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1))
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  // Year range: current year - 10 to current year + 10 (or dynamic based on needs)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const selectedDate = mode === "single"
    ? (selected instanceof Date ? selected : undefined)
    : undefined

  const selectedRange = mode === "range"
    ? (selected && typeof selected === "object" && "from" in selected ? selected : undefined)
    : undefined

  return (
    <div className={cn("p-4 bg-white w-full", className)}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-8 w-8 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex flex-1 items-center justify-center gap-2">
          <Select
            value={month.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-8 w-[110px] bg-transparent border-gray-200 hover:bg-gray-50 focus:ring-0">
              <SelectValue>{monthNames[month]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {monthNames.map((name, index) => (
                <SelectItem key={name} value={index.toString()}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-[90px] bg-transparent border-gray-200 hover:bg-gray-50 focus:ring-0">
              <SelectValue>{year}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8 text-gray-500 hover:text-gray-900"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center text-[0.8rem] font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
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
          const isInRange = selectedRange?.from && selectedRange?.to && date > selectedRange.from && date < selectedRange.to

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                "relative flex items-center justify-center w-full aspect-square text-sm font-normal transition-all rounded-full",
                isDisabled && "opacity-30 cursor-not-allowed",
                !isDisabled && "hover:bg-blue-50 hover:text-blue-600",
                isSelected && !isInRange &&
                "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-sm font-medium",
                isToday && !isSelected && "ring-1 ring-blue-600 font-medium text-blue-600",
                isInRange && "bg-blue-50 text-blue-700 rounded-none hover:bg-blue-100",
                isStart && isEnd && "rounded-full", // Only one day selected
                isStart && !isEnd && "rounded-l-full rounded-r-none",
                !isStart && isEnd && "rounded-l-none rounded-r-full",
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

