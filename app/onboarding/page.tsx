'use client';

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
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#1C274C] text-white shadow-md scale-105'
                          : 'bg-[#F4F8FF] text-[#1C274C] border border-slate-200 hover:border-[#71A6EE] dark:bg-slate-800 dark:text-slate-200'
                      }`}
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
                    className={`py-3 rounded-full text-xs font-bold transition-all border ${
                      sessionMinutes === mins
                        ? 'border-[#71A6EE] bg-[#71A6EE] text-white shadow-md'
                        : 'border-slate-200 bg-[#F4F8FF] text-[#1C274C] dark:bg-slate-800 dark:border-slate-700 dark:text-white'
                    }`}
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
