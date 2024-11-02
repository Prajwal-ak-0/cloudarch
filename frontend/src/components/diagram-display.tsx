
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DiagramDisplayProps {
  diagrams: string[];
}

export function DiagramDisplay({ diagrams }: DiagramDisplayProps) {

  if (diagrams.length === 0) return null;

  const handleDownload = async (url: string, format: "PNG" | "JPG" | "SVG") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const extension = format.toLowerCase();

      // Convert to desired format if needed
      const imageBlob =
        extension === "jpg" ? new Blob([blob], { type: "image/jpeg" }) : blob;

      const downloadUrl = window.URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `architecture-diagram.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        onValueChange={(value) =>
                          handleDownload(imgUrl, value as "PNG" | "JPG" | "SVG")
                        }
                      >
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
  );
}
