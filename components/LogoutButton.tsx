"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-5 py-2 text-sm font-bold text-bark-muted
                 bg-cream border border-border rounded-full
                 hover:bg-red-50 hover:text-red-500 hover:border-red-200
                 transition-all duration-200"
    >
      Log Out
    </button>
  );
}