import type React from "react"
import { useRef, useState } from "react"
import { format, addDays, differenceInDays, isWithinInterval, startOfDay } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2, RotateCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify";
import { ExportMenu } from "../ExportMenu"
import { type Task, useGanttStore } from "@/state-stores/gantt-store"

export default function GanttChart() {
  const {
    tasks,
    viewStartDate,
    daysToShow,
    addTask,
    updateTask,
    deleteTask,
    setViewStartDate,
    setDaysToShow,
    resetToDefaultTasks,
  } = useGanttStore()

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const colorOptions = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-amber-500", label: "Amber" },
    { value: "bg-red-500", label: "Red" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-teal-500", label: "Teal" },
  ]

  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(new Date(viewStartDate), i))

  const navigateBackward = () => setViewStartDate(addDays(new Date(viewStartDate), -7))
  const navigateForward = () => setViewStartDate(addDays(new Date(viewStartDate), 7))

  const handleAddOrEditTask = (task: Task) => {
    if (task.id) {
      updateTask(task.id, task)
      toast.success("Task Updated")
    } else {
      const { id, ...newTask } = task
      addTask(newTask)
      toast.success("Task Added")
    }
    setTaskDialogOpen(false)
    setCurrentTask(null)
  }

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    deleteTask(id)
    if (taskToDelete) {
      toast.success("Task Deleted")
    }
  }

  const handleResetTasks = () => {
    resetToDefaultTasks()
    toast.success("Chart Reset")
  }

  const getTaskStyle = (task: Task) => {
    const startDiff = differenceInDays(new Date(task.startDate), new Date(viewStartDate))
    const taskDuration = differenceInDays(new Date(task.endDate), new Date(task.startDate)) + 1

    const left = Math.max(0, startDiff) * (100 / daysToShow)
    const width = Math.min(taskDuration, daysToShow - Math.max(0, startDiff)) * (100 / daysToShow)

    return {
      left: `${left}%`,
      width: `${width}%`,
    }
  }

  const isTaskVisible = (task: Task) => {
    const viewEndDate = addDays(new Date(viewStartDate), daysToShow - 1)
    return (
      isWithinInterval(new Date(task.startDate), { start: new Date(viewStartDate), end: viewEndDate }) ||
      isWithinInterval(new Date(task.endDate), { start: new Date(viewStartDate), end: viewEndDate }) ||
      (new Date(task.startDate) < new Date(viewStartDate) && new Date(task.endDate) > viewEndDate)
    )
  }

  const openTaskDialog = (task: Task | null) => {
    setCurrentTask(
      task ||
        ({
          id: "",
          name: "",
          startDate: new Date(),
          endDate: addDays(new Date(), 7),
          color: "bg-blue-500",
          progress: 0,
          dependencies: [],
        } as Task),
    )
    setTaskDialogOpen(true)
  }

  return (
    <Card className="w-full mt-2 mb-2">
      <CardHeader className="flex flex-col gap-4">
        <div>
          <CardTitle>Gantt Chart</CardTitle>
          <CardDescription className="mt-1">Organize and Track Your Milestones Effortlessly</CardDescription>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={navigateBackward}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-initial">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(viewStartDate), "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={new Date(viewStartDate)}
                  onSelect={(date) => date && setViewStartDate(startOfDay(date))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={navigateForward}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Select 
            value={daysToShow.toString()} 
            onValueChange={(value) => setDaysToShow(Number.parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Days to show" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleResetTasks} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <ExportMenu tasks={tasks} chartElementId="gantt-chart-container" />

          <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openTaskDialog(null)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{currentTask?.id ? "Edit Task" : "Add New Task"}</DialogTitle>
              </DialogHeader>
              {currentTask && (
                <TaskForm task={currentTask} tasks={tasks} colorOptions={colorOptions} onSubmit={handleAddOrEditTask} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]" id="gantt-chart-container" ref={chartRef}>
            <div className="flex border-b">
              <div className="w-1/4 min-w-[200px] p-2 font-medium">Task</div>

              <div className="w-3/4 flex">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-1 text-center text-xs p-1 ${
                      date.getDay() === 0 || date.getDay() === 6 ? "bg-gray-100" : ""
                    }`}
                  >
                    <div>{format(date, "d MMM")}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {tasks.map((task) => (
                <div key={task.id} className="flex border-b hover:bg-gray-50">
                  <div className="w-1/4 min-w-[200px] p-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{task.name}</div>

                      <div className="text-xs text-gray-500">
                        {format(new Date(task.startDate), "MMM d")} - {format(new Date(task.endDate), "MMM d")}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openTaskDialog(task)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="w-3/4 relative">
                    {isTaskVisible(task) && (
                      <div
                        className={`absolute top-1 bottom-1 rounded ${task.color} flex items-center`}
                        style={getTaskStyle(task)}
                      >
                        <div className="h-full bg-white bg-opacity-30" style={{ width: `${task.progress}%` }}></div>
                        <span className="text-xs text-white font-medium px-2 truncate">
                          {task.name} ({task.progress}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskForm({
  task,
  tasks,
  colorOptions,
  onSubmit,
}: {
  task: Task
  tasks: Task[]
  colorOptions: { value: string; label: string }[]
  onSubmit: (task: Task) => void
}) {
  const [formData, setFormData] = useState<Task>({
    ...task,
    startDate: new Date(task.startDate),
    endDate: new Date(task.endDate),
  })

  const handleChange = (field: keyof Task, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Task Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                <Calendar className="mr-2 h-4 w-4" />
                {format(formData.startDate, "PPP")}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && handleChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                <Calendar className="mr-2 h-4 w-4" />
                {format(formData.endDate, "PPP")}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && handleChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>

          <Select value={formData.color} onValueChange={(value) => handleChange("color", value)}>
            <SelectTrigger id="color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>

            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${option.value}`}></div>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => handleChange("progress", Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dependencies">Dependencies</Label>
        
        <Select
          value={formData.dependencies.join(",")}
          onValueChange={(value) => handleChange("dependencies", value ? value.split(",") : [])}
        >
          <SelectTrigger id="dependencies">
            <SelectValue placeholder="Select dependencies" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {tasks
              .filter((t) => t.id !== formData.id)
              .map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">{task.id ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  )
}
