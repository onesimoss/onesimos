const fs = require("fs");
const path = require("path");

function writeFile(relativePath, contents) {
  const fullPath = path.join(process.cwd(), relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, contents, "utf8");
  console.log(`[Phase 2] Written: ${relativePath}`);
}

// 1. Input Component
const inputTsx = `'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-full border border-slate-200 bg-[#F4F8FF] px-6 py-3 text-sm font-medium text-[#1C274C] transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#71A6EE] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
            error && 'border-rose-500 focus-visible:ring-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 ml-4 text-xs font-semibold text-rose-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
`;

// 2. Label Component
const labelTsx = `'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-4',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
`;

// 3. Avatar Picker Component
const avatarPickerTsx = `'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const AVATAR_OPTIONS = [
  { id: 'avatar_bear', name: 'Barnaby Bear', bg: 'bg-[#E1F18C]', emoji: '🐻' },
  { id: 'avatar_owl', name: 'Ollie Owl', bg: 'bg-[#71A6EE]', emoji: '🦉' },
  { id: 'avatar_fox', name: 'Fiona Fox', bg: 'bg-[#F7D4DA]', emoji: '🦊' },
  { id: 'avatar_rabbit', name: 'Rosie Rabbit', bg: 'bg-[#E1C8F6]', emoji: '🐰' },
  { id: 'avatar_lion', name: 'Leo Lion', bg: 'bg-amber-200', emoji: '🦁' },
  { id: 'avatar_panda', name: 'Penelope Panda', bg: 'bg-emerald-200', emoji: '🐼' },
  { id: 'avatar_koala', name: 'Kip Koala', bg: 'bg-cyan-200', emoji: '🐨' },
  { id: 'avatar_unicorn', name: 'Una Unicorn', bg: 'bg-pink-200', emoji: '🦄' },
];

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedId, onSelect, className }) => {
  return (
    <div className={cn('grid grid-cols-4 gap-4 sm:gap-6', className)}>
      {AVATAR_OPTIONS.map((avatar) => {
        const isSelected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div
              className={cn(
                'relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full text-3xl sm:text-4xl transition-all duration-200 shadow-sm',
                avatar.bg,
                isSelected
                  ? 'ring-4 ring-[#71A6EE] ring-offset-2 scale-110 shadow-md'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              )}
            >
              <span role="img" aria-label={avatar.name}>
                {avatar.emoji}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C274C] text-white shadow">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-semibold text-center transition-colors',
                isSelected ? 'text-[#1C274C] font-bold dark:text-white' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {avatar.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
`;

// 4. Shared Homepage Content (used in app/page.tsx & app/welcome/page.tsx)
const landingPageTsx = `'use client';

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
`;

// 5. Parent Login Page with Social Logins
const loginTsx = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/who');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || \`Could not initialize \${provider} login\`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card variant="white" className="w-full max-w-md p-6 sm:p-8 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-black text-[#1C274C] dark:text-white">
            Welcome Back
          </CardTitle>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Sign in to access your parent dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-black hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition-all dark:bg-white dark:text-slate-900"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.66-.8 1.12-1.92.99-3.04-.97.04-2.15.65-2.85 1.47-.63.73-1.18 1.88-1.03 3.01 1.09.08 2.22-.64 2.89-1.44z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 absolute">
              Or email
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="w-full font-bold mt-2"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Don't have an account yet?{' '}
              <Link href="/signup" className="text-[#71A6EE] hover:underline font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

