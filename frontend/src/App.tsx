"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./components/header";
import { StepProgress } from "./components/step-progress";
import { CloudProviderSelect } from "./components/cloud-provider-select";
import { ProjectDescription } from "./components/project-description";
import { TextDisplay } from "./components/text-display";
import { DiagramDisplay } from "./components/diagram-display";

export default function App() {
  const [cloudProvider, setCloudProvider] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [generatedDiagrams, setGeneratedDiagrams] = useState<string[]>([]);
  const [architecturalDescription, setArchitecturalDescription] =
    useState<string>("");
  const [diagramCode, setDiagramCode] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("cloud_provider", cloudProvider);
    formData.append("project_description", projectDescription);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/diagrams/generate",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setGeneratedDiagrams(result.image_urls);
        setArchitecturalDescription(result.architectural_description);
        setDiagramCode(result.diagram_code);
        toast({
          title: "Success",
          description: "Diagram generated successfully",
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate diagram");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to generate diagram. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 0 && !cloudProvider) {
      toast({
        title: "Error",
        description: "Please select a cloud provider",
        duration: 3000,
        variant: "destructive",
      });
      return false;
    }
    if (currentStep === 1 && !projectDescription) {
      toast({
        title: "Error",
        description: "Please provide a project description",
        duration: 3000,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> */}

        <main className="flex-1 flex p-6 w-full overflow-auto">
          <div className="w-1/2 mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Generate Your Cloud Architecture Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <StepProgress currentStep={currentStep} />

                <form onSubmit={handleSubmit}>
                  {currentStep === 0 && (
                    <CloudProviderSelect onValueChange={setCloudProvider} />
                  )}

                  {currentStep === 1 && (
                    <ProjectDescription
                      value={projectDescription}
                      onChange={setProjectDescription}
                    />
                  )}

                  {currentStep === 2 && (
                    <Alert variant="default">
                      <AlertTitle>Ready to generate</AlertTitle>
                      <AlertDescription>
                        Review your inputs and click the button below to
                        generate your cloud architecture diagram.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-6 flex justify-between">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < 2 ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Generating..." : "Generate Diagram"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <DiagramDisplay diagrams={generatedDiagrams} />
          </div>

          <div className="w-1/2 pl-4">
            <TextDisplay
              architecturalDescription={architecturalDescription}
              diagramCode={diagramCode}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
