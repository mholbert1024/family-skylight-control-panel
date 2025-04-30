
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme} 
      />
      <Moon className="h-4 w-4 text-blue-700 dark:text-blue-300" />
    </div>
  );
};

export default ThemeToggle;
