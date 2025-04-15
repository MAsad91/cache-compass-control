
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
  isHighContrastMode: false,
  toggleHighContrastMode: () => null,
  isReducedMotion: false,
  toggleReducedMotion: () => null,
  toggleTheme: () => null,
};

const ThemeContext = createContext(initialState);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage or use default
    const savedTheme = localStorage.getItem("ui-theme");
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // If user has set a preference in their OS
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });
  
  const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
    return localStorage.getItem("high-contrast-mode") === "true";
  });
  
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    return localStorage.getItem("reduced-motion") === "true";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old themes
    root.classList.remove("light", "dark");
    
    // Apply new theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Update high-contrast mode
    if (isHighContrastMode) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Update reduced-motion mode
    if (isReducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
    
    // Save changes to localStorage
    localStorage.setItem("ui-theme", theme);
    localStorage.setItem("high-contrast-mode", isHighContrastMode);
    localStorage.setItem("reduced-motion", isReducedMotion);
  }, [theme, isHighContrastMode, isReducedMotion]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case "light":
          return "dark";
        case "dark":
          return "system";
        default:
          return "light";
      }
    });
  };

  const toggleHighContrastMode = () => {
    setIsHighContrastMode((prev) => !prev);
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isHighContrastMode,
        toggleHighContrastMode,
        isReducedMotion,
        toggleReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
