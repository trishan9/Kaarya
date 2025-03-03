import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { format } from "date-fns"
import type { Task } from "@/state-stores/gantt-store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const snakeCaseToTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const exportAsPNG = async (elementId: string, filename: string = 'gantt-chart') => {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error exporting as PNG:', error)
  }
}

export const exportAsPDF = async (elementId: string, filename = "gantt-chart") => {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    })

    const imgWidth = 280
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error("Error exporting as PDF:", error)
  }
}

export const exportAsCSV = (tasks: Task[], filename = "gantt-chart") => {

  let csvContent = "Task Name,Start Date,End Date,Progress,Dependencies\n"

  tasks.forEach((task) => {
    const startDate = format(new Date(task.startDate), "yyyy-MM-dd")
    const endDate = format(new Date(task.endDate), "yyyy-MM-dd")
    const dependencies = task.dependencies.join(";")

    csvContent += `"${task.name}",${startDate},${endDate},${task.progress}%,"${dependencies}"\n`
  })

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.click()
  URL.revokeObjectURL(url)
}

export const exportAsJSON = (tasks: Task[], filename = "gantt-chart") => {
  const jsonData = JSON.stringify(tasks, null, 2)
  const blob = new Blob([jsonData], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.click()
  URL.revokeObjectURL(url)
}