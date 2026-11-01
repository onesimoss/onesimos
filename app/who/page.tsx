'use client';

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
                    className={`h-28 w-28 sm:h-36 sm:w-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl ${avatarMatch.bg} shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-[#71A6EE]`}
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
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
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
