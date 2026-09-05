"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getChildStats } from "@/lib/readingUtils";

interface Child {
  id: string;
  name: string;
  age: number;
  reading_level: number;
  created_at: string;
}

interface ChildStats {
  totalSessions: number;
  totalWordsRead: number;
  totalDuration: number;
  totalStumbles: number;
  uniqueStumbledWords: string[];
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [childStats, setChildStats] = useState<ChildStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching children:", error);
      return;
    }

    setChildren(data || []);
    if (data && data.length > 0 && !selectedChild) {
      setSelectedChild(data[0]);
    }
  };

  const fetchChildStats = async (childId: string) => {
    setIsLoadingStats(true);
    const stats = await getChildStats(childId);
    if (!stats.error) {
      setChildStats({
        totalSessions: stats.totalSessions,
        totalWordsRead: stats.totalWordsRead,
        totalDuration: stats.totalDuration,
        totalStumbles: stats.totalStumbles,
        uniqueStumbledWords: stats.uniqueStumbledWords,
      });
    }
    setIsLoadingStats(false);
  };

  useEffect(() => {
    if (selectedChild) {
      fetchChildStats(selectedChild.id);
    }
  }, [selectedChild]);

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAdding(true);

    if (!childName.trim()) {
      setError("Please enter your child's name");
      setIsAdding(false);
      return;
    }

    if (!childAge || parseInt(childAge) < 1 || parseInt(childAge) > 18) {
      setError("Please enter a valid age (1-18)");
      setIsAdding(false);
      return;
    }

    const { error } = await supabase
      .from("children")
      .insert({
        parent_id: user?.id,
        name: childName.trim(),
        age: parseInt(childAge),
        reading_level: 7,
      });

    if (error) {
      console.error("Error adding child:", error);
      setError("Failed to add child. Please try again.");
      setIsAdding(false);
      return;
    }

    setChildName("");
    setChildAge("");
    setIsAdding(false);
    await fetchChildren();
  };

  const deleteChild = async (childId: string) => {
    if (!confirm("Are you sure you want to remove this child?")) return;

    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", childId);

    if (error) {
      console.error("Error deleting child:", error);
      return;
    }

    if (selectedChild?.id === childId) {
      setSelectedChild(null);
      setChildStats(null);
    }
    await fetchChildren();
  };

  const calculateReadingLevel = (stats: ChildStats | null) => {
    if (!stats || stats.totalSessions === 0) return 7;
    const baseLevel = 7;
    const bonus = Math.floor(stats.totalSessions / 3) * 0.5;
    const level = baseLevel + bonus;
    return Math.min(12, Math.round(level * 10) / 10);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // 🔥 FIX: Logout goes to home page
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
        <div className="text-[#8a7e74]">Loading...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f2eb] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e1916]">📊 Parent Dashboard</h1>
            <p className="text-[#8a7e74]">Welcome, {user.email}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {/* Navigation Buttons */}
            <Link
              href="/phonics"
              className="px-4 py-2 bg-[#dcc8b4] text-[#1e1916] rounded-full text-sm font-medium hover:shadow-xl transition-all"
            >
              🔤 Phonics
            </Link>
            <Link
              href="/character"
              className="px-4 py-2 bg-[#dcc8b4] text-[#1e1916] rounded-full text-sm font-medium hover:shadow-xl transition-all"
            >
              🧠 Character
            </Link>
            {selectedChild && (
              <Link
                href={`/read?child=${selectedChild.id}`}
                className="px-4 py-2 bg-[#b28b6a] text-white rounded-full text-sm font-medium hover:shadow-xl transition-all"
              >
                📖 Read with {selectedChild.name}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#dcc8b4] text-[#4a423b] rounded-full text-sm font-medium hover:bg-black/5 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Child Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1e1916] mb-4">👶 Add Your Child</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={addChild} className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Child's name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className="w-24 px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
              min="1"
              max="18"
              required
            />
            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-2 bg-[#b28b6a] text-white rounded-lg font-medium hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Child"}
            </button>
          </form>
        </div>

        {/* Children List & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1e1916] mb-4">Your Children</h2>
            
            {children.length === 0 ? (
              <p className="text-[#8a7e74] text-sm">
                No children added yet. Add your child above to start tracking progress.
              </p>
            ) : (
              <div className="space-y-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedChild?.id === child.id
                        ? "bg-[#b28b6a] text-white"
                        : "bg-[#f7f2eb] hover:bg-[#dcc8b4]"
                    }`}
                  >
                    <p className={`font-semibold ${selectedChild?.id === child.id ? "text-white" : "text-[#1e1916]"}`}>
                      {child.name}
                    </p>
                    <p className={`text-sm ${selectedChild?.id === child.id ? "text-white/80" : "text-[#8a7e74]"}`}>
                      Age: {child.age} · Level: {child.reading_level}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChild(child.id);
                      }}
                      className={`text-xs mt-1 ${
                        selectedChild?.id === child.id ? "text-white/70 hover:text-white" : "text-red-400 hover:text-red-600"
                      } transition-colors`}
                    >
                      Remove
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#1e1916] mb-4">
              {selectedChild ? `${selectedChild.name}'s Progress` : "Select a Child"}
            </h2>
            
            {!selectedChild ? (
              <p className="text-[#8a7e74] text-sm">Select a child from the list to view their progress.</p>
            ) : isLoadingStats ? (
              <p className="text-[#8a7e74]">Loading stats...</p>
            ) : childStats ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#f7f2eb] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#1e1916]">{childStats.totalSessions}</p>
                    <p className="text-xs text-[#8a7e74]">Sessions</p>
                  </div>
                  <div className="bg-[#f7f2eb] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#1e1916]">{childStats.totalWordsRead}</p>
                    <p className="text-xs text-[#8a7e74]">Words Read</p>
                  </div>
                  <div className="bg-[#f7f2eb] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#1e1916]">{formatDuration(childStats.totalDuration)}</p>
                    <p className="text-xs text-[#8a7e74]">Reading Time</p>
                  </div>
                  <div className="bg-[#f7f2eb] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#1e1916]">{calculateReadingLevel(childStats)}</p>
                    <p className="text-xs text-[#8a7e74]">Reading Level</p>
                  </div>
                </div>

                {childStats.uniqueStumbledWords.length > 0 && (
                  <div className="border-t border-[#f0e8e0] pt-4">
                    <p className="text-sm font-medium text-[#1e1916] mb-2">📝 Words to Practice</p>
                    <div className="flex flex-wrap gap-2">
                      {childStats.uniqueStumbledWords.slice(0, 20).map((word, i) => (
                        <span key={i} className="px-3 py-1 bg-[#dcc8b4] bg-opacity-20 rounded-full text-sm text-[#b28b6a]">
                          {word}
                        </span>
                      ))}
                      {childStats.uniqueStumbledWords.length > 20 && (
                        <span className="px-3 py-1 text-sm text-[#8a7e74]">
                          +{childStats.uniqueStumbledWords.length - 20} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Link
                    href={`/read?child=${selectedChild.id}`}
                    className="inline-block px-6 py-3 bg-[#b28b6a] text-white rounded-full text-sm font-medium hover:shadow-xl transition-all"
                  >
                    📖 Read with {selectedChild.name}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8a7e74] mb-4">No reading data yet for {selectedChild.name}.</p>
                <Link
                  href={`/read?child=${selectedChild.id}`}
                  className="inline-block px-6 py-3 bg-[#b28b6a] text-white rounded-full text-sm font-medium hover:shadow-xl transition-all"
                >
                  📖 Start First Reading Session
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}