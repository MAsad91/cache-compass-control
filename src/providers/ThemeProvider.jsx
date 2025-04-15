
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
  isHighContrastMode: false,
  toggleHighContrastMode: () => null,
  isReducedMotion: false,
  toggleReducedMotion: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "cache-compass-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme) {
        return storedTheme;
      }
      return defaultTheme;
    }
    return defaultTheme;
  });

  const [isHighContrastMode, setIsHighContrastMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("highContrastMode") === "true";
    }
    return false;
  });

  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem("reducedMotion");
      if (storedPreference) {
        return storedPreference === "true";
      }
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme and contrast classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply high contrast mode
    if (isHighContrastMode) {
      root.classList.add("high-contrast");
    }

    // Apply reduced motion
    if (isReducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

  }, [theme, isHighContrastMode, isReducedMotion]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem(storageKey, newTheme);
      return newTheme;
    });
  };

  const toggleHighContrastMode = () => {
    setIsHighContrastMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("highContrastMode", String(newValue));
      return newValue;
    });
  };

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => {
      const newValue = !prev;
      localStorage.setItem("reducedMotion", String(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(
          mediaQuery.matches ? "dark" : "light"
        );
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isHighContrastMode,
    toggleHighContrastMode,
    isReducedMotion,
    toggleReducedMotion,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
