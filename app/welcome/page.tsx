'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Mic, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-slate-950 text-[#1C274C] dark:text-slate-100 flex flex-col justify-between selection:bg-[#E1F18C]">
      {/* Top Header */}
      <header className="px-6 py-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo size="md" />
        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-[#1C274C] dark:text-slate-200">
              Parent Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="lime" size="md">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-8 flex flex-col items-center justify-center text-center">
        {/* Micro Badge */}
        <Badge variant="pillBlue" className="mb-6 py-2 px-5 text-xs font-bold uppercase tracking-wider space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>Adaptive Early Literacy Experience</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl text-[#1C274C] dark:text-white leading-[1.1]">
          Personalized Learning Adventures for Every Child
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
          Interactive chapters synthesized for your child with real-time speech evaluation to build reading mastery.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="lime" size="lg" className="w-full sm:w-auto text-base font-bold shadow-lg shadow-lime-200/50">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="blue" size="lg" className="w-full sm:w-auto text-base font-bold shadow-lg shadow-blue-200/50">
              I Already Have an Account
            </Button>
          </Link>
        </div>

        {/* Behance Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <Card variant="lime" className="p-2 border-0 shadow-sm">
            <CardContent className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#1C274C] text-white flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1C274C]">Adaptive Stories</h3>
              <p className="text-sm font-medium text-slate-700">
                Custom chapters synthesized matching your child age, interest tags, and reading pace.
              </p>
            </CardContent>
          </Card>

          <Card variant="purple" className="p-2 border-0 shadow-sm">
            <CardContent className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#1C274C] text-white flex items-center justify-center">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1C274C]">Speech Recognition</h3>
              <p className="text-sm font-medium text-slate-700">
                Real-time speech evaluation gives immediate feedback on phonics and word pronunciations.
              </p>
            </CardContent>
          </Card>

          <Card variant="blue" className="p-2 border-0 shadow-sm">
            <CardContent className="space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#1C274C] text-white flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Parent Security</h3>
              <p className="text-sm font-medium text-blue-50">
                Child-safe interface with 4-digit Parent PIN authorization to manage subscription and progress.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-600">
        Onesimos Learning App &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  );
}
