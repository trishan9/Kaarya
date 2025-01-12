import { useQueryState } from "nuqs";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { useCreateTaskModal } from "@/hooks/useCreateTaskModal";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = (props: TaskViewSwitcherProps) => {
  console.log(props);

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { open } = useCreateTaskModal();

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex  lg:flex-row gap-y-2 items-center justify-start w-full">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
          </TabsList>

          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>

          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={open}
            size="sm"
            className="h-8 w-full lg:w-auto ml-1"
          >
            <Plus className="size-4" />
            New
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <p>data filter</p>

        <DottedSeparator className="my-4" />

        <>
          <TabsContent value="table" className="mt-2">
            <h1>I am table</h1>
          </TabsContent>

          <TabsContent value="kanban" className="mt-2">
            <h1>I am kanban</h1>
          </TabsContent>

          <TabsContent value="calendar" className="mt-2">
            <h1>I am calendar</h1>
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
