import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProjectDescriptionProps {
  value: string
  onChange: (value: string) => void
}

export function ProjectDescription({ value, onChange }: ProjectDescriptionProps) {
  return (
    <div className="space-y-6">
      <Label htmlFor="project-description">Project Description</Label>
      <Textarea
        id="project-description"
        placeholder="Describe your project architecture here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-32 md:h-40"
      />
    </div>
  )
}