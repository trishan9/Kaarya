import { useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectData {
  [key: string]: number
}

interface MemberData {
  member: string
  [key: string]: string | ProjectData
}

interface ChartData {
  member: string
  [key: string]: string | number
}

export function MemberTaskContribution({ memberData }: { memberData: MemberData[] }) {
  const [project, setProject] = useState<string>("all")

  const projects = useMemo(() => {
    const allProjects = new Set<string>()
    memberData.forEach((member) => {
      Object.keys(member).forEach((key) => {
        if (key !== "member" && typeof member[key] === "object") {
          Object.keys(member[key] as ProjectData).forEach((proj) => allProjects.add(proj))
        }
      })
    })
    return Array.from(allProjects)
  }, [memberData])

  const statuses = useMemo(() => {
    return Object.keys(memberData[0]).filter((key) => key !== "member")
  }, [memberData])

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--chart-6))",
      "hsl(var(--chart-7))",
      "hsl(var(--chart-8))",
      "hsl(var(--chart-9))",
      "hsl(var(--chart-10))",
    ]

    statuses.forEach((status, index) => {
      config[status] = {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: colors[index % colors.length],
      }
    })

    return config
  }, [statuses])

  const filteredData: ChartData[] = useMemo(() => {
    return memberData.map((member) => {
      const chartDataItem: ChartData = { member: member.member }
      statuses.forEach((status) => {
        const statusData = member[status] as ProjectData
        chartDataItem[status] = statusData[project]
      })
      return chartDataItem
    })
  }, [memberData, project, statuses])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sticky">Member Task Contribution</CardTitle>

        <CardDescription>On the Basis of Status and Project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 w-[200px]">
          <Select onValueChange={(value) => setProject(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((proj) => (
                <SelectItem key={proj} value={proj}>
                  {proj === "all" ? "All Projects" : proj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="rounded-lg w-full whitespace-nowrap">
          <div className="h-[500px]">
            <ChartContainer config={chartConfig} className="h-full w-full min-w-[600px]">
              <BarChart
                accessibilityLayer
                data={filteredData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 5, bottom: 20 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis dataKey="member" type="category" tickLine={false} axisLine={false} tickMargin={10} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {statuses.map((status, index) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    stackId="a"
                    fill={chartConfig[status].color}
                    radius={index === 0 ? [4, 0, 0, 4] : index === statuses.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

