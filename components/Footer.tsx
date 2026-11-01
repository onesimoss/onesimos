"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="w-full bg-white px-6 py-16 md:px-12 md:py-20 font-[family-name:var(--font-switzer)] border-t border-[#0B1B3A]/5">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand + newsletter + social */}
          <div className="flex flex-col gap-6">
            <span className="font-[family-name:var(--font-achiko)] text-3xl font-bold tracking-tight text-[#0B1B3A]">
              Onesimos
            </span>

            <p className="max-w-xs text-[15px] leading-relaxed text-[#0B1B3A]/70">
              Personalized learning chapters and real-time speech evaluation for children ages 3 to 12.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-xs items-center overflow-hidden rounded-full border border-[#0B1B3A]/15 bg-white shadow-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-[#0B1B3A] outline-none placeholder:text-[#0B1B3A]/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="m-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1B3A] text-white transition-opacity hover:opacity-90"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/onesimosapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 text-[15px] font-medium text-[#0B1B3A]/70 transition-colors hover:text-[#E1306C]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#833AB4] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span>@onesimosapp</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:justify-self-center pt-2">
            <ul className="flex flex-col gap-4 text-base font-medium text-[#0B1B3A]">
              <li><a href="#about" className="transition-colors hover:text-[#F97316]">About</a></li>
              <li><a href="#features" className="transition-colors hover:text-[#F97316]">Features</a></li>
              <li><a href="#curriculum" className="transition-colors hover:text-[#F97316]">Curriculum</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-[#F97316]">Pricing</a></li>
              <li><Link href="/signup" className="transition-colors hover:text-[#F97316]">Start free</Link></li>
            </ul>
          </div>

          {/* Contact + stores */}
          <div className="flex flex-col gap-5 pt-2 md:items-end md:text-right">
            <a href="mailto:crux@examplemirror.com" className="flex items-center gap-2 text-[15px] text-[#0B1B3A] md:flex-row-reverse hover:text-[#F97316] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              crux@examplemirror.com
            </a>
            <a href="https://wa.me/12023500607" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] text-[#0B1B3A] md:flex-row-reverse hover:text-[#25D366] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              +1 202 350 0607
            </a>

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 md:justify-end w-full sm:w-auto">
              {/* Apple App Store */}
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white transition-transform hover:scale-105 shadow-md"
              >
                <svg width="22" height="24" viewBox="0 0 16 18" fill="white" aria-hidden="true">
                  <path d="M13.3 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5zM10.8 3.3c.6-.7 1-1.7.9-2.7-1.9.1-3.3 1.3-3.8 2.2.5.1 1.9.6 2.9.5z" />
                </svg>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-medium opacity-90">Download on the</span>
                  <span className="text-base font-semibold">App Store</span>
                </span>
              </a>
              {/* Google Play Store */}
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white transition-transform hover:scale-105 shadow-md"
              >
                <svg width="20" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.384 1.054C2.138 1.187 2 1.482 2 1.916v20.168c0 .433.138.729.384.862l.06.012 11.455-11.454v-.108L2.444 1.042l-.06.012z" fill="#4285F4"/>
                  <path d="M18.152 16.745l-4.253-4.253v-.984l4.253-4.253.072.036 5.05 2.868c1.44.816 1.44 2.16 0 2.988l-5.05 2.868-.072.036z" fill="#EA4335"/>
                  <path d="M18.224 7.255L13.899 11.58 2.444 1.042C2.864.634 3.56.586 4.352 1.042l13.872 7.86z" fill="#FBBC04"/>
                  <path d="M18.224 16.745l-13.872 7.86c-.792.444-1.488.408-1.908 0L13.899 12.42l4.325 4.325z" fill="#34A853"/>
                </svg>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-medium opacity-90">GET IT ON</span>
                  <span className="text-base font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#0B1B3A]/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-[#0B1B3A]/60">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/terms" className="hover:text-[#0B1B3A] transition-colors">Terms and Conditions</Link>
            <span className="px-1 text-[#0B1B3A]/20">|</span>
            <Link href="/privacy" className="hover:text-[#0B1B3A] transition-colors">Privacy Policy</Link>
          </div>
          <p className="sm:text-right leading-relaxed">
            Copyright © 2026 Example Mirror Ltd | All Rights Reserved <br className="hidden sm:block" />
            <span className="text-xs opacity-75">(Onesimos is a product of Example Mirror Ltd)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
