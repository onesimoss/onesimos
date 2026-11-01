'use client';

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

    if (parentPin.length !== 4 || !/^d+$/.test(parentPin)) {
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
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || `Could not initialize ${provider} signup`);
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
                onChange={(e) => setParentPin(e.target.value.replace(/\D/g, ''))}
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
