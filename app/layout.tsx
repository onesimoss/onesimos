import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const childFont = Fredoka({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"] 
});
const parentFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onesimos – The Useful Tutor",
  description: "Read aloud. Get better. Quietly.",
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
        <Analytics />
      </body>
    </html>
  );
}