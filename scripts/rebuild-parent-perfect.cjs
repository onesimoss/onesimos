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
  favorite_color?: string;
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

export default function ParentGrowthCompassPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Active View Tab: 'overview' | 'screentime' | 'milestones' | 'settings'
  const [activeTab, setActiveTab] = useState<'overview' | 'screentime' | 'milestones' | 'settings'>('overview');

  // Mobile Child Selector Dropdown state
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  // Modals & UI States
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'delete' | 'pause' | 'view_billing' | 'upgrade' | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Pip Chat Assistant Drawer (Mobile & Desktop)
  const [isPipChatOpen, setIsPipChatOpen] = useState(false);
  const [pipMessages, setPipMessages] = useState<Array<{ sender: 'pip' | 'parent'; text: string }>>([
    { sender: 'pip', text: "Hello! I am Pip. Ask me anything about your child's learning journey or recent practice sessions." }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Interactive Living Plant State
  const [plantWateredCount, setPlantWateredCount] = useState(3);
  const [plantNotice, setPlantNotice] = useState<string | null>(null);

  // Screen Time Control Slider State
  const [customScreenTimeLimit, setCustomScreenTimeLimit] = useState(45);

  // Form State for Adding Child
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number>(6);
  const [newChildAvatar, setNewChildAvatar] = useState('👧');
  const [newChildColor, setNewChildColor] = useState('rose');
  const [isAddingChild, setIsAddingChild] = useState(false);

  // Global Notice Toast
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

      const { data: kidsData } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      const loadedKids: Child[] = (kidsData && kidsData.length > 0) ? kidsData : [
        {
          id: 'demo-child-1',
          name: 'Sia',
          age: 6,
          avatar: '👧',
          favorite_color: 'rose',
          total_points: 480,
          streak_days: 7,
          current_level: 4,
          screen_time_limit_mins: 45,
          screen_time_used_mins: 28
        },
        {
          id: 'demo-child-2',
          name: 'Leo',
          age: 8,
          avatar: '🦁',
          favorite_color: 'sky',
          total_points: 620,
          streak_days: 12,
          current_level: 5,
          screen_time_limit_mins: 60,
          screen_time_used_mins: 35
        }
      ];

      setChildrenList(loadedKids);
      if (loadedKids.length > 0) {
        setSelectedChildId(loadedKids[0].id);
        setCustomScreenTimeLimit(loadedKids[0].screen_time_limit_mins || 45);
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
      console.error('Failed to load Parent Space:', err);
    } finally {
      setLoading(false);
    }
  }

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  // Accent Color Theme Map based on active child's favorite color
  const colorThemes: Record<string, { bg: string; text: string; border: string; banner: string }> = {
    rose: { bg: 'bg-[#FF6B7E]', text: 'text-[#FF6B7E]', border: 'border-[#FF6B7E]', banner: 'from-[#FF7E8D] to-[#FF5268]' },
    sky: { bg: 'bg-[#38BDF8]', text: 'text-[#0284C7]', border: 'border-[#38BDF8]', banner: 'from-[#38BDF8] to-[#0284C7]' },
    purple: { bg: 'bg-[#A855F7]', text: 'text-[#7E22CE]', border: 'border-[#A855F7]', banner: 'from-[#C084FC] to-[#7E22CE]' },
    emerald: { bg: 'bg-[#10B981]', text: 'text-[#047857]', border: 'border-[#10B981]', banner: 'from-[#34D399] to-[#047857]' },
    amber: { bg: 'bg-[#F59E0B]', text: 'text-[#B45309]', border: 'border-[#F59E0B]', banner: 'from-[#FBBF24] to-[#B45309]' }
  };

  const activeTheme = colorThemes[selectedChild?.favorite_color || 'rose'] || colorThemes.rose;

  const handleWaterPlant = () => {
    setPlantWateredCount(prev => prev + 1);
    setPlantNotice(\`You watered \${selectedChild?.name || 'child'}'s growth plant! Encouragement sent to Pip.\`);
    setTimeout(() => setPlantNotice(null), 3500);
  };

  const handleSendPipMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setPipMessages(prev => [...prev, { sender: 'parent', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setPipMessages(prev => [
        ...prev,
        {
          sender: 'pip',
          text: \`\${selectedChild?.name || 'Your child'} is making steady progress! In their last practice, they spent most of their time on Phonics blends and showed great confidence.\`
        }
      ]);
    }, 1000);
  };

  const handleSaveScreenTime = async () => {
    if (!selectedChild) return;
    try {
      await supabase
        .from('children')
        .update({ screen_time_limit_mins: customScreenTimeLimit })
        .eq('id', selectedChild.id);

      setChildrenList(prev =>
        prev.map(c => c.id === selectedChild.id ? { ...c, screen_time_limit_mins: customScreenTimeLimit } : c)
      );
      triggerNotice(\`Screen time limit updated to \${customScreenTimeLimit} minutes daily for \${selectedChild.name}.\`);
    } catch (err) {
      console.error('Failed to update screen time:', err);
    }
  };

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
        favorite_color: newChildColor,
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

      if (error || !data) {
        const localKid: Child = {
          id: 'local-' + Date.now(),
          ...newKidObj,
          screen_time_used_mins: 0
        };
        setChildrenList(prev => [...prev, localKid]);
        setSelectedChildId(localKid.id);
      } else {
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
        triggerNotice('Account deletion request initiated. Email confirmation sent.');
      } else if (pinAction === 'pause') {
        triggerNotice('Subscription and learning activity paused.');
      } else if (pinAction === 'view_billing' || pinAction === 'upgrade') {
        triggerNotice('Redirecting to Paystack secure checkout portal...');
      }
      setPinAction(null);
    } else {
      setPinError('Incorrect PIN code. Please try again.');
    }
  };

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4F4] flex flex-col justify-center items-center p-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FF6B7E] animate-bounce flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_0_#E55366]">
          O
        </div>
        <p className="mt-4 font-bold text-slate-500 tracking-wide">Loading Growth Compass...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4F4] text-slate-800 font-sans pb-24 md:pb-12">
      {/* Top Mobile/Desktop Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                O
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg hidden sm:inline">Onesimos</span>
            </Link>

            {/* Active View Title */}
            <span className="text-xs font-black text-slate-400 border-l border-slate-200 pl-3">
              Growth Compass
            </span>
          </div>

          {/* Child Switcher (Mobile Dropdown + Desktop Pills) */}
          <div className="flex items-center gap-3">
            {/* Mobile Dropdown Button */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setShowChildDropdown(!showChildDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-800 shadow-sm"
              >
                <span>{selectedChild?.avatar}</span>
                <span className="truncate max-w-[80px]">{selectedChild?.name}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {showChildDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 z-50 animate-scale-up">
                  <p className="text-[10px] font-black text-slate-400 px-2 py-1 uppercase tracking-wider">Switch Learner</p>
                  {childrenList.map(kid => (
                    <button
                      key={kid.id}
                      onClick={() => {
                        setSelectedChildId(kid.id);
                        setCustomScreenTimeLimit(kid.screen_time_limit_mins || 45);
                        setShowChildDropdown(false);
                      }}
                      className={\`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold text-left transition-colors \${
                        kid.id === selectedChildId ? 'bg-rose-50 text-[#FF6B7E]' : 'text-slate-700 hover:bg-slate-50'
                      }\`}
                    >
                      <span>{kid.avatar}</span>
                      <span>{kid.name}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowChildDropdown(false);
                      setShowAddChildModal(true);
                    }}
                    className="w-full mt-1 pt-2 border-t border-slate-100 text-center text-xs font-black text-[#FF6B7E] hover:underline"
                  >
                    + Add New Profile
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Child Switcher Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              {childrenList.map(kid => (
                <button
                  key={kid.id}
                  onClick={() => {
                    setSelectedChildId(kid.id);
                    setCustomScreenTimeLimit(kid.screen_time_limit_mins || 45);
                  }}
                  className={\`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all \${
                    kid.id === selectedChildId
                      ? 'bg-white text-slate-900 shadow-sm scale-105'
                      : 'text-slate-500 hover:text-slate-800'
                  }\`}
                >
                  <span>{kid.avatar}</span>
                  <span>{kid.name}</span>
                </button>
              ))}
              <button
                onClick={() => setShowAddChildModal(true)}
                className="w-7 h-7 rounded-xl bg-white hover:bg-rose-50 text-[#FF6B7E] font-black text-sm flex items-center justify-center border border-slate-200 shadow-sm"
                title="Add Child Profile"
              >
                +
              </button>
            </div>

            {/* Account & Sign Out */}
            <button
              onClick={handleSignOut}
              className="text-xs font-extrabold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* Global Toast Notice */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-white font-black">✕</button>
          </div>
        )}

        {/* Hero Banner with Active Child Theme & Living Plant */}
        <section className={\`bg-gradient-to-r \${activeTheme.banner} rounded-[32px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-6 transition-all duration-500\`}>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/30">
                <span>🛡️</span>
                <span>Active Learner: {selectedChild?.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {selectedChild?.name}'s Journey
              </h1>
              <p className="text-white/90 font-medium text-xs sm:text-sm mt-1">
                Real-time growth progress, speech recognition updates, and encouragement.
              </p>

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('screentime')}
                  className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 font-extrabold text-xs border border-white/40 shadow-sm transition-all flex items-center gap-2"
                >
                  <span>⏱️</span>
                  <span>Daily Limit: {selectedChild?.screen_time_limit_mins || 45}m</span>
                </button>

                <Link
                  href={\`/kid/\${selectedChild?.id || 'demo'}\`}
                  className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-slate-50 transition-all"
                >
                  Enter {selectedChild?.name}'s Space
                </Link>
              </div>
            </div>

            {/* Interactive Living Growth Plant */}
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-4 flex flex-col items-center justify-center text-center shrink-0 w-36 sm:w-40 shadow-inner">
              <div className="text-5xl mb-1 animate-pulse">🪴</div>
              <span className="text-xs font-black text-white">Growth Plant</span>
              <span className="text-[10px] font-extrabold text-white/80">Watered {plantWateredCount} times</span>
              <button
                onClick={handleWaterPlant}
                className="mt-2.5 px-3 py-1 rounded-xl bg-white text-slate-900 font-black text-[11px] shadow-sm hover:bg-rose-50 transition-all active:scale-95"
              >
                💧 Water Plant
              </button>
            </div>
          </div>
        </section>

        {plantNotice && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-400 text-slate-900 font-extrabold text-xs shadow-sm text-center animate-fade-in">
            {plantNotice}
          </div>
        )}

        {/* Clean Top View Tabs (Overview / Screen Controls / Milestones / Settings) */}
        <nav className="flex items-center gap-2 mb-8 border-b border-slate-200/80 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={\`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all \${
              activeTab === 'overview'
                ? \`bg-white \${activeTheme.text} shadow-md border-2 \${activeTheme.border}\`
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }\`}
          >
            📊 Growth Overview
          </button>

          <button
            onClick={() => setActiveTab('screentime')}
            className={\`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all \${
              activeTab === 'screentime'
                ? \`bg-white \${activeTheme.text} shadow-md border-2 \${activeTheme.border}\`
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }\`}
          >
            ⏱️ Screen Time & Limits
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={\`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all \${
              activeTab === 'milestones'
                ? \`bg-white \${activeTheme.text} shadow-md border-2 \${activeTheme.border}\`
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }\`}
          >
            🏆 Milestones & Badges
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={\`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all \${
              activeTab === 'settings'
                ? \`bg-white \${activeTheme.text} shadow-md border-2 \${activeTheme.border}\`
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
            }\`}
          >
            ⚙️ Account & Security
          </button>
        </nav>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Subject Multi-Ring & Skill Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Multi-Subject Engagement Rings */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-sm mb-1">Subject Engagement</h3>
                <p className="text-xs text-slate-400 font-medium mb-4">Time and interest per topic</p>

                <div className="flex flex-col items-center justify-center my-4">
                  <div className="relative w-36 h-36 rounded-full border-[10px] border-indigo-100 flex items-center justify-center bg-indigo-50/50">
                    <div className="text-center">
                      <span className="block font-black text-slate-900 text-xl">180</span>
                      <span className="block text-[10px] font-bold text-slate-400">Chapters Completed</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-extrabold text-slate-600 mt-2">
                  <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Phonics Lab
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Stories
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Math Quest
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Stay Strong
                  </div>
                </div>
              </div>

              {/* Card 2: Skill Confidence Across Subjects */}
              <div className="md:col-span-2 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm">Skill Confidence</h3>
                    <p className="text-xs text-slate-400 font-medium">Evaluation from speech and practice sessions</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Level {selectedChild?.current_level || 4}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                      <span>Phonics Pronunciation Accuracy</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[85%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                      <span>Interactive Story Comprehension</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full w-[72%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Math Quest Visual Addition</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[90%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Stay Strong Self-Worth Assertiveness</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full w-[80%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Progress Banner */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shrink-0">
                  🚀
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    {selectedChild?.name} reached 85% of her weekly discovery goal!
                  </h4>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">
                    🔥 {selectedChild?.streak_days || 7} day active practice streak
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPipChatOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all shrink-0"
              >
                Ask Pip About Progress
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SCREEN TIME & LIMITS */}
        {activeTab === 'screentime' && (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">Screen Time Allowance</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Set healthy daily screen time limits for {selectedChild?.name}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Gauge */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <div className="relative w-40 h-40 mx-auto rounded-full border-[12px] border-sky-200 flex items-center justify-center bg-white shadow-sm mb-4">
                  <div>
                    <span className="block text-3xl font-black text-slate-900">
                      {selectedChild?.screen_time_used_mins || 28}m
                    </span>
                    <span className="block text-xs font-extrabold text-slate-400">
                      used of {customScreenTimeLimit}m today
                    </span>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  {Math.max(0, customScreenTimeLimit - (selectedChild?.screen_time_used_mins || 28))} minutes remaining today
                </p>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-2">
                    Daily Limit Slider: <span className="text-sky-600 font-black">{customScreenTimeLimit} Minutes</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={customScreenTimeLimit}
                    onChange={(e) => setCustomScreenTimeLimit(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-400 mt-1">
                    <span>15 mins</span>
                    <span>45 mins</span>
                    <span>120 mins</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveScreenTime}
                    className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Save Screen Limit for {selectedChild?.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MILESTONES & BADGES */}
        {activeTab === 'milestones' && (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Milestones Achieved</h3>
                <p className="text-xs text-slate-400 font-medium">Automatic badges earned during practice sessions</p>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                ⭐ {selectedChild?.total_points || 480} Total Points
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">First Spoken Chapter</h4>
                    <p className="text-xs text-slate-400">Speech evaluation completed with 85%+ accuracy</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">1 month ago</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">5-Day Practice Streak</h4>
                    <p className="text-xs text-slate-400">Consistent daily discovery sessions</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">2 weeks ago</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Stay Strong Mastery</h4>
                    <p className="text-xs text-slate-400">Completed assertiveness and bullying awareness drills</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">3 days ago</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔤</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Initial Blend Champion</h4>
                    <p className="text-xs text-slate-400">Mastered vowel sounds in Phonics Lab</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">Yesterday</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT & SECURITY */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">Parent Security & Subscription</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Manage parent PIN security, Paystack billing, and account options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-slate-800 text-sm">{subscription?.plan_name}</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {subscription?.is_active ? 'ACTIVE' : 'TRIAL'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  Renews on {subscription?.current_period_end} via Paystack
                </p>

                <button
                  onClick={() => {
                    setPinAction('upgrade');
                    setShowPinModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FF6B7E] hover:bg-[#FF5268] text-white font-black text-xs shadow-md transition-all"
                >
                  Upgrade Pass or Manage Subscription
                </button>
              </div>

              {/* Security Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPinAction('pause');
                    setShowPinModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>⏸️ Pause Account Activity</span>
                  <span>Authorize</span>
                </button>

                <button
                  onClick={() => {
                    setPinAction('delete');
                    setShowPinModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors text-left flex items-center justify-between"
                >
                  <span>⚠️ Delete Account Permanently</span>
                  <span>Authorize</span>
                </button>

                {profile?.is_admin && (
                  <button
                    onClick={() => triggerNotice('Admin Action: Learning quota reset to 100%.')}
                    className="w-full py-3 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs border border-purple-200 transition-colors text-left flex items-center justify-between"
                  >
                    <span>⚡ Admin: Reset Learning Quotas</span>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Pip Chat Assistant Drawer (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isPipChatOpen ? (
          <button
            onClick={() => setIsPipChatOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 text-white font-black text-xs shadow-2xl hover:scale-105 transition-all border-2 border-slate-700"
          >
            <span className="text-base">💬</span>
            <span>Talk to Pip</span>
          </button>
        ) : (
          <div className="bg-white rounded-3xl w-80 sm:w-96 shadow-2xl border-2 border-slate-200 overflow-hidden animate-scale-up">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐣</span>
                <div>
                  <h4 className="font-extrabold text-xs">Pip Companion Assistant</h4>
                  <p className="text-[10px] text-slate-300">Positive growth updates for {selectedChild?.name}</p>
                </div>
              </div>
              <button onClick={() => setIsPipChatOpen(false)} className="text-white hover:text-slate-300 font-black text-sm">
                ✕
              </button>
            </div>

            <div className="p-4 h-64 overflow-y-auto space-y-3 text-xs">
              {pipMessages.map((msg, i) => (
                <div
                  key={i}
                  className={\`p-3 rounded-2xl max-w-[85%] font-medium \${
                    msg.sender === 'parent'
                      ? 'bg-rose-50 text-rose-900 ml-auto border border-rose-100'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }\`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendPipMessage} className="p-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Pip a question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none"
              />
              <button type="submit" className="px-3 py-2 rounded-xl bg-slate-900 text-white font-black text-xs">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD CHILD */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border-4 border-white animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900">Add Learner Profile</h3>
              <button onClick={() => setShowAddChildModal(false)} className="text-slate-400 font-bold text-lg">✕</button>
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Avatar</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['👧', '👦', '🐻', '🦁', '🐰', '🦊'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewChildAvatar(emoji)}
                      className={\`w-11 h-11 rounded-2xl text-xl flex items-center justify-center border-2 transition-transform \${
                        newChildAvatar === emoji ? 'border-rose-500 bg-rose-50 scale-110' : 'border-slate-200 bg-slate-50'
                      }\`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Favorite Accent Color</label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'rose', bg: 'bg-[#FF6B7E]' },
                    { id: 'sky', bg: 'bg-[#38BDF8]' },
                    { id: 'purple', bg: 'bg-[#A855F7]' },
                    { id: 'emerald', bg: 'bg-[#10B981]' },
                    { id: 'amber', bg: 'bg-[#F59E0B]' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewChildColor(c.id)}
                      className={\`w-8 h-8 rounded-full \${c.bg} border-2 \${
                        newChildColor === c.id ? 'border-slate-900 scale-110' : 'border-transparent'
                      }\`}
                    />
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
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md"
                >
                  {isAddingChild ? 'Saving...' : 'Save Learner Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PARENT PIN SECURITY */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border-4 border-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-200 mx-auto flex items-center justify-center text-[#FF6B7E] font-bold text-xl mb-3">
              🔒
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Enter Parent PIN</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Default PIN is 1234. Authorize action.
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
              className="w-36 mx-auto text-center tracking-[0.5em] text-2xl font-black px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#FF6B7E] focus:outline-none mb-2"
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
                className="px-5 py-2.5 rounded-xl bg-[#FF6B7E] hover:bg-[#FF5268] text-white font-extrabold text-xs shadow-md"
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
`;

fs.writeFileSync(targetPath, code, "utf8");
console.log("Successfully wrote updated Parent Space to app/parent/page.tsx");
