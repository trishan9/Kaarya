import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "../../../components/AnalyticsCard";
import { DottedSeparator } from "@/components/ui/dotted-separator";

export const Analytics = ({
  data,
}: {
  data: {
    taskCount: number;
    taskDiff: number;
    assignedTaskDiff: number;
    assignedTaskCount: number;
    completedTaskCount: number;
    completeTaskDiff: number;
    overdueTaskCount: number;
    overdueTaskDiff: number;
    incompleteTaskCount: number;
    incompleteTaskDiff: number;
  };
}) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDiff > 0 ? "up" : "down"}
            increasedValue={data.taskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.assignedTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completeTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.completeTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="OverDue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.overdueTaskDiff}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDiff > 0 ? "up" : "down"}
            increasedValue={data.incompleteTaskDiff}
          />
        </div>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
