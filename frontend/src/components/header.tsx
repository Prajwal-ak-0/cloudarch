import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

export function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <Button className="md:hidden">
        <Menu className="h-6 w-6" />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  )
}