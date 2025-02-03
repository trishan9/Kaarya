import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Task } from "../_schemas";
import { useUpdateTask } from "@/hooks/useTasks";
import { Editor } from "./Editor";
import { Preview } from "./Preview";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        taskId: task.id,
        data: { description: value },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>

        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
          variant="outline"
        >
          {isEditing ? (
            <X className="size-4 mr-2" />
          ) : (
            <Pencil className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Editor
            value={
              value ||
              "<div><p>As a <strong>user</strong>, I want to <strong>perform some task</strong>, so that I can <strong>achieve something</strong> </p> <br/> <p><strong>Acceptance criteria</strong></p> <ul><li>Criteria 1</li> <li>Criteria 2</li> <li>Criteria 3</li></ul></div>"
            }
            onChange={setValue}
          />

          <Button
            size="sm"
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description ? (
            <Preview value={task.description} />
          ) : (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};

