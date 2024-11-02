import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CloudProviderSelectProps {
  onValueChange: (value: string) => void
}

export function CloudProviderSelect({ onValueChange }: CloudProviderSelectProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="cloud-provider">Cloud Service Provider</Label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger id="cloud-provider">
          <SelectValue placeholder="Select a cloud provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
          <SelectItem value="azure">Microsoft Azure</SelectItem>
          <SelectItem value="gcp">Google Cloud Platform (GCP)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}