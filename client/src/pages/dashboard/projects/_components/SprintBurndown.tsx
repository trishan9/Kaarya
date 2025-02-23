"use client"

import { useState } from "react"
import SprintForm from "../_components/SprintForm"
import BurndownChart from "../_components/charts/BurndownChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown } from "lucide-react"
import BurndownExportMenu from "./BurndownExportMenu"
import { Button } from "@/components/ui/button"

export default function SprintBurndown() {
  const [sprintData, setSprintData] = useState<{
    sprintNumber: string
    days: number
    estimatedHours: number[]
    actualHours: number[]
  } | null>(null)

  const handleFormSubmit = (data: {
    sprintNumber: string
    days: number
    estimatedHours: number[]
    actualHours: number[]
  }) => {
    setSprintData(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprint Burndown Chart</CardTitle>
        <CardDescription className="mt-1">Visualize Sprint Progress and Velocity in Real-Time</CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Configuration</CardTitle>
            <CardDescription>Enter your sprint details and daily effort hours</CardDescription>
          </CardHeader>
          <CardContent>
            <SprintForm onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {sprintData ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sprint {sprintData.sprintNumber} Burndown Chart</CardTitle>
                <CardDescription>Visualizing estimated vs actual effort over {sprintData.days} days</CardDescription>
              </div>
              <BurndownExportMenu chartElementId="burndown-chart" sprintData={sprintData} />
            </CardHeader>
            <CardContent className="pt-4">
              <BurndownChart
                sprintNumber={sprintData.sprintNumber}
                days={sprintData.days}
                estimatedHours={sprintData.estimatedHours}
                actualHours={sprintData.actualHours}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center min-h-[400px]">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-muted-foreground">
                <FileDown className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-medium mb-2">No Sprint Data</h3>
                <p>Enter your sprint details and submit the form to generate a burndown chart.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => document.getElementById("sprintNumber")?.focus()}
                className="mt-4"
              >
                Configure Sprint
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Card>
  )
}

