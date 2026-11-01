const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDir(dirname);
    fs.mkdirSync(dirname);
  }
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[CREATED/UPDATED] ${filePath}`);
}

// 1. Search for existing AuthProvider files in repository
function findAuthProvider(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const res = findAuthProvider(fullPath);
      if (res) return res;
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("AuthProvider") || content.includes("useAuth")) {
        if (
          content.includes("createContext") ||
          content.includes("AuthProvider")
        ) {
          return fullPath;
        }
      }
    }
  }
  return null;
}

console.log("Searching for AuthProvider file...");
const authProviderPath =
  findAuthProvider("components") ||
  findAuthProvider("lib") ||
  findAuthProvider("context") ||
  findAuthProvider("providers") ||
  findAuthProvider("app");

let authImportStatement = "";
let AuthWrapperStart = "";
let AuthWrapperEnd = "";

if (authProviderPath) {
  console.log(`Found AuthProvider at: ${authProviderPath}`);
  // Convert relative path to alias @/...
  const relativeFromRoot = path
    .relative(process.cwd(), authProviderPath)
    .replace(/\\/g, "/");
  const importAlias = "@/" + relativeFromRoot.replace(/\.(tsx|ts)$/, "");

  // Check export style
  const content = fs.readFileSync(authProviderPath, "utf8");
  if (
    content.includes("export function AuthProvider") ||
    content.includes("export const AuthProvider")
  ) {
    authImportStatement = `import { AuthProvider } from "${importAlias}";`;
    AuthWrapperStart = "<AuthProvider>";
    AuthWrapperEnd = "</AuthProvider>";
  } else if (content.includes("export default")) {
    authImportStatement = `import AuthProvider from "${importAlias}";`;
    AuthWrapperStart = "<AuthProvider>";
    AuthWrapperEnd = "</AuthProvider>";
  }
} else {
  console.log("AuthProvider file not found directly in scan.");
}

// 2. Resilient ThemeProvider (Safe fallback for SSR/Static prerendering)
const themeProvider = `"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "onesimos-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  // Safe default fallback for static generation or unmounted SSR tree
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      setTheme: () => null,
    };
  }
  return context;
};
`;

// 3. Combined Root Layout (Preserves AuthProvider + Adds ThemeProvider)
const appLayout = `import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
${authImportStatement}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onesimos | Early Learning & Growth Compass",
  description: "Personalized learning chapters and growth monitoring for young learners.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={\`\${inter.variable} font-sans bg-brand-bg dark:bg-brand-darkBg min-h-screen text-brand-navy dark:text-slate-100\`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          ${AuthWrapperStart}
            {children}
          ${AuthWrapperEnd}
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

console.log("Writing ThemeProvider and combined RootLayout...");
writeFile("components/theme-provider.tsx", themeProvider);
writeFile("app/layout.tsx", appLayout);
console.log("Layout providers successfully updated!");
