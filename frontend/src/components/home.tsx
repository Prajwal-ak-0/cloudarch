// frontend/src/pages/Home.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormComponent } from "@/components/form-component";
import { DotsLoader } from "@/components/dot-loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cloudProvider, setCloudProvider] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Open the dialog if navigated with openDialog state
  useEffect(() => {
    if (location.state?.openDialog) {
      setIsDialogOpen(true);
      // Reset the state to prevent the dialog from opening again on back navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleGenerateClick = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    pdfContent: string | null
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDialogOpen(false);

    const formData = new FormData();
    formData.append("cloud_provider", cloudProvider);

    // Use pdfContent if available; otherwise, use projectDescription
    const description = pdfContent || projectDescription;
    formData.append("project_description", description);

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
        navigate("/generate", { state: result });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate diagram");
      }
    } catch (error: any) {
      console.error("Error:", error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar onGenerateClick={handleGenerateClick} />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <DotsLoader />
        </div>
      )}
      <div
        className={`${
          isDialogOpen ? "blur-background" : ""
        } flex-1 flex flex-col items-center justify-center h-screen`}
      >
        <div className="flex space-x-4">
          <Card
            className="w-80 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => navigate("/case-studies")}
          >
            <CardHeader>
              <CardTitle>Cloud Case Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Small explanation regarding or introduction related to how
                companies are using cloud services.
              </CardDescription>
            </CardContent>
          </Card>
          <Card
            className="w-80 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => navigate("/services")}
          >
            <CardHeader>
              <CardTitle>Cloud Services</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Small explanation regarding cloud services.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <FormComponent
            cloudProvider={cloudProvider}
            setCloudProvider={setCloudProvider}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Home;