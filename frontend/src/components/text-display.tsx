import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface TextDisplayProps {
  architecturalDescription: string;
  diagramCode: string;
  setGeneratedDiagrams: (diagrams: string[]) => void;
  setDiagramCode: (code: string) => void; // Include the setter in props
  setArchitecturalDescription: (description: string) => void;
}

export function TextDisplay({
  architecturalDescription,
  diagramCode,
  setGeneratedDiagrams,
  setDiagramCode,
  setArchitecturalDescription,
}: TextDisplayProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedCode, setEditedCode] = useState(diagramCode);
  const [isGenerating, setIsGenerating] = useState(false);

  // Keep editedCode in sync with diagramCode
  useEffect(() => {
    setEditedCode(diagramCode);
  }, [diagramCode]);

  const handleGenerateDiagram = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/diagrams/execute-code",
        {
          diagram_code: editedCode,
          architectural_description: architecturalDescription,
        }
      );
      const { diagram_code, architectural_description, image_urls } = response.data;

      setGeneratedDiagrams(image_urls);
      setDiagramCode(diagram_code);
      setArchitecturalDescription(architectural_description);

      toast({
        title: "Success",
        description: "Diagram generated successfully",
        duration: 3000,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate diagram. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {activeTab === "code" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="ml-2"
            >
              Edit
            </Button>
          )}
        </div>
        <TabsContent value="description">
          <pre className="whitespace-pre-wrap p-4 bg-gray-100 rounded">
            {architecturalDescription}
          </pre>
        </TabsContent>
        <TabsContent value="code">
          <pre className="whitespace-pre-wrap p-4 bg-gray-100 rounded">
            {diagramCode}
          </pre>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Diagram Code</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            rows={20}
            className="mt-4"
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleGenerateDiagram}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Diagram"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}