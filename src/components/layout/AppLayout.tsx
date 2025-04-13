
import { AppHeader } from "./AppHeader";
import { Toaster } from "sonner";
import { useTheme } from "@/providers/ThemeProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Toaster theme={theme === "system" ? undefined : theme} />
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
