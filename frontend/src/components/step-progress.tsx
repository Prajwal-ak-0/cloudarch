import { Progress } from "@/components/ui/progress"

interface StepProgressProps {
  currentStep: number
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="mb-6">
      <Progress value={(currentStep + 1) * 33.33} className="w-full" />
    </div>
  )
}