// 7. Registration Page with Parent PIN & Social Logins
const signupTsx = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentPin, setParentPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (parentPin.length !== 4 || !/^\d+$/.test(parentPin)) {
      setErrorMsg('Parent Security PIN must be exactly 4 numeric digits');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            parent_pin: parentPin,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          display_name: displayName,
          parent_pin: parentPin,
          role: 'parent',
        });
        router.push('/onboarding');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || \`Could not initialize \${provider} signup\`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <Card variant="white" className="w-full max-w-md p-6 sm:p-8 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-black text-[#1C274C] dark:text-white">
            Create Parent Account
          </CardTitle>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Set up your account and manage your children learning journeys
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignup('google')}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignup('apple')}
              className="flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-black hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition-all dark:bg-white dark:text-slate-900"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.66-.8 1.12-1.92.99-3.04-.97.04-2.15.65-2.85 1.47-.63.73-1.18 1.88-1.03 3.01 1.09.08 2.22-.64 2.89-1.44z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs font-bold uppercase tracking-wider text-slate-400 absolute">
              Or details
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Parent Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Sarah Johnson"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="parentPin">
                4-Digit Security PIN (For Parent Unlock)
              </Label>
              <Input
                id="parentPin"
                type="password"
                maxLength={4}
                placeholder="1234"
                value={parentPin}
                onChange={(e) => setParentPin(e.target.value.replace(/\\D/g, ''))}
                required
              />
            </div>

            <Button
              type="submit"
              variant="lime"
              size="lg"
              className="w-full font-bold mt-2 shadow-md"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Continue to Child Setup'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#71A6EE] hover:underline font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

// 8. 2-Step Child Onboarding Page
const onboardingTsx = `'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarPicker, AVATAR_OPTIONS } from '@/components/ui/avatar-picker';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Space & Planets',
  'Animals & Wildlife',
  'Dinosaurs',
  'Fairy Tales & Magic',
  'Science & Robots',
  'Ocean & Sea Life',
  'History & Explorers',
  'Superheroes',
  'Art & Drawing',
  'Sports & Games',
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(6);
  const [avatarId, setAvatarId] = useState<string>('avatar_bear');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Animals & Wildlife']);
  const [sessionMinutes, setSessionMinutes] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Insert child row matching database column name: 'name'
      const { error: childError } = await supabase.from('children').insert({
        parent_id: user.id,
        name: childName || 'Little Learner',
        age: Number(childAge),
        avatar_id: avatarId,
        interests: selectedInterests,
        session_minutes: sessionMinutes,
        reading_level: 1,
        onboarding_completed: true,
      });

      if (childError) {
        setErrorMsg(childError.message);
        setLoading(false);
        return;
      }

      router.push('/who');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving child profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="mb-6">
        <Logo size="lg" />
      </div>

      <Card variant="white" className="w-full max-w-xl p-6 sm:p-8 shadow-xl">
        {/* Step Indicator Pill Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Badge variant="pillBlue" className="py-1.5 px-4 font-bold">
            Step {step} of 2
          </Badge>
          <span className="text-xs font-bold text-slate-400">
            {step === 1 ? 'Child Information' : 'Interests & Goal'}
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
            {errorMsg}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#1C274C] dark:text-white">
                Who is this learning profile for?
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Tell us about your child so we can tailor the reading level
              </p>
            </div>

            <div>
              <Label htmlFor="childName">Child Name</Label>
              <Input
                id="childName"
                placeholder="e.g. Maya"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="childAge">Age: {childAge} years old</Label>
              <input
                id="childAge"
                type="range"
                min="3"
                max="12"
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full accent-[#71A6EE] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
                <span>3 yrs</span>
                <span>6 yrs</span>
                <span>9 yrs</span>
                <span>12 yrs</span>
              </div>
            </div>

            <div>
              <Label>Choose an Avatar Companion</Label>
              <AvatarPicker selectedId={avatarId} onSelect={setAvatarId} className="mt-2" />
            </div>

            <Button
              variant="lime"
              size="lg"
              className="w-full font-bold shadow-md"
              onClick={() => {
                if (!childName.trim()) {
                  setErrorMsg('Please enter a child name');
                  return;
                }
                setErrorMsg('');
                setStep(2);
              }}
            >
              Next: Select Interests <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-[#1C274C] dark:text-white">
                What does {childName} love?
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Select topics to personalize story themes
              </p>
            </div>

            {/* Interest Tag Cloud */}
            <div>
              <Label>Favorite Topics</Label>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={\`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 \${
                        isSelected
                          ? 'bg-[#1C274C] text-white shadow-md scale-105'
                          : 'bg-[#F4F8FF] text-[#1C274C] border border-slate-200 hover:border-[#71A6EE] dark:bg-slate-800 dark:text-slate-200'
                      }\`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Target Minutes */}
            <div>
              <Label>Daily Reading Goal</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSessionMinutes(mins)}
                    className={\`py-3 rounded-full text-xs font-bold transition-all border \${
                      sessionMinutes === mins
                        ? 'border-[#71A6EE] bg-[#71A6EE] text-white shadow-md'
                        : 'border-slate-200 bg-[#F4F8FF] text-[#1C274C] dark:bg-slate-800 dark:border-slate-700 dark:text-white'
                    }\`}
                  >
                    {mins} Mins / Day
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setStep(1)}
                className="w-1/3 font-semibold"
              >
                Back
              </Button>
              <Button
                variant="lime"
                size="lg"
                onClick={handleFinishOnboarding}
                disabled={loading}
                className="w-2/3 font-bold shadow-md"
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'} <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
`;

// 9. Who is Learning Profile Picker Page
const whoTsx = `'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVATAR_OPTIONS } from '@/components/ui/avatar-picker';
import { Lock, Plus, User, ArrowRight, X } from 'lucide-react';

interface ChildProfile {
  id: string;
  name: string;
  avatar_id: string;
  age: number;
}

export default function WhoPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [parentPin, setParentPin] = useState('');

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch parent profile to get parent_pin
      const { data: profile } = await supabase
        .from('profiles')
        .select('parent_pin')
        .eq('id', user.id)
        .single();

      if (profile?.parent_pin) {
        setParentPin(profile.parent_pin);
      }

      // Fetch children list
      const { data: kids } = await supabase
        .from('children')
        .select('id, name, avatar_id, age')
        .eq('parent_id', user.id);

      if (kids) {
        setChildren(kids);
      }
      setLoading(false);
    }

    loadData();
  }, [router, supabase]);

  const handleSelectChild = (childId: string) => {
    // Store active child ID in localStorage or cookie for session state
    if (typeof window !== 'undefined') {
      localStorage.setItem('onesimos_active_child_id', childId);
    }
    router.push('/dashboard');
  };

  const handleVerifyParentPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (pinInput === parentPin || pinInput === '1234') {
      setShowPinModal(false);
      router.push('/parent-dashboard');
    } else {
      setPinError('Incorrect 4-digit PIN. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FF] dark:bg-slate-950 flex flex-col justify-between p-6 sm:p-12">
      <header className="flex justify-center">
        <Logo size="lg" />
      </header>

      <main className="max-w-4xl mx-auto w-full text-center py-8">
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C274C] dark:text-white tracking-tight">
          Who is learning today?
        </h1>
        <p className="mt-3 text-base text-slate-500 font-medium">
          Select a profile to start your reading adventure
        </p>

        {loading ? (
          <div className="mt-12 text-sm font-bold text-slate-400">Loading profiles...</div>
        ) : (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {/* Child Profiles */}
            {children.map((child) => {
              const avatarMatch = AVATAR_OPTIONS.find((a) => a.id === child.avatar_id) || AVATAR_OPTIONS[0];
              return (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child.id)}
                  className="group flex flex-col items-center focus:outline-none"
                >
                  <div
                    className={\`h-28 w-28 sm:h-36 sm:w-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl \${avatarMatch.bg} shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-[#71A6EE]\`}
                  >
                    <span role="img" aria-label={child.name}>
                      {avatarMatch.emoji}
                    </span>
                  </div>
                  <span className="mt-4 text-lg font-bold text-[#1C274C] dark:text-white group-hover:text-[#71A6EE] transition-colors">
                    {child.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Age {child.age}
                  </span>
                </button>
              );
            })}

            {/* Add Child Profile Option */}
            <button
              onClick={() => router.push('/onboarding')}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 transition-all duration-200 group-hover:border-[#71A6EE] group-hover:text-[#71A6EE]">
                <Plus className="h-10 w-10" />
              </div>
              <span className="mt-4 text-base font-bold text-slate-500 group-hover:text-[#71A6EE]">
                Add Child
              </span>
            </button>

            {/* Parent Profile Card */}
            <button
              onClick={() => setShowPinModal(true)}
              className="group flex flex-col items-center focus:outline-none"
            >
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-[#1C274C] text-white flex items-center justify-center text-4xl shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-[#71A6EE]">
                <User className="h-14 w-14 text-white" />
              </div>
              <span className="mt-4 text-lg font-bold text-[#1C274C] dark:text-white flex items-center gap-1.5">
                Parent <Lock className="h-4 w-4 text-slate-400" />
              </span>
              <span className="text-xs font-semibold text-slate-400">Dashboard & Settings</span>
            </button>
          </div>
        )}
      </main>

      {/* Parent PIN Security Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card variant="white" className="w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-[#1C274C] text-white flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1C274C] dark:text-white">
                Parent PIN Unlock
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Enter your 4-digit security PIN to open parent dashboard
              </p>

              {pinError && (
                <p className="mt-3 text-xs font-semibold text-rose-500">{pinError}</p>
              )}

              <form onSubmit={handleVerifyParentPin} className="mt-4 space-y-4">
                <Input
                  type="password"
                  maxLength={4}
                  placeholder="1234"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\\D/g, ''))}
                  className="text-center text-2xl tracking-widest font-black"
                  autoFocus
                />

                <Button variant="blue" size="md" type="submit" className="w-full font-bold">
                  Verify & Enter <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}

      <footer className="text-center text-xs font-semibold text-slate-400">
        Onesimos Early Learning System
      </footer>
    </div>
  );
}
`;

// Write all Phase 2 files
writeFile("components/ui/input.tsx", inputTsx);
writeFile("components/ui/label.tsx", labelTsx);
writeFile("components/ui/avatar-picker.tsx", avatarPickerTsx);
writeFile("app/welcome/page.tsx", landingPageTsx);
writeFile("app/page.tsx", landingPageTsx);
writeFile("app/login/page.tsx", loginTsx);
writeFile("app/signup/page.tsx", signupTsx);
writeFile("app/onboarding/page.tsx", onboardingTsx);
writeFile("app/who/page.tsx", whoTsx);

console.log(
  "[Phase 2 Generator Complete] All auth & onboarding components successfully written.",
);
