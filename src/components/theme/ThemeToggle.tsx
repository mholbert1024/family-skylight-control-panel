
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Switch 
          checked={isDark} 
          onCheckedChange={toggleTheme} 
        />
        {isDark ? (
          <Moon className="absolute right-0.5 top-0.5 h-5 w-5 text-blue-300 pointer-events-none" />
        ) : (
          <Sun className="absolute left-0.5 top-0.5 h-5 w-5 text-yellow-500 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
