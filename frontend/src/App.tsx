import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Cloud, FileText, Home, Menu, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function App() {
  const [cloudProvider, setCloudProvider] = useState<string>('')
  const [projectDescription, setProjectDescription] = useState<string>('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [generatedDiagram, setGeneratedDiagram] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('cloud_provider', cloudProvider)
    formData.append('type', pdfFile ? 'PDF' : 'TEXT')
    formData.append('content', pdfFile ? pdfFile : projectDescription)

    try {
      const response = await fetch('http://localhost:8000/generate-diagram', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedDiagram(result.imageUrl)
        toast({
          title: "Success",
          description: "Diagram generated successfully",
          duration: 3000,
        })
      } else {
        throw new Error('Failed to generate diagram')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to generate diagram. Please try again.",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setCurrentStep(0)
    }
  }

  const steps = [
    { title: "Select Cloud Provider", icon: <Cloud className="w-4 h-4" /> },
    { title: "Upload or Describe", icon: <FileText className="w-4 h-4" /> },
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
    if (currentStep === 1 && !pdfFile && !projectDescription) {
      toast({
        title: "Error",
        description: "Please upload a PDF or provide a project description",
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
    if (cloudProvider && (pdfFile || projectDescription)) {
      setCurrentStep(2)
    }
  }, [cloudProvider, pdfFile, projectDescription])

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-background text-foreground min-h-screen">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
              <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white dark:bg-gray-800">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-xl font-bold">Cloud Architect</h1>
                  </div>
                  <nav className="mt-5 flex-1 px-2 bg-white dark:bg-gray-800 space-y-1">
                    <a href="#" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
                      <Home className="mr-3 h-6 w-6" />
                      Dashboard
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col w-full flex-1 overflow-hidden">
            <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
              <Button variant="ghost" className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Cloud Architecture Diagram Generator</h1>
                    <Button variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
                      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </div>
                  
                  {/* Multi-step form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Generate Your Cloud Architecture Diagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          {steps.map((step, index) => (
                            <div key={index} className={`flex items-center ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}>
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
                              <Label htmlFor="pdf-upload">Upload PDF (Optional)</Label>
                              <Input 
                                id="pdf-upload" 
                                type="file" 
                                accept=".pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                              />
                            </div>
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
                          <Alert>
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

                  {/* Generated Diagram */}
                  {generatedDiagram && (
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold mb-4">Generated Cloud Architecture Diagram</h2>
                      <Card>
                        <CardContent className="p-4">
                          <img 
                            src={generatedDiagram} 
                            alt="Generated Cloud Architecture Diagram" 
                            className="rounded-lg shadow-md w-full h-auto"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}