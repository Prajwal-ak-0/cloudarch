// frontend/src/components/diagram-display.tsx

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DiagramDisplayProps {
  diagrams: string[]
}

export function DiagramDisplay({ diagrams }: DiagramDisplayProps) {
  const [scale, setScale] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  if (diagrams.length === 0) return null

  const handleDownload = async (url: string, format: 'PNG' | 'JPG' | 'SVG') => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const extension = format.toLowerCase()
      
      // Convert to desired format if needed
      const imageBlob = extension === 'jpg' ? 
        new Blob([blob], { type: 'image/jpeg' }) : blob

      const downloadUrl = window.URL.createObjectURL(imageBlob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `architecture-diagram.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prevScale => {
      const newScale = direction === 'in' ? prevScale + 0.1 : prevScale - 0.1
      return Math.min(Math.max(newScale, 0.3), 3) // Limit scale between 0.3 and 3
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Cloud Architecture Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {diagrams.map((imgUrl, index) => (
            <div key={index} className="relative group">
              <div className="absolute flex items-center top-2 right-2 opacity-100 group-hover:opacity-50 transition-opacity z-10 space-x-2">
                <TooltipProvider>
                  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button variant="secondary" size="icon">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View in fullscreen</p>
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialogContent className="max-w-[90vw] max-h-[90vh] w-fit h-fit p-0">
                      <div className="relative">
                        <div className="sticky top-0 right-0 p-2 flex justify-between items-center gap-2 bg-background/80 backdrop-blur-sm">
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handleZoom('in')}
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Zoom in</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => handleZoom('out')}
                                  >
                                    <ZoomOut className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Zoom out</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Select onValueChange={(value) => handleDownload(imgUrl, value as 'PNG' | 'JPG' | 'SVG')}>
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Export" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PNG">PNG</SelectItem>
                                      <SelectItem value="JPG">JPG</SelectItem>
                                      <SelectItem value="SVG">SVG</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Export diagram</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogCancel asChild>
                                  <Button variant="outline" size="icon">
                                    <Minimize2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogCancel>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Exit fullscreen</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="overflow-auto flex items-center justify-center">
                          <img 
                            src={imgUrl} 
                            alt={`Generated Diagram ${index + 1}`} 
                            style={{
                              transform: `scale(${scale})`,
                              transition: 'transform 0.2s ease-in-out'
                            }}
                            className="max-w-none"
                          />
                        </div>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select onValueChange={(value) => handleDownload(imgUrl, value as 'PNG' | 'JPG' | 'SVG')}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Export" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PNG">PNG</SelectItem>
                          <SelectItem value="JPG">JPG</SelectItem>
                          <SelectItem value="SVG">SVG</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export diagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800">
                <div className="relative canvas-container">
                  <img 
                    src={imgUrl} 
                    alt={`Generated Diagram ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}