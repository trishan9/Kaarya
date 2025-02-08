import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ActivityLogSchema,
  type ActivityLogInput,
  type ActivityType,
} from "../_schemas/index";
import { Editor } from "@/components/Editor";
import { useCreateLogs } from "@/hooks/useLogs";
import { useProjectId } from "@/hooks/useProjectId";

const activityTypeMap: Record<ActivityType, string> = {
  SPRINT_PLANNING: "Planning",
  SPRINT_REVIEW: "Review",
  SPRINT_RETROSPECTIVE: "Retrospective",
  DAILY_SCRUM: "Daily Scrum",
  OTHERS: "Others",
};

interface CreateLogFormProps {
  onCancel: () => void;
}

export const CreateLogForm = ({ onCancel }: CreateLogFormProps) => {
  const projectId = useProjectId();
  const createLogMutation = useCreateLogs();

  const form = useForm<ActivityLogInput>({
    resolver: zodResolver(ActivityLogSchema),
    defaultValues: {
      type: undefined,
      content: "",
    },
  });

  const onSubmit = (data: ActivityLogInput) => {
    if (projectId) {
      createLogMutation.mutate(
        { projectId, data },
        {
          onSuccess: () => {
            form.reset();
            onCancel();
          },
        },
      );
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create new log</CardTitle>
      </CardHeader>

      <CardContent className="px-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Log Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select log type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(activityTypeMap).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Content</FormLabel>
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <Editor value={field.value} onChange={field.onChange} />
                )}
              />
              <FormMessage />
            </FormItem>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={createLogMutation.isPending}>
                {createLogMutation.isPending ? "Creating..." : "Create Log"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
