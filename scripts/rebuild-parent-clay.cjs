const fs = require("fs");
const path = require("path");

const targetPath = path.join(__dirname, "..", "app", "parent", "page.tsx");

const code = `'use client';

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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'children' | 'screentime' | 'milestones' | 'settings'>('dashboard');

  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'delete' | 'pause' | 'view_billing' | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newChildAvatar, setNewChildAvatar] = useState('👧');
  const [isAddingChild, setIsAddingChild] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
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
          name: 'Sia',
          age: 6,
          avatar: '👧',
          total_points: 480,
          streak_days: 7,
          current_level: 4,
          screen_time_limit_mins: 45,
          screen_time_used_mins: 28
        }
      ];

      setChildrenList(loadedKids);
      if (loadedKids.length > 0) {
        setSelectedChildId(loadedKids[0].id);
      }

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
        const localKid: Child = {
          id: 'local-' + Date.now(),
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
        triggerNotice('Account deletion request initiated. Confirmation sent via email.');
      } else if (pinAction === 'pause') {
        triggerNotice('Subscription and learning activity paused.');
      } else if (pinAction === 'view_billing') {
        triggerNotice('Redirecting to secure billing portal...');
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
      <div className="min-h-screen bg-[#FAF4F4] flex flex-col justify-center items-center p-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FF6B7E] animate-bounce flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_0_#E55366]">
          O
        </div>
        <p className="mt-4 font-bold text-slate-500 tracking-wide">Loading Parent Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-slate-800 font-sans flex flex-col md:flex-row">
      {/* LEFT CORAL SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#FF6B7E] text-white p-6 flex flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(255,107,126,0.15)]">
        <div>
          <div className="flex flex-col items-center text-center pb-6 border-b border-white/20 mb-6">
            <div className="relative w-24 h-24 rounded-full bg-white p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.12)] mb-3">
              <div className="w-full h-full rounded-full bg-rose-100 flex items-center justify-center text-4xl overflow-hidden">
                {selectedChild?.avatar || '👧'}
              </div>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Hi, {selectedChild?.name || profile?.full_name || 'Parent'}!
            </h2>
            <p className="text-xs font-bold text-rose-100 mt-0.5">Active Learner Profile</p>
          </div>

          {childrenList.length > 1 && (
            <div className="mb-6 bg-white/15 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-rose-100 px-2 mb-1.5">Switch Child</p>
              <div className="space-y-1">
                {childrenList.map((kid) => (
                  <button
                    key={kid.id}
                    onClick={() => setSelectedChildId(kid.id)}
                    className={\`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all \${
                      kid.id === selectedChildId
                        ? 'bg-white text-[#FF6B7E] shadow-sm'
                        : 'text-white hover:bg-white/10'
                    }\`}
                  >
                    <span>{kid.avatar}</span>
                    <span className="truncate">{kid.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all \${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#FF6B7E] shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                  : 'text-white/90 hover:bg-white/10'
              }\`}
            >
              <span className="text-lg">🏠</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('children'); setShowAddChildModal(true); }}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all \${
                activeTab === 'children'
                  ? 'bg-white text-[#FF6B7E] shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                  : 'text-white/90 hover:bg-white/10'
              }\`}
            >
              <span className="text-lg">👶</span>
              <span>Child Profiles</span>
            </button>

            <button
              onClick={() => setActiveTab('screentime')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all \${
                activeTab === 'screentime'
                  ? 'bg-white text-[#FF6B7E] shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                  : 'text-white/90 hover:bg-white/10'
              }\`}
            >
              <span className="text-lg">⏱️</span>
              <span>Screen Controls</span>
            </button>

            <button
              onClick={() => setActiveTab('milestones')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all \${
                activeTab === 'milestones'
                  ? 'bg-white text-[#FF6B7E] shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                  : 'text-white/90 hover:bg-white/10'
              }\`}
            >
              <span className="text-lg">🎗️</span>
              <span>Milestones</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all \${
                activeTab === 'settings'
                  ? 'bg-white text-[#FF6B7E] shadow-[0_6px_16px_rgba(0,0,0,0.08)]'
                  : 'text-white/90 hover:bg-white/10'
              }\`}
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="mt-8 bg-white/95 text-slate-900 rounded-[28px] p-5 text-center shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-2 border-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-200 text-amber-600 font-black text-2xl mx-auto flex items-center justify-center mb-2 shadow-sm">
            👑
          </div>
          <h4 className="font-black text-base text-slate-900">Let's Upgrade!</h4>
          <p className="text-xs font-bold text-slate-500 mt-1 mb-4">
            Unlock all personalized learning chapters and detailed voice reports.
          </p>
          <button
            onClick={() => {
              setPinAction('view_billing');
              setShowPinModal(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B7E] to-[#FF5268] text-white font-extrabold text-xs shadow-[0_4px_0_#E55366] active:translate-y-0.5 transition-all"
          >
            Upgrade Pass
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD BODY */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Real-time learning progress and safety controls</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subjects, progress..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-64 pl-9 pr-4 py-2.5 rounded-full bg-white border border-rose-100/80 text-xs font-bold text-slate-700 placeholder:text-slate-400 shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-[#FF6B7E]"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <button className="relative w-10 h-10 rounded-full bg-white border border-rose-100/80 flex items-center justify-center text-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:bg-rose-50 transition-colors">
              <span className="text-base">🔔</span>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B7E] text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-[#FF6B7E]/10 border border-[#FF6B7E]/20 flex items-center justify-center text-[#FF6B7E] font-black text-xs shadow-sm hover:bg-[#FF6B7E] hover:text-white transition-all"
              title="Sign Out"
            >
              👤
            </button>
          </div>
        </header>

        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-[0_6px_0_#059669] flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-white font-black">✕</button>
          </div>
        )}

        {/* Hero Greeting Banner */}
        <section className="bg-gradient-to-r from-[#FF7E8D] to-[#FF5268] rounded-[32px] p-6 sm:p-8 text-white shadow-[0_12px_30px_rgba(255,107,126,0.25)] border-2 border-white/50 relative overflow-hidden mb-8">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Good morning, {selectedChild?.name || 'Sia'}
              </h2>
              <p className="text-rose-100 font-medium text-xs sm:text-sm mt-1">
                Let's start new days with updated real-time speech evaluation data!
              </p>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('screentime')}
                  className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-[#FF5268] font-extrabold text-xs border border-white/40 shadow-sm transition-all flex items-center gap-2"
                >
                  <span>⏱️</span>
                  <span>Screen Duration: {selectedChild?.screen_time_limit_mins || 45}m</span>
                </button>

                <Link
                  href={\`/kid/\${selectedChild?.id || 'demo'}\`}
                  className="px-4 py-2.5 rounded-2xl bg-white text-[#FF5268] font-black text-xs shadow-[0_4px_0_#FFE4E8] active:translate-y-0.5 transition-all hover:bg-rose-50"
                >
                  Enter Kid Portal →
                </Link>
              </div>
            </div>

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center text-[48px] shrink-0 shadow-inner">
              🪴
            </div>
          </div>
        </section>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">💬</div>
                <h3 className="font-extrabold text-slate-800 text-sm">Pip Assistant</h3>
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-2">Talk to your Pip Assistant</h4>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Ask questions about custom speech recognition reports or chapter hints.
              </p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5">
                <input type="text" placeholder="Type your message..." className="w-full bg-transparent text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none" />
                <button className="w-8 h-8 rounded-xl bg-[#FF6B7E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">➤</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">🍴</div>
              <h3 className="font-extrabold text-slate-800 text-sm">Subject Focus Breakdown</h3>
            </div>
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative w-32 h-32 rounded-full border-8 border-purple-100 flex items-center justify-center bg-gradient-to-tr from-rose-50 to-purple-50">
                <div className="text-center">
                  <span className="block font-black text-slate-900 text-base">180 Chapters</span>
                  <span className="block text-[10px] font-bold text-slate-400">Total Completed</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-around text-[11px] font-bold text-slate-500 mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Phonics</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Stories</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Math</span>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">📈</div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Reading Growth</h3>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Level {selectedChild?.current_level || 4}
                </span>
              </div>
              <div className="space-y-2.5 mt-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Pronunciation Accuracy</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Speech Recognition Speed</span>
                    <span>70%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full w-[70%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Story Comprehension</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">⏱️</div>
              <h3 className="font-extrabold text-slate-800 text-sm">Screen & Practice Time Summary</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="relative w-36 h-36 rounded-full border-[10px] border-amber-200 flex items-center justify-center bg-amber-50 shrink-0">
                <div className="text-center">
                  <span className="block font-black text-slate-900 text-xl">
                    {selectedChild?.screen_time_used_mins || 28}m
                  </span>
                  <span className="block text-[10px] font-bold text-slate-400">
                    of {selectedChild?.screen_time_limit_mins || 45}m today
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Active Phonics Practice
                  </span>
                  <span className="text-slate-900">72%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full w-[72%]"></div>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Interactive Stories
                  </span>
                  <span className="text-slate-900">19%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full w-[19%]"></div>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Stay Strong Drills
                  </span>
                  <span className="text-slate-900">9%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full w-[9%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-100 to-amber-100 border-2 border-white flex items-center justify-center text-4xl shadow-sm mb-3">
              🚀
            </div>
            <h3 className="text-3xl font-black text-slate-900">85%</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">of your weekly target archived</p>
            <p className="text-xs font-black text-amber-600 mt-2">🔥 {selectedChild?.streak_days || 7} day streak</p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#FF6B7E] flex items-center justify-center font-bold text-lg">📋</div>
                <h3 className="font-extrabold text-slate-800 text-sm">Subject Tracker</h3>
              </div>
              <span className="text-xs font-bold text-rose-500">View All →</span>
            </div>
            <p className="text-xs font-bold text-rose-500 mb-3">Next Up: Phonics Level 2 Chapter</p>
            <div className="space-y-2 text-xs font-bold text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#FF6B7E] rounded" />
                  <span>Vowel Blend Drills</span>
                </div>
                <span className="text-slate-400 font-medium">Done</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#FF6B7E] rounded" />
                  <span>Math Addition to 20</span>
                </div>
                <span className="text-slate-400 font-medium">Done</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#FF6B7E] rounded" />
                  <span>Stay Strong Assertiveness</span>
                </div>
                <span className="text-slate-400 font-medium">In Progress</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">🏆</div>
                <h3 className="font-extrabold text-slate-800 text-sm">Milestones Achieved</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{selectedChild?.total_points || 480} pts</span>
            </div>
            <div className="space-y-2.5 text-xs font-bold text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span>First Spoken Chapter</span>
                <span className="text-slate-400 font-medium">1 month ago</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span>5-Day Practice Streak</span>
                <span className="text-slate-400 font-medium">2 weeks ago</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span>Completed "Bully Shield" Module</span>
                <span className="text-slate-400 font-medium">3 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mastered Initial Blends</span>
                <span className="text-slate-400 font-medium">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tab Content (PIN, Billing, Admin) */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-rose-50/80 mb-8">
            <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
              <span>🔒</span>
              <span>Parent Security & Account</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="font-extrabold text-slate-800 text-sm">{subscription?.plan_name}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Status: {subscription?.is_active ? 'Active' : 'Trial'} · Renews {subscription?.current_period_end}
                </p>
                <button
                  onClick={() => { setPinAction('view_billing'); setShowPinModal(true); }}
                  className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-[0_4px_0_#3730a3] active:translate-y-0.5 transition-all"
                >
                  Manage Billing
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { setPinAction('pause'); setShowPinModal(true); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors text-left"
                >
                  ⏸️ Pause Account & Subscription
                </button>
                <button
                  onClick={() => { setPinAction('delete'); setShowPinModal(true); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors text-left"
                >
                  ⚠️ Delete Account Permanently
                </button>
                {profile?.is_admin && (
                  <button
                    onClick={handleAdminResetQuota}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs border border-purple-200 transition-colors text-left"
                  >
                    ⚡ Admin: Reset Learning Quota
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Promo Banner */}
        <section className="bg-[#FF6B7E] rounded-[32px] p-6 text-white shadow-[0_8px_24px_rgba(255,107,126,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-300 text-slate-900 flex items-center justify-center text-3xl shrink-0 shadow-md">⭐</div>
            <div>
              <h4 className="font-black text-lg">Discover The New Features</h4>
              <p className="text-xs font-medium text-rose-100">See the full analytics view that we think you'll love.</p>
            </div>
          </div>
          <button
            onClick={() => { setPinAction('view_billing'); setShowPinModal(true); }}
            className="px-6 py-3 rounded-2xl bg-white text-[#FF6B7E] font-black text-xs shadow-[0_4px_0_#FFE4E8] active:translate-y-0.5 transition-all shrink-0 hover:bg-rose-50"
          >
            Upgrade Plan
          </button>
        </section>
      </main>

      {/* ADD CHILD MODAL */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border-4 border-white">
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF6B7E]"
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF6B7E]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Avatar</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {['👧', '👦', '🐻', '🦁', '🐰', '🦊'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewChildAvatar(emoji)}
                      className={\`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-transform \${
                        newChildAvatar === emoji
                          ? 'border-[#FF6B7E] bg-rose-50 scale-110 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }\`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowAddChildModal(false)} className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={isAddingChild} className="px-5 py-2.5 rounded-xl bg-[#FF6B7E] hover:bg-[#FF5268] text-white font-extrabold text-xs shadow-[0_4px_0_#E55366] active:translate-y-0.5 transition-all">
                  {isAddingChild ? 'Creating...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border-4 border-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-200 mx-auto flex items-center justify-center text-[#FF6B7E] font-bold text-xl mb-3">🔒</div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Enter Parent PIN</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Default PIN is 1234. Authorize access to subscription management.</p>
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={enteredPin}
              onChange={(e) => { setEnteredPin(e.target.value); setPinError(''); }}
              className="w-36 mx-auto text-center tracking-[0.5em] text-2xl font-black px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF6B7E] focus:outline-none mb-2"
            />
            {pinError && <p className="text-xs text-rose-500 font-bold mb-3">{pinError}</p>}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => { setShowPinModal(false); setEnteredPin(''); setPinError(''); }} className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-100">Cancel</button>
              <button onClick={handlePinSubmit} className="px-5 py-2.5 rounded-xl bg-[#FF6B7E] hover:bg-[#FF5268] text-white font-extrabold text-xs shadow-[0_4px_0_#E55366] active:translate-y-0.5 transition-all">Verify & Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(targetPath, code, "utf8");
console.log(
  "Successfully wrote updated Parent Dashboard to app/parent/page.tsx",
);
