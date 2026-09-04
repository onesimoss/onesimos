"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#fcf9f5] rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#1e1916] text-center mb-2">Create Account</h1>
        <p className="text-[#8a7e74] text-center mb-6">Start your child's reading journey</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#4a423b] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4a423b] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#dcc8b4] rounded-lg focus:ring-2 focus:ring-[#b28b6a] focus:outline-none"
              required
              minLength={6}
            />
            <p className="text-xs text-[#8a7e74] mt-1">Must be at least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1916] text-white py-3 rounded-lg font-medium hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[#8a7e74] text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#b28b6a] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}