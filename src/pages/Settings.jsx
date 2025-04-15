
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun, MonitorSmartphone, Eye, Gauge, Contrast } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { 
    theme, 
    setTheme, 
    isHighContrastMode,
    toggleHighContrastMode,
    isReducedMotion,
    toggleReducedMotion
  } = useTheme();

  const [fontSize, setFontSize] = useState("medium");

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    document.documentElement.style.fontSize = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'x-large': '20px',
    }[value] || '16px';
    
    toast.success(`Font size changed to ${value}`);
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    toast.success("Local storage cleared successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure application appearance and behavior
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="w-full rounded-md"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="w-full rounded-md"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="w-full rounded-md"
                    onClick={() => setTheme("system")}
                  >
                    <MonitorSmartphone className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">
                    Increase contrast for better readability
                  </p>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="high-contrast"
                    checked={isHighContrastMode}
                    onCheckedChange={toggleHighContrastMode}
                  />
                  <Contrast className="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">
                    Minimize animations throughout the interface
                  </p>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="reduced-motion"
                    checked={isReducedMotion}
                    onCheckedChange={toggleReducedMotion}
                  />
                  <Gauge className="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger id="font-size" className="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium (Default)</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="x-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Adjust the text size throughout the application
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure cache system settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-collection">Data Collection</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow anonymous usage statistics
                  </p>
                </div>
                <Switch id="data-collection" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Show system notifications
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep dashboard data updated
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Data Management</h3>
                <Button 
                  variant="outline" 
                  className="w-full mb-2 rounded-md"
                  onClick={handleClearLocalStorage}
                >
                  Clear Local Storage
                </Button>
                <p className="text-xs text-muted-foreground">
                  Resets all local settings and preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Information about Cache Compass
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-secondary p-4">
              <h3 className="font-medium mb-1">Cache Compass</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0 - A smart API caching system for optimizing web application performance.
              </p>
              <div className="mt-4 text-sm">
                <p>Built with Lovable, React, Javascript, and Tailwind CSS.</p>
                <p className="mt-1">© 2023 Cache Compass. All rights reserved.</p>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <a href="#" className="text-primary hover:underline">Documentation</a>
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              <a href="#" className="text-primary hover:underline">Contact Support</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
