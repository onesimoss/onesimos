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
    <footer className="bg-[#EDE4FF] px-4 py-10 md:px-8 md:py-14 font-[family-name:var(--font-switzer)]">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-white px-6 py-10 md:px-12 md:py-14 shadow-sm">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand + newsletter + social */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]">
                <span className="font-[family-name:var(--font-achiko)] text-lg font-bold text-white">O</span>
              </div>
              <span className="font-[family-name:var(--font-achiko)] text-2xl font-bold tracking-tight text-[#0B1B3A]">
                Onesimos
              </span>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-[#0B1B3A]/70">
              Personalized learning chapters and real-time speech evaluation for children ages 3 to 12.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-xs items-center overflow-hidden rounded-full border border-[#0B1B3A]/15 bg-white">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-[#0B1B3A] outline-none placeholder:text-[#0B1B3A]/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1B3A] text-white transition-opacity hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-3 pt-1">
              {[
                { label: "Facebook", d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "Twitter", d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: "Instagram", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11A4 4 0 0121.5 10.5v11a4 4 0 01-4 4h-11a4 4 0 01-4-4v-11a4 4 0 014-4z" },
                { label: "LinkedIn", d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" },
                { label: "YouTube", d: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#0B1B3A]/60 transition-colors hover:text-[#F97316]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:justify-self-center">
            <ul className="flex flex-col gap-3 text-[15px] font-medium text-[#0B1B3A]">
              <li><a href="#about" className="transition-colors hover:text-[#F97316]">About</a></li>
              <li><a href="#features" className="transition-colors hover:text-[#F97316]">Features</a></li>
              <li><a href="#curriculum" className="transition-colors hover:text-[#F97316]">Curriculum</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-[#F97316]">Pricing</a></li>
              <li><Link href="/signup" className="transition-colors hover:text-[#F97316]">Start free</Link></li>
            </ul>
          </div>

          {/* Contact + stores */}
          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <a href="mailto:hello@onesimos.app" className="flex items-center gap-2 text-sm text-[#0B1B3A] md:flex-row-reverse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              hello@onesimos.app
            </a>
            <a href="https://onesimos.app" className="flex items-center gap-2 text-sm text-[#0B1B3A] md:flex-row-reverse">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              onesimos.app
            </a>

            <div className="mt-2 flex flex-wrap items-center gap-2 md:justify-end">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white transition-opacity hover:opacity-90"
              >
                <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
                  <path d="M13.3 9.5c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.1c.8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.5zM10.8 3.3c.6-.7 1-1.7.9-2.7-1.9.1-3.3 1.3-3.8 2.2.5.1 1.9.6 2.9.5z" />
                </svg>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[9px] opacity-80">Download on the</span>
                  <span className="text-xs font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white transition-opacity hover:opacity-90"
              >
                <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
                  <path d="M.3 0l6.3 7.2L.2 14.5c-.2-.2-.2-.4-.2-.7V.7C0 .4.1.2.3 0zm8.1 5.8L6.9 7.5l1.5 1.7 3.3-1.9c.4-.2.4-.5 0-.7L8.4 5.8zM.8 15.2l6.5-6.5 1.7 1.9-6.5 3.7c-.6.3-1.1.1-1.7-.1zM1.3.2L8.1 4 6.5 5.8.3.5C.5.3.9.1 1.3.2z" />
                </svg>
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[9px] opacity-80">GET IT ON</span>
                  <span className="text-xs font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#0B1B3A]/10 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#0B1B3A]/50">
          <div className="flex flex-wrap gap-1">
            <Link href="/terms" className="hover:text-[#0B1B3A]">Terms and Conditions</Link>
            <span className="px-1">|</span>
            <Link href="/privacy" className="hover:text-[#0B1B3A]">Privacy Policy</Link>
          </div>
          <p>Copyright © {new Date().getFullYear()} Onesimos | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
