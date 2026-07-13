"use client";

import { useSession } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, Users, Layers, TrendingUp, Edit2, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ManageProfileModal } from "@/components/dashboard/manage-profile-modal";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if ((session.user as any).role !== "admin") {
        router.push("/dashboard");
      } else {
        // Fetch stats if admin
        const fetchStats = async () => {
          try {
            const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`);
            const data = await res.json();
            if (data.success) {
              setStats(data.data);
            }
          } catch (error) {
            console.error("Failed to fetch admin stats:", error);
          } finally {
            setIsLoadingStats(false);
          }
        };
        fetchStats();
      }
    }
  }, [isPending, session, router]);

  if (isPending || !session) return <DashboardSkeleton />;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Welcome back, {session.user.name}. Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => setIsManageProfileOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4 text-emerald-500 dark:text-[#004F3B]" /> Manage Profile
        </button>
      </div>

      {isLoadingStats ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-neutral-400 font-medium mb-1">Total Users</p>
              <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{(stats?.totalUsers || 0).toLocaleString()}</h3>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-neutral-400 font-medium mb-1">Active Campaigns</p>
              <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{(stats?.activeCampaigns || 0).toLocaleString()}</h3>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-neutral-400 font-medium mb-1">Pending Campaigns</p>
              <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{(stats?.pendingCampaigns || 0).toLocaleString()}</h3>
            </div>

            <div className="bg-purple-500 dark:bg-purple-600 rounded-3xl p-6 shadow-lg shadow-purple-500/20 relative overflow-hidden text-white flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10 flex justify-between items-start mb-1">
                <p className="text-sm text-purple-100 font-medium">FundForge Income</p>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">
                  {(stats?.totalContributions || 0).toLocaleString()} Cr Processed
                </span>
              </div>
              <h3 className="text-3xl font-black relative z-10">
                ${(stats?.platformIncomeUSD || 0).toFixed(2)} <span className="text-base font-bold text-purple-200">USD</span>
              </h3>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Users */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Recent Users</h3>
                  <p className="text-xs text-neutral-400">The newest members on the platform</p>
                </div>
                <Link href="/admin/dashboard/users" className="text-xs font-bold text-emerald-500 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {stats?.recentUsers?.map((u: any) => (
                  <div key={u._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <img 
                      src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email)}&background=random`}
                      alt={u.name || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-800 dark:text-white truncate">{u.name || u.email.split('@')[0]}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{u.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0">
                      {u.role || "Supporter"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Recent Campaigns</h3>
                  <p className="text-xs text-neutral-400">Newly added projects</p>
                </div>
                <Link href="/admin/dashboard/campaigns" className="text-xs font-bold text-emerald-500 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {stats?.recentCampaigns?.map((c: any) => (
                  <div key={c._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.campaign_title} className="w-full h-full object-cover" />
                      ) : (
                        <Layers className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-800 dark:text-white truncate">{c.campaign_title}</p>
                      <p className="text-[10px] text-neutral-500 truncate">By {c.creator_name}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      c.status === "approved" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      c.status === "pending" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      <ManageProfileModal 
        isOpen={isManageProfileOpen} 
        onClose={() => setIsManageProfileOpen(false)} 
        user={session.user} 
      />
    </div>
  );
}
