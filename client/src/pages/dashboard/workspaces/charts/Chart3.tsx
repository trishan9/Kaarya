import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const chartConfig = {
  taskCount: {
    label: "Task Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Chart3({chartData} : {chartData : any}) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Task Distribution</CardTitle>
        <CardDescription>Task Distribution On the Basis of Month(January - June 2024)</CardDescription>
      </CardHeader>  
      <CardContent >
        <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
          <ChartContainer config={chartConfig} className="h-[375px] w-full">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right : 5,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <YAxis tickLine={false} axisLine={false} tickMargin={12}/>

                <ChartTooltip content={<ChartTooltipContent />} />

                <Line
                  dataKey="taskCount"
                  type="linear"
                  stroke="var(--color-taskCount)"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "var(--color-taskCount)",
                    strokeWidth: 2,
                    stroke: "var(--background)",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "var(--background)",
                  }}
                />
              </LineChart>
          </ChartContainer>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

