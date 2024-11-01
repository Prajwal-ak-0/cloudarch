// frontend/src/App.tsx

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Cloud, Home, Menu, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function App() {
  const [cloudProvider, setCloudProvider] = useState<string>('')
  const [projectDescription, setProjectDescription] = useState<string>('')
  const [generatedDiagrams, setGeneratedDiagrams] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('cloud_provider', cloudProvider)
    formData.append('project_description', projectDescription)

    try {
      const response = await fetch('http://localhost:8000/api/v1/diagrams/generate', {
        method: 'POST',
        body: formData,
      })

      console.log('Form Data:', Array.from(formData.entries()))

      if (response.ok) {
        const result = await response.json()
        setGeneratedDiagrams(result.image_urls)
        toast({
          title: "Success",
          description: "Diagram generated successfully",
          duration: 3000,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate diagram')
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate diagram. Please try again.",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Optionally keep the current step after submission
      // setCurrentStep(0)
    }
  }

  const steps = [
    { title: "Select Cloud Provider", icon: <Cloud className="w-4 h-4" /> },
    { title: "Describe Project", icon: <Home className="w-4 h-4" /> },
    { title: "Generate Diagram", icon: <CheckCircle2 className="w-4 h-4" /> },
  ]

  const validateStep = () => {
    if (currentStep === 0 && !cloudProvider) {
      toast({
        title: "Error",
        description: "Please select a cloud provider",
        duration: 3000,
        variant: "destructive",
      })
      return false
    }
    if (currentStep === 1 && !projectDescription) {
      toast({
        title: "Error",
        description: "Please provide a project description",
        duration: 3000,
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    if (cloudProvider && projectDescription) {
      setCurrentStep(2)
    }
  }, [cloudProvider, projectDescription])

  return (
    <div className={`flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800">
          <div className="flex items-center h-16 px-4 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cloud Architect</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
              <Home className="mr-3 h-6 w-6" />
              Dashboard
            </a>
            {/* Add more navigation items here */}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Button variant="ghost" className="md:hidden" onClick={() => { /* Implement sidebar toggle for mobile */ }}>
            <Menu className="h-6 w-6" />
          </Button>
          <Button variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="flex-1 flex p-4">
          {/* Form Section */}
          <div className="w-1/2 pr-2 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Cloud Architecture Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center w-full">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200'}`}>
                        {step.icon}
                      </div>
                      <span className="ml-2 text-sm font-medium">{step.title}</span>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-px mx-4 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit}>
                  {currentStep === 0 && (
                    <div>
                      <Label htmlFor="cloud-provider">Cloud Service Provider</Label>
                      <Select onValueChange={(value) => setCloudProvider(value)}>
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
                  )}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project-description">Project Description</Label>
                        <Textarea
                          id="project-description"
                          placeholder="Describe your project here..."
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          className="h-32"
                        />
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <Alert variant="default">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Ready to generate</AlertTitle>
                      <AlertDescription>
                        Click the button below to generate your cloud architecture diagram.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="mt-6 flex justify-between">
                    {currentStep > 0 && (
                      <Button type="button" onClick={prevStep} variant="outline">
                        Previous
                      </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Diagram'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Image Display Section */}
          <div className="w-1/2 pl-2 overflow-auto">
            {generatedDiagrams.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Generated Cloud Architecture Diagram</h2>
                {generatedDiagrams.map((imgUrl, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent>
                      <img 
                        src={imgUrl} 
                        alt={`Generated Diagram ${index + 1}`} 
                        className="rounded-lg shadow-md w-full h-auto"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}