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

const statusColors: Record<string, string> = {
  notStartedTasks: "hsl(var(--chart-4))",
  completedTasks: "hsl(var(--chart-5))",
  activeTasks: "hsl(var(--chart-1))",
};

const chartConfig: ChartConfig = {
  tasks: {
    label: "Tasks",
  },
  notStartedTasks: {
    label: "Todo",
    color: statusColors.notStartedTasks,
  },
  completedTasks: {
    label: "Completed",
    color: statusColors.completedTasks,
  },
  activeTasks: {
    label: "Active",
    color: statusColors.activeTasks,
  },
};

export function TaskCompletion({
  data,
}: {
  data: {
    activeTasks: number;
    completedTasks: number;
    notStartedTasks: number;
  };
}) {
  const chartData = [
    {
      name: "Active",
      taskCount: data?.activeTasks,
      fill: "var(--color-activeTasks)",
    },
    {
      name: "Completed",
      taskCount: data?.completedTasks,
      fill: "var(--color-completedTasks)",
    },
    {
      name: "Todo",
      taskCount: data?.notStartedTasks,
      fill: "var(--color-notStartedTasks)",
    },
  ];

  const totalTasks = () => {
    return chartData.reduce((acc, curr) => acc + curr.taskCount, 0);
  };

  return (
    <Card className="flex flex-col xl:pb-5">
      <CardHeader className="pb-4">
        <CardTitle>Task Completion Overview</CardTitle>
        <CardDescription>Todo vs Active vs Completed Tasks</CardDescription>
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
        <div className="mt-6 flex items-center gap-y-3">
          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-4))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black truncate">
                <span>Todo</span>
              </p>
            </div>
          </div>

          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-1))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black">
                <span>Active</span>
              </p>
            </div>
          </div>

          <div className="w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-6 max-w-3 rounded-full bg-[hsl(var(--chart-5))]"></span>

              <p className="flex w-full justify-between text-sm font-medium text-black">
                <span>Completed</span>
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
