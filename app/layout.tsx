import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { achiko, switzer } from "@/lib/fonts";

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