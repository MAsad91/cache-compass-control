
import { AppHeader } from "./AppHeader";
import { Toaster } from "sonner";
import { useTheme } from "@/providers/ThemeProvider";

export function AppLayout({ children }) {
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
