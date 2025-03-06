import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays } from 'date-fns'

export interface Task {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
  progress: number
  dependencies: string[]
}

interface GanttState {
  tasks: Task[]
  viewStartDate: Date
  daysToShow: number
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  setViewStartDate: (date: Date) => void
  setDaysToShow: (days: number) => void
  resetToDefaultTasks: () => void
}

const createDefaultTasks = (): Task[] => {
  const today = new Date()
  
  return [
    {
      id: "1",
      name: "Requirements Planning",
      startDate: today,
      endDate: addDays(today, 7),
      color: "bg-blue-500",
      progress: 0,
      dependencies: [],
    },
    {
      id: "2",
      name: "Design",
      startDate: addDays(today, 8),
      endDate: addDays(today, 14),
      color: "bg-green-500",
      progress: 0,
      dependencies: ["1"],
    },
    {
      id: "3",
      name: "Development",
      startDate: addDays(today, 15),
      endDate: addDays(today, 29),
      color: "bg-purple-500",
      progress: 0,
      dependencies: ["2"],
    },
    {
      id: "4",
      name: "Testing",
      startDate: addDays(today, 30),
      endDate: addDays(today, 37),
      color: "bg-amber-500",
      progress: 0,
      dependencies: ["3"],
    },
  ]
}

const dateReviver = (key: string, value: any) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
  if (typeof value === 'string' && datePattern.test(value)) {
    return new Date(value)
  }
  return value
}

export const useGanttStore = create<GanttState>()(
  persist(
    (set) => ({
      tasks: createDefaultTasks(),
      viewStartDate: new Date(),
      daysToShow: 30,
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now().toString() }]
      })),
      
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, ...updatedTask } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),
      
      setViewStartDate: (date) => set({ viewStartDate: date }),
      
      setDaysToShow: (days) => set({ daysToShow: days }),
      
      resetToDefaultTasks: () => set({ tasks: createDefaultTasks() })
    }),
    {
      name: 'gantt-chart-storage',
      serialize: (state : any) => JSON.stringify(state),
      deserialize: (str :  string) => JSON.parse(str, dateReviver),
    }
  )
)
