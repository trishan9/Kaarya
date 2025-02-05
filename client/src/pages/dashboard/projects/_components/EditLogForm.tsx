import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActivityLogSchema, ActivityLogType, type ActivityType } from "../_schemas"
import { Editor } from "@/components/Editor"
import { useUpdateLogs } from "@/hooks/useLogs"
import { DottedSeparator } from "@/components/ui/dotted-separator"

const activityTypeMap: Record<ActivityType, string> = {
  SPRINT_PLANNING: "Planning",
  SPRINT_REVIEW: "Review",
  SPRINT_RETROSPECTIVE: "Retrospective",
  DAILY_SCRUM: "Daily Scrum",
  OTHERS: "Others",
}

interface EditLogFormProps {
  onCancel: () => void
  logData: ActivityLogType
}

export const EditLogForm = ({ onCancel, logData } : EditLogFormProps) => {
  const updateLogMutation = useUpdateLogs()

  const form = useForm<ActivityLogType>({
    resolver: zodResolver(ActivityLogSchema),
    defaultValues: {
      type: logData.type,
      content: logData.content,
    },
  })

  const onSubmit = (data: ActivityLogType) => {
    updateLogMutation.mutate(
      { logsId: logData.id, data },
      {
        onSuccess: () => {
          form.reset()
          onCancel()
        },
      },
    )
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit log</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
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
                        <SelectItem key={value} value={value as ActivityType}>
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
                render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
              />
              <FormMessage />
            </FormItem>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button type="button" size="lg" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={updateLogMutation.isPending}>
                {updateLogMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}