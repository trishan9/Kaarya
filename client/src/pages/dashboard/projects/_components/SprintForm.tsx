"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface SprintFormProps {
  onSubmit: (data: {
    sprintNumber: string
    days: number
    estimatedHours: number[]
    actualHours: number[]
  }) => void
}

export default function SprintForm({ onSubmit }: SprintFormProps) {
  const [sprintNumber, setSprintNumber] = useState("1")
  const [days, setDays] = useState(5)
  const [estimatedHours, setEstimatedHours] = useState<number[]>([])
  const [actualHours, setActualHours] = useState<number[]>([])
  const [showDayInputs, setShowDayInputs] = useState(false)

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDays = Number.parseInt(e.target.value) || 0
    setDays(newDays)

    // Reset hours arrays when days change
    setEstimatedHours(Array(newDays).fill(0))
    setActualHours(Array(newDays).fill(0))
  }

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowDayInputs(true)
  }

  const handleHoursChange = (index: number, type: "estimated" | "actual", value: number) => {
    if (type === "estimated") {
      const newEstimatedHours = [...estimatedHours]
      newEstimatedHours[index] = value
      setEstimatedHours(newEstimatedHours)
    } else {
      const newActualHours = [...actualHours]
      newActualHours[index] = value
      setActualHours(newActualHours)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      sprintNumber,
      days,
      estimatedHours,
      actualHours,
    })
  }

  return (
    <div>
      {!showDayInputs ? (
        <form onSubmit={handleConfigSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sprintNumber">Sprint Number</Label>
              <Input
                id="sprintNumber"
                type="text"
                value={sprintNumber}
                onChange={(e) => setSprintNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input id="days" type="number" min="1" max="30" value={days} onChange={handleDaysChange} required />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Daily Effort Hours for Sprint {sprintNumber}</h3>

            {Array.from({ length: days }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium mb-3">Day {index + 1}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`estimated-${index}`}>Estimated Hours</Label>
                      <Input
                        id={`estimated-${index}`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={estimatedHours[index] || 0}
                        onChange={(e) => handleHoursChange(index, "estimated", Number.parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`actual-${index}`}>Actual Hours</Label>
                      <Input
                        id={`actual-${index}`}
                        type="number"
                        min="0"
                        step="0.5"
                        value={actualHours[index] || 0}
                        onChange={(e) => handleHoursChange(index, "actual", Number.parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setShowDayInputs(false)} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Generate Chart
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

