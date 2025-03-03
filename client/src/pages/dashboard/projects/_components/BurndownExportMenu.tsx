import { useState } from "react"
import { Download, FileDown, FileImage, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { exportAsPNG, exportAsPDF } from "@/lib/utils"

interface SprintData {
  sprintNumber: string
  days: number
  estimatedHours: number[]
  actualHours: number[]
}

interface ExportMenuProps {
  sprintData: SprintData
  chartElementId: string
}

export default function BurndownExportMenu({ sprintData, chartElementId }: ExportMenuProps) {
  const [filenameDialogOpen, setFilenameDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<"png" | "pdf" | "csv" | "json">("png")
  const [filename, setFilename] = useState(`sprint-${sprintData.sprintNumber}-burndown`)

  const handleExport = () => {
    setFilenameDialogOpen(true)
  }

  const executeExport = () => {
    switch (exportType) {
      case "png":
        exportAsPNG(chartElementId, filename)
        break
      case "pdf":
        exportAsPDF(chartElementId, filename)
        break
    }
    setFilenameDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setExportType("png")
              handleExport()
            }}
          >
            <FileImage className="h-4 w-4 mr-2" />
            Export as PNG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setExportType("pdf")
              handleExport()
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={filenameDialogOpen} onOpenChange={setFilenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Burndown Chart</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                Filename
              </Label>
              
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={executeExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export as {exportType.toUpperCase()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

