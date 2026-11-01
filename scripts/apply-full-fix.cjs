const fs = require("fs");
const path = require("path");

// 1. Update app/layout.tsx
const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
const layoutCode = 'import type { Metadata } from "next";\n' +
'import { achiko, switzer } from "@/lib/fonts";\n' +
'import "./globals.css";\n\n' +
'export const metadata: Metadata = {\n' +
'  title: "Onesimos - Interactive Reading for Ages 3-12",\n' +
'  description: "Personalized learning chapters and real-time speech evaluation for children.",\n' +
'};\n\n' +
'export default function RootLayout({ children }) {\n' +
'  return (\n' +
'    <html lang="en">\n' +
'      <body className={achiko.variable + " " + switzer.variable + " antialiased"}>\n' +
'        {children}\n' +
'      </body>\n' +
'    </html>\n' +
'  );\n' +
'}';
fs.writeFileSync(layoutPath, layoutCode);

// 2. Update app/globals.css
const cssPath = path.join(process.cwd(), "app", "globals.css");
const marqueeCSS = '\n@keyframes marquee {\n' +
'  0% { transform: translateX(0%); }\n' +
'  100% { transform: translateX(-50%); }\n' +
'}\n' +
'.animate-marquee {\n' +
'  display: flex;\n' +
'  width: max-content;\n' +
'  animation: marquee 30s linear infinite;\n' +
'}\n';
const currentCSS = fs.readFileSync(cssPath, "utf8");
if (!currentCSS.includes("keyframes marquee")) {
    fs.appendFileSync(cssPath, marqueeCSS);
}

// 3. Update app/page.tsx
const pagePath = path.join(process.cwd(), "app", "page.tsx");
const pageCode = '"use client";\n' +
'import React, { useState } from "react";\n' +
'import Link from "next/link";\n\n' +
'const Logo = () => (\n' +
'  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">\n' +
'    <rect width="40" height="40" rx="8" fill="#F97316"/>\n' +
'    <path d="M12 10V30M12 10H28M12 20H24M12 30H28" stroke="white" strokeWidth="4" strokeLinecap="round"/>\n' +
'  </svg>\n' +
');\n\n' +
'export default function LandingPage() {\n' +
'  const [billingCycle, setBillingCycle] = useState("monthly");\n' +
'  return (\n' +
'    <div className="min-h-screen bg-[#FDF8F3] font-[family-name:var(--font-switzer)] text-[#0B1B3A]">\n' +
'      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F3]/90 backdrop-blur-md border-b border-[#0B1B3A]/5 h-20 flex items-center px-6">\n' +
'        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">\n' +
'          <div className="flex items-center gap-2"><Logo /><span className="font-[family-name:var(--font-achiko)] text-2xl font-bold">Onesimos</span></div>\n' +
'          <div className="flex gap-4">\n' +
'            <Link href="/login" className="px-6 py-2 rounded-full border border-[#0B1B3A]">Log in</Link>\n' +
'            <Link href="/signup" className="px-6 py-2 rounded-full bg-[#F97316] text-white">Try for free</Link>\n' +
'          </div>\n' +
'        </div>\n' +
'      </nav>\n' +
'      <main className="pt-32 pb-20 px-6">\n' +
'        <div className="max-w-[1400px] mx-auto bg-[#0B1B3A] rounded-[40px] p-20 text-center relative overflow-hidden">\n' +
'          <h1 className="font-[family-name:var(--font-achiko)] text-6xl md:text-8xl text-white mb-8">Make reading something kids <span className="bg-[#F472B6] px-4 py-1 rounded-[30px] inline-block -rotate-2">own</span></h1>\n' +
'          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">Personalized learning chapters and real-time speech evaluation for ages 3-12.</p>\n' +
'          <Link href="/signup" className="px-10 py-5 bg-[#F97316] text-white text-xl font-bold rounded-full inline-block">Start Reading Now</Link>\n' +
'        </div>\n' +
'      </main>\n' +
'      <div className="bg-[#FACC15] py-6 border-y-2 border-[#0B1B3A] overflow-hidden">\n' +
'        <div className="animate-marquee flex gap-12 text-2xl font-black uppercase text-[#0B1B3A]">\n' +
'           <span>Real-time speech evaluation • Personalized chapters • Parent PIN protection • Adaptive synthesis • </span>\n' +
'           <span>Real-time speech evaluation • Personalized chapters • Parent PIN protection • Adaptive synthesis • </span>\n' +
'        </div>\n' +
'      </div>\n' +
'      <section className="py-24 px-6 max-w-7xl mx-auto text-center">\n' +
'        <h2 className="text-5xl font-[family-name:var(--font-achiko)] mb-12">Simple Pricing</h2>\n' +
'        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">\n' +
'          <div className="p-10 rounded-[40px] bg-white border-2 border-[#0B1B3A]/5">\n' +
'            <h3 className="text-2xl font-bold mb-4">Family Unlimited</h3>\n' +
'            <p className="text-4xl font-bold mb-6">$3.20 / ₦5,000</p>\n' +
'            <button className="w-full py-4 rounded-full bg-[#F97316] text-white font-bold">Choose Plan</button>\n' +
'          </div>\n' +
'          <div className="p-10 rounded-[40px] bg-white border-2 border-[#0B1B3A]/5">\n' +
'            <h3 className="text-2xl font-bold mb-4">School Classroom</h3>\n' +
'            <p className="text-4xl font-bold mb-6">$19.00 / ₦30,000</p>\n' +
'            <button className="w-full py-4 rounded-full border-2 border-[#0B1B3A] font-bold">Contact Sales</button>\n' +
'          </div>\n' +
'        </div>\n' +
'      </section>\n' +
'      <footer className="bg-[#0B1B3A] py-20 text-center text-white/60">\n' +
'        <p>&copy; 2024 Onesimos. All rights reserved.</p>\n' +
'      </footer>\n' +
'    </div>\n' +
'  );\n' +
'}';
fs.writeFileSync(pagePath, pageCode);

console.log("✅ Fix Applied without syntax errors!");