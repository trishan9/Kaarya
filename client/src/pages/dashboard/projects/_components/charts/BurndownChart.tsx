import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface BurndownChartProps {
  sprintNumber: string
  days: number
  estimatedHours: number[]
  actualHours: number[]
}

export default function BurndownChart({ sprintNumber, days, estimatedHours, actualHours }: BurndownChartProps) {
  // Prepare data for the chart
  const chartData = Array.from({ length: days }).map((_, index) => ({
    day: `Day ${index + 1}`,
    estimated: estimatedHours[index] || 0,
    actual: actualHours[index] || 0,
  }))

  return (
    <div className="w-full h-[400px]" id="burndown-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: "Effort (Hours of Work)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line
           
            dataKey="estimated"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            name="Estimated Effort"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            
            dataKey="actual"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="Actual Effort"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
