import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  Maximize2, Minimize2 } from "lucide-react";
import { Loader2 } from "lucide-react";

interface DiagramDisplayProps {
  diagrams: string[];
  isLoading: boolean;
}

export function DiagramDisplay({ diagrams, isLoading }: DiagramDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<"PNG" | "JPG" | "SVG">("PNG");
  const [isMaximized, setIsMaximized] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  useEffect(() => {
    if (!isMaximized) return;
    const interval = setInterval(() => {
      setFullscreenIndex((prevIndex) => (prevIndex + 1) % diagrams.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMaximized, diagrams.length]);

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? diagrams.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % diagrams.length);
  };

  const handleExportAll = async () => {
    for (const imgUrl of diagrams) {
      try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const extension = selectedFormat.toLowerCase();
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
    }
  };

  const handleMaximize = (index: number) => {
    setFullscreenIndex(index);
    setIsMaximized(true);
  };

  const handleMinimize = () => {
    setIsMaximized(false);
  };

  if (diagrams.length === 0) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full opacity-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Cloud Architecture Diagrams</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as "PNG" | "JPG" | "SVG")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PNG">PNG</SelectItem>
                <SelectItem value="JPG">JPG</SelectItem>
                <SelectItem value="SVG">SVG</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportAll}>Export All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <img
              src={diagrams[currentIndex]}
              alt={`Generated Diagram ${currentIndex + 1}`}
              className="w-full h-auto rounded-lg"
            />
            <Button
              onClick={prevImage}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white"
            >
              &#8592;
            </Button>
            <Button
              onClick={nextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white"
            >
              &#8594;
            </Button>
            <Button
              onClick={() => handleMaximize(currentIndex)}
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 text-white"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          {diagrams.length > 1 && (
            <div className="flex justify-center mt-2 space-x-2">
              {diagrams.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isMaximized && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={diagrams[fullscreenIndex]}
              alt={`Fullscreen Diagram ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full rounded-lg"
            />
            <Button
              onClick={handleMinimize}
              className="absolute top-4 right-4 bg-gray-700 bg-opacity-50 text-white"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setFullscreenIndex((prev) => (prev === 0 ? diagrams.length - 1 : prev - 1))}
              className="absolute left-4 bg-gray-700 bg-opacity-50 text-white"
            >
              &#8592;
            </Button>
            <Button
              onClick={() => setFullscreenIndex((prev) => (prev + 1) % diagrams.length)}
              className="absolute right-4 bg-gray-700 bg-opacity-50 text-white"
            >
              &#8594;
            </Button>
            <div className="absolute bottom-4 flex space-x-2">
              {diagrams.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === fullscreenIndex ? "bg-blue-500" : "bg-gray-300"
                  } cursor-pointer`}
                  onClick={() => setFullscreenIndex(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}