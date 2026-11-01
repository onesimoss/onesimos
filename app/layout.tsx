import type { Metadata } from "next";
import { achiko, switzer } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onesimos - Interactive Reading for Ages 3-12",
  description: "Personalized learning chapters and real-time speech evaluation for children.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={achiko.variable + " " + switzer.variable + " antialiased"}>
        {children}
      </body>
    </html>
  );
}