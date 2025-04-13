
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { AppNav } from "./AppNav";
import { Database } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export function AppHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Database className="h-6 w-6 text-accent" />
            <span className="font-semibold text-lg hidden sm:inline-block">Cache Compass</span>
          </Link>
        </div>
        
        {isMobile ? (
          <div className="flex items-center">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Navigation</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/management">Cache Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/testing">API Testing</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center">
            <AppNav />
            <div className="ml-6">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
