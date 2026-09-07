import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const achiko = localFont({
  src: "./fonts/achiko.otf",
  variable: "--font-achiko",
  display: "swap",
});

const switzer = localFont({
  src: [
    {
      path: "./fonts/Switzer-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onesimos — Playful Reading for Kids",
  description:
    "A playful reading platform where kids unlock incredible stories, conquer tricky words, and build a lifelong love for reading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${achiko.variable} ${switzer.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}