import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const priorityColors: Record<string, string> = {
  Low: "hsl(var(--chart-4))",
  Medium: "hsl(var(--chart-5))",
  High: "hsl(var(--chart-1))",
};

const chartConfig: ChartConfig = {
  tasks: {
    label: "Tasks",
  },
  low: {
    label: "Low",
    color: priorityColors.low,
  },
  medium: {
    label: "Medium",
    color: priorityColors.medium,
  },
  high: {
    label: "High",
    color: priorityColors.high,
  },
};

export function TaskDistByPriority({
  data,
}: {
  data: { name: string; taskCount: number }[];
}) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      fill: priorityColors[item.name] || "gray", // Default to gray if no match
    }));
  }, [data]);

  const totalTasks = () => {
    return chartData.reduce((acc, curr) => acc + curr.taskCount, 0);
  };

  return (
    <Card className="flex flex-col xl:pb-6">
      <CardHeader className="items-start pb-4">
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>Based On Priority Levels</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[315px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="taskCount"
              nameKey="name"
              innerRadius={80}
              outerRadius={130}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="mx-8 mt-6 flex items-center justify-center gap-y-3">
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-4))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black">
                <span>Low</span>
              </p>
            </div>
          </div>

          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-5))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black">
                <span>Medium</span>
              </p>
            </div>
          </div>

          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-1))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black">
                <span>High</span>
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
