// src/components/text-display.tsx

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, FileText } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface TextDisplayProps {
  architecturalDescription: string
  diagramCode: string
}

export function TextDisplay({ architecturalDescription, diagramCode }: TextDisplayProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {showCode ? 'Generated Diagram Code' : 'Architectural Description'}
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <FileText className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showCode ? 'Show Description' : 'Show Code'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="relative canvas-container overflow-auto h-[calc(100vh-20rem)] rounded-lg p-4 bg-muted/30">
          <pre 
            className={cn(
              "text-sm font-mono break-words",
              showCode ? "whitespace-pre" : "whitespace-pre-wrap"
            )}
            style={{
              maxWidth: '100%',
              overflowX: showCode ? 'auto' : 'visible',
              paddingRight: showCode ? '7rem' : '0'
            }}
          >
            {showCode ? diagramCode.trim() : architecturalDescription}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}