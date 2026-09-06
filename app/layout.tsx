import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load Achiko (for the logo)
const achiko = localFont({
  src: "./fonts/achiko.otf",
  variable: "--font-achiko",
  weight: "100 900",
});

// Load Switzer (for everything else)
const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/Switzer-Black.otf", weight: "900", style: "normal" },
    // Add more weights here if needed, e.g., Medium, Semibold
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onesimos",
  description: "A playful learning platform for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${achiko.variable} ${switzer.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}