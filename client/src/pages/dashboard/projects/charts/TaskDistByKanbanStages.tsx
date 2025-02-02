"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// const chartData = [
//   { status: "Backlog", tasks: 40 },
//   { status: "To-Do", tasks: 20 },
//   { status: "In-Progress", tasks: 25 },
//   { status: "In-Review", tasks: 8 },
//   { status: "Completed", tasks: 30 },
// ]

const chartConfig = {
    tasks: {
    label: "tasks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TaskDistByKanbanStages({chartData} : {chartData:any}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution (Kanban)</CardTitle>
        <CardDescription>On the Basis of Kanban Stages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[375px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0, // Increased left margin to prevent label cutoff
              right: 10,
              top: 5,
              bottom: 10,
            }}
            barSize={50} // Reduced bar size (adjust as needed)
          >
            <XAxis type="number" dataKey="taskCount" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={100} // Increased width to accommodate labels
              style={{ fontSize: "14px" }} // Adjusted font size for better readability
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="taskCount" fill="var(--color-tasks)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

