const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDir(dirname);
  fs.mkdirSync(dirname);
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[CREATED/UPDATED] ${filePath}`);
}

// 1. Tailwind Config
const tailwindConfig = `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          navy: "#1C274C",
          blue: "#71A6EE",
          lime: "#E1F18C",
          purple: "#E1C8F6",
          pink: "#F7D4DA",
          bg: "#F4F8FF",
          darkBg: "#0F172A",
          darkCard: "#1E293B",
        },
        primary: {
          DEFAULT: "#1C274C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E1F18C",
          foreground: "#1C274C",
        },
        accent: {
          DEFAULT: "#71A6EE",
          foreground: "#FFFFFF",
        },
        purpleCard: {
          DEFAULT: "#E1C8F6",
          foreground: "#1C274C",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
        pill: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
`;

// 2. Global CSS
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 216 100% 98%;
    --foreground: 226 46% 20%;
    --card: 0 0% 100%;
    --card-foreground: 226 46% 20%;
    --popover: 0 0% 100%;
    --popover-foreground: 226 46% 20%;
    --primary: 226 46% 20%;
    --primary-foreground: 0 0% 100%;
    --secondary: 70 78% 75%;
    --secondary-foreground: 226 46% 20%;
    --muted: 216 30% 95%;
    --muted-foreground: 215 16% 47%;
    --accent: 214 77% 69%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 226 46% 20%;
    --radius: 20px;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 217 33% 17%;
    --card-foreground: 210 40% 98%;
    --popover: 217 33% 17%;
    --popover-foreground: 210 40% 98%;
    --primary: 214 77% 69%;
    --primary-foreground: 222 47% 11%;
    --secondary: 70 78% 75%;
    --secondary-foreground: 222 47% 11%;
    --muted: 217 19% 27%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 214 77% 69%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 19% 27%;
    --input: 217 19% 27%;
    --ring: 214 77% 69%;
  }
}

@layer base {
  * {
    @apply border-border;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased selection:bg-brand-blue selection:text-white;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* Mobile Capacitor optimizations */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
`;

// 3. Theme Provider Wrapper
const themeProvider = `"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
`;

// 4. Root Layout
const appLayout = `import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

// 5. Base UI Primitives - Button (Pill Shaped per reference)
const buttonPrimitive = `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-brand-navy text-white hover:bg-brand-navy/90 dark:bg-brand-blue dark:text-brand-navy dark:hover:bg-brand-blue/90 shadow-sm",
        lime: "bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold",
        blue: "bg-brand-blue text-white hover:bg-brand-blue/90 font-semibold",
        purple: "bg-brand-purple text-brand-navy hover:bg-brand-purple/90 font-semibold",
        outline: "border-2 border-brand-navy/20 bg-transparent text-brand-navy hover:bg-brand-navy/5 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
        ghost: "bg-transparent text-brand-navy hover:bg-black/5 dark:text-slate-100 dark:hover:bg-white/10",
        pillPlay: "bg-white text-brand-navy rounded-full p-3 shadow-md hover:scale-105 active:scale-95 dark:bg-slate-800 dark:text-white",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
`;

// 6. Base UI Primitives - Card (Very Rounded per reference)
const cardPrimitive = `import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "white" | "purple" | "lime" | "blue" | "pink" }
>(({ className, variant = "white", ...props }, ref) => {
  const variantStyles = {
    white: "bg-white text-brand-navy dark:bg-slate-800 dark:text-slate-100 shadow-sm",
    purple: "bg-brand-purple text-brand-navy",
    lime: "bg-brand-lime text-brand-navy",
    blue: "bg-brand-blue text-white",
    pink: "bg-brand-pink text-brand-navy",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[32px] p-6 transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-bold leading-tight tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-brand-navy/70 dark:text-slate-300", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`;

// 7. Base UI Primitives - Badge (Pill style tags like "12 lessons", "Aa Letters")
const badgePrimitive = `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-navy text-white dark:bg-slate-700 dark:text-white",
        active: "bg-brand-navy text-white ring-2 ring-brand-navy dark:bg-brand-blue dark:text-brand-navy",
        outline: "bg-white/80 text-brand-navy border border-brand-navy/15 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        lime: "bg-brand-lime text-brand-navy font-bold",
        purple: "bg-brand-purple text-brand-navy font-bold",
        blue: "bg-brand-blue text-white font-bold",
        soft: "bg-white/60 backdrop-blur-md text-brand-navy dark:bg-slate-800/60 dark:text-slate-100",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
`;

// 8. Onesimos Logo Component with 3 Lockups
const logoComponent = `import * as React from "react";
import { Sparkles, Sprout, Shapes } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "spark" | "growth" | "blocks";
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ variant = "spark", className, iconOnly = false }: LogoProps) {
  const icons = {
    spark: <Sparkles className="w-6 h-6 text-brand-blue fill-brand-blue/20" />,
    growth: <Sprout className="w-6 h-6 text-brand-navy dark:text-brand-lime" />,
    blocks: <Shapes className="w-6 h-6 text-brand-purple dark:text-brand-blue" />,
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-black/5 dark:border-white/10">
        {icons[variant]}
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
          Onesimos
        </span>
      )}
    </div>
  );
}
`;

// Execute code writing
console.log("Starting Phase 1 Foundation file creation...");
writeFile("tailwind.config.ts", tailwindConfig);
writeFile("app/globals.css", globalsCss);
writeFile("components/theme-provider.tsx", themeProvider);
writeFile("app/layout.tsx", appLayout);
writeFile("components/ui/button.tsx", buttonPrimitive);
writeFile("components/ui/card.tsx", cardPrimitive);
writeFile("components/ui/badge.tsx", badgePrimitive);
writeFile("components/ui/logo.tsx", logoComponent);
console.log("Phase 1 Foundation files written successfully!");
