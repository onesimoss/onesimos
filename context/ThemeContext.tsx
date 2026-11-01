"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "dinosaurs" | "football" | "space" | "fantasy";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dinosaurs");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) { return { theme: "light", setTheme: () => {}, toggleTheme: () => {} }; }
  return context;
}