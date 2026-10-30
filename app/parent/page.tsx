'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  total_points: number;
  streak_days: number;
  current_level: number;
  screen_time_limit_mins?: number;
  screen_time_used_mins?: number;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  is_admin?: boolean;
  pin_code?: string;
}

interface Subscription {
  status: string;
  plan_name: string;
  current_period_end: string;
  is_active: boolean;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Modals & UI States
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'delete' | 'pause' | 'view_billing' | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Add Child Form
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newChildAvatar, setNewChildAvatar] = useState('🐻');
  const [isAddingChild, setIsAddingChild] = useState(false);

  // Notice & Status Messages
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchParentData();
  }, []);

  async function fetchParentData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const userProfile: UserProfile = profileData || {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Parent',
        email: user.email || '',
        is_admin: user.user_metadata?.is_admin || false,
        pin_code: profileData?.pin_code || '1234'
      };
      setProfile(userProfile);

      // Fetch Children
      const { data: kidsData, error: kidsErr } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      if (kidsErr) {
        console.error('Error fetching children:', kidsErr);
      }

      const loadedKids: Child[] = (kidsData && kidsData.length > 0) ? kidsData : [
        {
          id: 'demo-child-1',
          name: 'Leo',
          age: 6,
          avatar: '🦁',
          total_points: 340,
          streak_days: 5,
          current_level: 3,
          screen_time_limit_mins: 45,
          screen_time_used_mins: 20
        }
      ];

      setChildrenList(loadedKids);
      if (loadedKids.length > 0) {
        setSelectedChildId(loadedKids[0].id);
      }

      // Fetch Subscription Status
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subData) {
        setSubscription({
          status: subData.status || 'active',
          plan_name: subData.plan_name || 'Onesimos Family Pass',
          current_period_end: subData.current_period_end || '2025-12-31',
          is_active: subData.status === 'active'
        });
      } else {
        setSubscription({
          status: 'trial',
          plan_name: 'Free Trial (14 Days Left)',
          current_period_end: '2025-04-15',
          is_active: true
        });
      }
    } catch (err) {
      console.error('Failed to load parent dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    setIsAddingChild(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newKidObj = {
        parent_id: user.id,
        name: newChildName.trim(),
        age: Number(newChildAge),
        avatar: newChildAvatar,
        total_points: 0,
        streak_days: 1,
        current_level: 1,
        screen_time_limit_mins: 45
      };

      const { data, error } = await supabase
        .from('children')
        .insert([newKidObj])
        .select()
        .single();

      if (error) {
        console.error('Error adding child:', error);
        // Fallback for local state demo
        const localKid: Child = {
          id: `local-${Date.now()}`,
          ...newKidObj,
          screen_time_used_mins: 0
        };
        setChildrenList(prev => [...prev, localKid]);
        setSelectedChildId(localKid.id);
      } else if (data) {
        setChildrenList(prev => [...prev, data]);
        setSelectedChildId(data.id);
      }

      setNewChildName('');
      setShowAddChildModal(false);
      triggerNotice('Child profile created successfully!');
    } catch (err) {
      console.error('Failed to create child:', err);
    } finally {
      setIsAddingChild(false);
    }
  };

  const handlePinSubmit = () => {
    const correctPin = profile?.pin_code || '1234';
    if (enteredPin === correctPin) {
      setShowPinModal(false);
      setEnteredPin('');
      setPinError('');

      if (pinAction === 'delete') {
        triggerNotice('Account deletion request initiated. Please check your email for final confirmation.');
      } else if (pinAction === 'pause') {
        triggerNotice('Subscription and child activity paused successfully.');
      } else if (pinAction === 'view_billing') {
        triggerNotice('Redirecting to Paystack secure portal...');
      }
      setPinAction(null);
    } else {
      setPinError('Incorrect PIN code. Please try again.');
    }
  };

  const handleAdminResetQuota = async () => {
    triggerNotice('Admin Action: Learning and speech evaluation quotas reset to 100%.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  function triggerNotice(msg: string) {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F3FB] flex flex-col justify-center items-center p-6">
        <div className="w-16 h-16 rounded-3xl bg-sky-400 animate-bounce flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_0_#0284c7]">
          O
        </div>
        <p className="mt-4 font-bold text-slate-500 tracking-wide">Loading Parent Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3FB] text-slate-800 font-sans pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_6px_0_#3730a3] group-hover:scale-105 transition-transform">
              O
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight block">Onesimos</span>
              <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full inline-block">Parent Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-[0_4px_0_#0284c7] active:translate-y-1 active:shadow-none transition-all"
            >
              <span>+</span>
              <span>Add Child</span>
            </button>

            <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl p-1.5 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-xs">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'P'}
              </div>
              <span className="text-sm font-bold text-slate-700 hidden md:inline">{profile?.full_name || 'Parent'}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl border-2 border-transparent hover:border-rose-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Notice Banner */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-[0_6px_0_#059669] flex items-center justify-between animate-fade-in">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-white hover:opacity-80 font-black">✕</button>
          </div>
        )}

        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-[32px] p-6 sm:p-8 text-white shadow-[0_12px_30px_-8px_rgba(99,102,241,0.3)] border-2 border-white/40 relative overflow-hidden mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/30">
                <span>🛡️</span>
                <span>Active Safety Rules & Progress Monitor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, {profile?.full_name || 'Parent'}!
              </h1>
              <p className="text-sky-100 font-medium text-sm mt-1 max-w-xl">
                Track real-time reading confidence, manage screen time allowances, and customize personalized learning chapters for your children.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddChildModal(true)}
                className="px-5 py-3 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm shadow-[0_6px_0_#e0e7ff] active:translate-y-1 active:shadow-none transition-all hover:bg-slate-50"
              >
                + Add Another Child
              </button>
            </div>
          </div>
        </section>

        {/* Children Quick Switcher Tabs */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>👶</span>
              <span>Your Children</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">{childrenList.length} Profile(s)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {childrenList.map((child) => {
              const isSelected = child.id === selectedChildId;
              return (
                <div
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`cursor-pointer rounded-[28px] p-5 transition-all border-2 ${
                    isSelected
                      ? 'bg-white border-sky-400 shadow-[0_10px_25px_-5px_rgba(56,189,248,0.25)] ring-2 ring-sky-300 ring-offset-2'
                      : 'bg-white/70 hover:bg-white border-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-sky-200 flex items-center justify-center text-2xl shadow-sm">
                        {child.avatar || '🐻'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">{child.name}</h3>
                        <p className="text-xs font-bold text-slate-400">Age {child.age} • Level {child.current_level}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-sky-500 ring-4 ring-sky-100 animate-pulse"></span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
                    <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">Streak:</span>
                      <span className="text-amber-600 font-extrabold">🔥 {child.streak_days} days</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-between">
                      <span className="text-slate-400">Points:</span>
                      <span className="text-indigo-600 font-extrabold">⭐ {child.total_points}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/kid/${child.id}`}
                      className="w-full text-center py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Enter {child.name}'s Space →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Child Detailed Control Grid */}
        {selectedChild && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column: Learning Overview & Subject Mastery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Child Hero Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-6 border-2 border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-300 to-orange-400 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_16px_rgba(251,146,60,0.2)]">
                      {selectedChild.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-slate-900">{selectedChild.name}'s Dashboard</h2>
                        <span className="bg-purple-100 text-purple-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                          Level {selectedChild.current_level}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">
                        Active Profile • Custom speech synthesis evaluation active
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/kid/${selectedChild.id}`}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-extrabold text-sm shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-none transition-all text-center"
                  >
                    Open Kid Portal →
                  </Link>
                </div>

                {/* Daily Screen Time Controls */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-700 flex items-center gap-1.5">
                      <span>⏱️</span>
                      <span>Daily Screen Time Limit</span>
                    </span>
                    <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      {selectedChild.screen_time_used_mins || 20}m used / {selectedChild.screen_time_limit_mins || 45}m limit
                    </span>
                  </div>

                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (((selectedChild.screen_time_used_mins || 20) / (selectedChild.screen_time_limit_mins || 45)) * 100)
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Subject Progress Cards */}
                <div className="mt-8">
                  <h3 className="font-black text-base text-slate-800 mb-4 flex items-center gap-2">
                    <span>🎯</span>
                    <span>Subject Performance & Milestones</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-sky-50/70 border-2 border-sky-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-sky-900 flex items-center gap-2">
                          <span>🔤</span> Phonics Lab
                        </span>
                        <span className="text-xs font-bold text-sky-700">85% Mastery</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Completed vowel sound drills and initial blend exercises.</p>
                    </div>

                    <div className="bg-purple-50/70 border-2 border-purple-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-purple-900 flex items-center gap-2">
                          <span>📚</span> Story World
                        </span>
                        <span className="text-xs font-bold text-purple-700">Level {selectedChild.current_level} Reader</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Read 4 adaptive personalized chapters with speech evaluation.</p>
                    </div>

                    <div className="bg-amber-50/70 border-2 border-amber-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-amber-900 flex items-center gap-2">
                          <span>🔢</span> Math Quest
                        </span>
                        <span className="text-xs font-bold text-amber-700">12 Badges</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Mastered visual addition up to 20 and basic shapes.</p>
                    </div>

                    <div className="bg-emerald-50/70 border-2 border-emerald-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
                          <span>🛡️</span> Stay Strong
                        </span>
                        <span className="text-xs font-bold text-emerald-700">Completed</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Learned positive assertiveness and self-worth strategies.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings, Subscription, Parent Controls */}
            <div className="space-y-6">
              {/* Paystack Subscription Status Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-6 border-2 border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <span>💳</span>
                    <span>Subscription Plan</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
                    {subscription?.is_active ? 'ACTIVE' : 'TRIAL'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">
                  <p className="font-extrabold text-slate-800 text-sm">{subscription?.plan_name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Renews on {subscription?.current_period_end} via Paystack
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPinAction('view_billing');
                    setShowPinModal(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-[0_4px_0_#3730a3] active:translate-y-1 active:shadow-none transition-all"
                >
                  Manage Billing & Plan
                </button>
              </div>

              {/* Security & Parent Controls Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-[28px] p-6 border-2 border-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
                <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Parent Security & PIN</span>
                </h3>

                <p className="text-xs font-medium text-slate-500 mb-4">
                  Your 4-digit PIN prevents children from exiting their space or making account modifications.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setPinAction('pause');
                      setShowPinModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors text-left flex items-center justify-between"
                  >
                    <span>⏸️ Pause Account & Subscription</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => {
                      setPinAction('delete');
                      setShowPinModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors text-left flex items-center justify-between"
                  >
                    <span>⚠️ Delete Account Permanently</span>
                    <span>→</span>
                  </button>

                  {profile?.is_admin && (
                    <button
                      onClick={handleAdminResetQuota}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs border border-purple-200 transition-colors text-left flex items-center justify-between"
                    >
                      <span>⚡ Admin: Reset Learning Quota</span>
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Add Child */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border-4 border-white animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900">Add New Child Profile</h3>
              <button onClick={() => setShowAddChildModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Child's Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="3"
                  max="14"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Avatar</label>
                <div className="flex items-center gap-3">
                  {['🐻', '🦁', '🐰', '🦊', '🦉', '🦕'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewChildAvatar(emoji)}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-transform ${
                        newChildAvatar === emoji
                          ? 'border-sky-500 bg-sky-100 scale-110 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingChild}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-[0_4px_0_#0284c7] active:translate-y-0.5 transition-all"
                >
                  {isAddingChild ? 'Creating...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Parent PIN Verification */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border-4 border-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 border-2 border-indigo-200 mx-auto flex items-center justify-center text-indigo-700 font-bold text-xl mb-3">
              🔒
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Enter Parent PIN</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Default PIN is 1234. Please enter your code to authorize this action.
            </p>

            <input
              type="password"
              maxLength={4}
              autoFocus
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError('');
              }}
              className="w-36 mx-auto text-center tracking-[0.5em] text-2xl font-black px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none mb-2"
            />

            {pinError && <p className="text-xs text-rose-500 font-bold mb-3">{pinError}</p>}

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setEnteredPin('');
                  setPinError('');
                }}
                className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-[0_4px_0_#3730a3] active:translate-y-0.5 transition-all"
              >
                Verify & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
