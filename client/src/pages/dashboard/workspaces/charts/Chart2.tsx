import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Type definitions
type ProjectData = {
  name: string
  total: number
  completed: number
}

type ProjectsData = {
  [key: string]: ProjectData[]
}

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Chart2({projectsData} : {projectsData : ProjectsData}) {
  const [selectedProject, setSelectedProject] = useState<keyof ProjectsData>("All")

  const isValidProject = (project: string): project is keyof ProjectsData => {
    return project in projectsData
  }

  const getProjectData = (project: string): ProjectData[] => {
    if (isValidProject(project)) {
      return projectsData[project]
    }
    return []
  }

  return (
    <Card>
      <CardHeader>
        <div className="md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <CardTitle>Monthly Task Progress by Project</CardTitle>
            <CardDescription>Last 4 Months Task (Total vs Completed Tasks)</CardDescription>
          </div>
          <Select value={selectedProject as string} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(projectsData).map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
          <ChartContainer config={chartConfig} className="h-[375px] w-full">
            <BarChart
              accessibilityLayer
              data={getProjectData(selectedProject as string)}
              barGap={2}
              barCategoryGap="40%"
              margin={{ top: 20, right: 10, bottom: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} interval={0} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ChartContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

