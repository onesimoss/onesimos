import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const childFont = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const parentFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onesimos",
  description: "The Useful Tutor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${childFont.className} ${parentFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}