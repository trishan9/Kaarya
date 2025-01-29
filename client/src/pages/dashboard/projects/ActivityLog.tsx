import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MemberAvatar } from "../workspaces/_components/MemberAvatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePicker } from "@/components/DatePicker"

type ActivityType = "Planning" | "Review" | "Retrospective"

interface ActivityLog {
  id: number
  type: ActivityType
  content: string
  timestamp: string
  userName: string
}

const randomNames = ["Nischay", "Trishan", "Sushant"]

export default function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [activityType, setActivityType] = useState<ActivityType>("Planning")
  const [content, setContent] = useState("")
  const [filterUser, setFilterUser] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<ActivityType | "all" | null>(null)
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  const addLog = () => {
    if (content.trim()) {
      const newLog: ActivityLog = {
        id: Date.now(),
        type: activityType,
        content: content.trim(),
        timestamp: new Date().toLocaleString(),
        userName: randomNames[Math.floor(Math.random() * randomNames.length)],
      }
      setLogs((prevLogs) => [...prevLogs, newLog])
      setContent("")
    }
  }

  const filteredLogs = logs.filter((log) => {
    const userMatch = filterUser === "all" || !filterUser || log.userName === filterUser
    const typeMatch = filterType === "all" || !filterType || log.type === filterType
    const dateMatch = !filterDate || new Date(log.timestamp).toDateString() === filterDate.toDateString()
    return userMatch && typeMatch && dateMatch
  })

  return (
    <div className="flex">
      <Card className="w-full pt-4">
        <div className="px-6 mb-4 flex flex-col gap-1 sm:gap-0 sm:px-6 md:mb-4 sm:flex sm:flex-row sm:space-x-2">
          <Select value={filterUser || "all"} onValueChange={(value) => setFilterUser(value)} >
            <SelectTrigger className="w-full sm:w-[180px] py-[21px]">
              <SelectValue placeholder="Filter by User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {randomNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType || "all"} onValueChange={(value: ActivityType | "all") => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-[180px] py-[21px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Retrospective">Retrospective</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker
            value={filterDate}
            onChange={(date: Date) => setFilterDate(date)}
            placeholder="Filter by Date"
            className="w-full sm:w-[180px]"
          />
        </div>
        <ScrollArea className="h-[45vh] sm:h-[65vh] rounded-lg w-full">
          <CardContent>
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-white p-3 rounded-lg border flex flex-col mb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:items-center justify-between flex-wrap mb-2">
                  <div className="flex items-center gap-2">
                    <MemberAvatar name={log.userName} className="w-7 h-7" />
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.userName}</span>
                      <span className="text-sm text-gray-500">{log.timestamp}</span>
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 text-sm font-medium text-black bg-neutral-50 border rounded-full">
                      {log.type}
                    </span>
                  </div>
                </div>
                <p className="px-1 pt-2 whitespace-normal break-all overflow-wrap-anywhere">{log.content}</p>
              </div>
            ))}
          </CardContent>
        </ScrollArea>

        <CardFooter className="mt-2 border-t pt-4">
          <div className="flex flex-col gap-1 w-full sm:flex sm:flex-row sm:w-full sm:space-x-2">
            <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Retrospective">Retrospective</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your activity log..."
              className="flex-grow"
            />
            <Button onClick={addLog} className="mt-2 sm:mt-0">Add Log</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

