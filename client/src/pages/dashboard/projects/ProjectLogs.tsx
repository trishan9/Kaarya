import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MemberAvatar } from "../workspaces/_components/MemberAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/DatePicker";
import { useProjectId } from "@/hooks/useProjectId";
import { useGetLogs } from "@/hooks/useLogs";
import type { ActivityType, ActivityLogInput } from "./_schemas";
import { Ellipsis, SquarePen } from "lucide-react";
import { LogsAction } from "./_components/LogsActions";
import { useGetWorkspace } from "@/hooks/useWorkspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import "react-quill/dist/quill.snow.css";
import { useCreateLogModal } from "@/hooks/useCreateLogModal";
import { Preview } from "@/components/Preview";
import { Badge } from "@/components/ui/badge";

interface ActivityLog extends ActivityLogInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  member: {
    id: string;
    role: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const activityTypeMap: Record<ActivityType, string> = {
  SPRINT_PLANNING: "Planning",
  SPRINT_REVIEW: "Review",
  SPRINT_RETROSPECTIVE: "Retrospective",
  DAILY_SCRUM: "Daily Scrum",
  OTHERS: "Others",
};

export default function ProjectLogs() {
  const projectId = useProjectId();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filterUser, setFilterUser] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ActivityType | "all" | null>(
    null
  );
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const { data: logsData, isLoading, error } = useGetLogs({ projectId });

  const workspaceId = useWorkspaceId();
  const { data: workspaceData } = useGetWorkspace({ workspaceId });
  const membersData = workspaceData?.data?.workspace?.members || [];

  useEffect(() => {
    if (logsData?.data) {
      setLogs(logsData.data.logs);
    }
  }, [logsData]);

  const { open } = useCreateLogModal();

  const filteredLogs = logs.filter((log) => {
    const userMatch =
      filterUser === "all" || !filterUser || log.member.userId === filterUser;
    const typeMatch =
      filterType === "all" || !filterType || log.type === filterType;
    const dateMatch =
      !filterDate ||
      new Date(log.createdAt).toDateString() === filterDate.toDateString();
    return userMatch && typeMatch && dateMatch;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex w-full">
      <Card className="w-full pt-4">
        <div className="px-6 mb-4 flex flex-col gap-2 sm:gap-2 sm:px-6 md:mb-4 sm:flex sm:flex-row">
          <Select
            value={filterUser || "all"}
            onValueChange={(value) => setFilterUser(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-9 border shadow-sm border-gray-300">
              <SelectValue placeholder="Filter by User" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {membersData.map((member: any) => (
                <SelectItem key={member.userId} value={member.userId}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterType || "all"}
            onValueChange={(value: ActivityType | "all") =>
              setFilterType(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px] h-9 border shadow-sm border-gray-300">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(activityTypeMap).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            value={filterDate}
            onChange={(date: Date) => setFilterDate(date)}
            placeholder="Filter by Date"
            className="w-full sm:w-[180px] h-9 border shadow-sm border-gray-300"
          />
        </div>

        <ScrollArea className="h-[45vh] sm:h-[67vh] rounded-lg w-full">
          <CardContent className="border">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-50 py-3 pl-2 sm:p-3 rounded-lg border flex flex-col mb-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:items-center justify-between flex-wrap mb-2">
                  <div className="flex items-center gap-2">
                    <MemberAvatar
                      name={log?.member.user.name}
                      className="w-7 h-7"
                    />

                    <div className="text-sm sm:text-base flex items-center gap-2">
                      <span className="sm:font-medium truncate">
                        {log?.member?.user?.name}
                      </span>

                      <span className="text-[11px] sm:text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString().slice(0, 8)}
                      </span>

                      <span className="text-[11px] sm:text-sm text-gray-500 hidden sm:block">
                        {new Date(log.createdAt).toLocaleString().slice(10, 14) + new Date(log.createdAt).toLocaleString().slice(17, 20)}
                      </span>
                    </div>

                    {!log?.isDeleted && (
                      <LogsAction id={log.id} logData={log}>
                        <Button variant="ghost" className="size-8">
                          <Ellipsis className="size-4" />
                        </Button>
                      </LogsAction>
                    )}
                  </div>
                  <div>
                    <Badge variant={log.type}>
                      {activityTypeMap[log.type]}
                    </Badge>
                  </div>
                </div>

                <div className="sm:px-2 pt-2 whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm" />
                <Preview
                  value={
                    log.isDeleted
                      ? "<em>This message has been deleted</em>"
                      : log.content
                  }
                />
              </div>
            ))}
          </CardContent>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button onClick={open} type="submit">
            <SquarePen />
            Write a Log
          </Button>
        </div>
      </Card>
    </div>
  );
}