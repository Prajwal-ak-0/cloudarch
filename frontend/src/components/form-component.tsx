// frontend/src/components/form-component.tsx

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Set the workerSrc property
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface FormComponentProps {
  cloudProvider: string;
  setCloudProvider: (value: string) => void;
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  onSubmit: (event: React.FormEvent, pdfContent: string | null) => void;
}

export const FormComponent: React.FC<FormComponentProps> = ({
  cloudProvider,
  setCloudProvider,
  projectDescription,
  setProjectDescription,
  onSubmit,
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPdfFile(file);

    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF document.");
        setPdfFile(null);
        return;
      }

      try {
        const text = await readPdfFile(file);
        setPdfContent(text);
        // Clear any existing project description
        setProjectDescription("");
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Failed to read PDF document.");
        setPdfFile(null);
        setPdfContent(null);
      }
    } else {
      setPdfContent(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDescription(e.target.value);
    if (e.target.value.length > 0) {
      // Clear PDF-related states
      setPdfFile(null);
      setPdfContent(null);
    }
  };

  return (
    <form onSubmit={(event) => onSubmit(event, pdfContent)} className="space-y-4">
      <div>
        <Label htmlFor="cloud-provider">Cloud Provider</Label>
        <Select value={cloudProvider} onValueChange={setCloudProvider}>
          <SelectTrigger id="cloud-provider">
            <SelectValue placeholder="Select a cloud provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">AWS</SelectItem>
            <SelectItem value="azure">Azure</SelectItem>
            <SelectItem value="gcp">GCP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Option 1: Project Description TextArea */}
      <div>
        <Label htmlFor="project-description">Project Description</Label>
        <Textarea
          id="project-description"
          value={projectDescription}
          onChange={handleDescriptionChange}
          placeholder="Describe your project architecture here..."
          className="h-32"
        />
      </div>

      {/* Horizontal Separator with "OR" */}
      <div className="flex items-center my-2">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Option 2: PDF Upload */}
      <div>
        <Label htmlFor="project-pdf">Upload Project Description (PDF)</Label>
        <input
          id="project-pdf"
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="mt-2"
        />
        {pdfFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {pdfFile.name}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          !cloudProvider || (!projectDescription && !pdfContent) || (pdfFile && !pdfContent)
        }
      >
        Generate Diagram
      </Button>
    </form>
  );
};

// Function to read PDF content
async function readPdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const strings = content.items.map((item: any) => item.str);
    text += strings.join(" ") + " ";
  }

  return text;
}