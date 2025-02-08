import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TaskData {
  status: string;
  [key: string]: string | number;
}

export function ProjectTaskDistribution({
  taskData,
}: {
  taskData: TaskData[];
}) {
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    const keys = Object.keys(taskData[0]).filter((key) => key !== "status");
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
    ];

    keys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: colors[index % colors.length],
      };
    });

    return config;
  }, [taskData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sticky">Task Distribution by Project</CardTitle>
        <CardDescription>On the Basis of Task Status</CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
          <ChartContainer config={chartConfig} className="h-[375px] w-full">
            <BarChart
              accessibilityLayer
              data={taskData}
              margin={{ top: 20, bottom: 20 }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="status"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <YAxis tickLine={false} axisLine={false} tickMargin={10} />

              <ChartTooltip content={<ChartTooltipContent hideLabel />} />

              <ChartLegend content={<ChartLegendContent />} />

              {Object.keys(chartConfig).map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={chartConfig[key].color}
                  radius={index === 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
