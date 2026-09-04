"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e1916]">📊 Parent Dashboard</h1>
            <p className="text-[#8a7e74]">Welcome, {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/read"
              className="px-4 py-2 bg-[#b28b6a] text-white rounded-full text-sm font-medium hover:shadow-xl transition-all"
            >
              📖 Start Reading
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 border border-[#dcc8b4] text-[#4a423b] rounded-full text-sm font-medium hover:bg-black/5 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#8a7e74]">Stories Read</p>
            <p className="text-3xl font-bold text-[#1e1916]">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#8a7e74]">Words Mastered</p>
            <p className="text-3xl font-bold text-[#1e1916]">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#8a7e74]">Current Level</p>
            <p className="text-3xl font-bold text-[#1e1916]">8</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-[#8a7e74]">Session Count</p>
            <p className="text-3xl font-bold text-[#1e1916]">0</p>
          </div>
        </div>

        {/* Add Child Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1e1916] mb-4">👶 Add Your Child</h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Child's name"
              className="flex-1 min-w-[200px] px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
            />
            <input
              type="number"
              placeholder="Age"
              className="w-20 px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
            />
            <button className="px-6 py-2 bg-[#b28b6a] text-white rounded-lg font-medium hover:shadow-xl transition-all">
              Add Child
            </button>
          </div>
        </div>

        {/* Children List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1e1916] mb-4">Your Children</h2>
          <p className="text-[#8a7e74] text-sm">No children added yet. Add your child above to start tracking progress.</p>
        </div>
      </div>
    </main>
  );
}