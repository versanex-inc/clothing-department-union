"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verifyAdminToken", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Token verification failed");
        }

        setLoading(false);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message);
        router.push("/adminLogin");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/adminLogin");
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return null; // Redirecting to /adminLogin, so no need to render anything
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/70 to-transparent"></div>

      {/* Header */}
      <header className="mt-18 fixed top-0 left-0 w-full z-20 bg-gray-900 p-3 sm:p-4 flex justify-between items-center shadow-md border-b border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">CDU Dashboard</h1>
        <nav className="flex gap-6 sm:gap-8">
          <Link href="/dashboard/manageProducts">
            <span className="text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer">
              Manage Products
            </span>
          </Link>
          <Link href="/dashboard/manageReviews">
            <span className="text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer">
              Manage Reviews
            </span>
          </Link>
          <Link href="/dashboard/manageOrders">
            <span className="text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer">
              Manage Orders
            </span>
          </Link>
          <Link href="/dashboard/giveawayAnnouncement">
            <span className="text-gray-300 hover:text-white transition-all duration-300 text-sm sm:text-base cursor-pointer">
              Giveaway Announcements
            </span>
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm sm:text-base"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 mt-20 container mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 p-4 text-center text-gray-500">
        <p>© 2025 CDU. Crafted with Precision in Custom Designs.</p>
      </footer>
    </div>
  );
}