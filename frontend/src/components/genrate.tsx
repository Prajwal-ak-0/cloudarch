// frontend/src/pages/Generate.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { DiagramDisplay } from "@/components/diagram-display";
import { TextDisplay } from "@/components/text-display";
import { DotsLoader } from "./dot-loader";

function Generate() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as {
    image_urls: string[];
    architectural_description: string;
    diagram_code: string;
  };

  const [generatedDiagrams, setGeneratedDiagrams] = useState<string[]>(
    result?.image_urls || []
  );
  const [architecturalDescription, setArchitecturalDescription] = useState(
    result?.architectural_description || ""
  );
  const [diagramCode, setDiagramCode] = useState(
    result?.diagram_code || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center">
          {/* Loading Spinner */}
          <DotsLoader />
        </div>
      )}
      <Navbar />

      <div className="flex">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <DiagramDisplay diagrams={generatedDiagrams} isLoading={isLoading} />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <TextDisplay
            architecturalDescription={architecturalDescription}
            diagramCode={diagramCode}
            setGeneratedDiagrams={setGeneratedDiagrams}
            setDiagramCode={setDiagramCode}
            setArchitecturalDescription={setArchitecturalDescription}
          />
        </div>
      </div>
    </>
  );
}

export default Generate;