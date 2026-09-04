"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Child {
  id: string;
  name: string;
  age: number;
  reading_level: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch children when user is logged in
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
  };

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
        reading_level: 7, // Default reading level
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
    fetchChildren(); // Refresh the list
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

    fetchChildren(); // Refresh the list
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
            <p className="text-3xl font-bold text-[#1e1916]">{children.length}</p>
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

        {/* Children List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#1e1916] mb-4">Your Children</h2>
          
          {children.length === 0 ? (
            <p className="text-[#8a7e74] text-sm">
              No children added yet. Add your child above to start tracking progress.
            </p>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex justify-between items-center p-4 bg-[#f7f2eb] rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-[#1e1916]">{child.name}</p>
                    <p className="text-sm text-[#8a7e74]">
                      Age: {child.age} · Level: {child.reading_level}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/read?child=${child.id}`}
                      className="px-4 py-1 text-sm bg-[#b28b6a] text-white rounded-full hover:shadow-xl transition-all"
                    >
                      Read
                    </Link>
                    <button
                      onClick={() => deleteChild(child.id)}
                      className="px-4 py-1 text-sm border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}