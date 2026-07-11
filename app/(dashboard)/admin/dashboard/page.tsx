"use client";

import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, Users, Layers, TrendingUp, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ManageProfileModal } from "@/components/dashboard/manage-profile-modal";

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if ((session.user as any).role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isPending, session, router]);

  if (isPending || !session) return null;

  const stats = [
    { name: "Pending Campaigns", value: "Needs Review", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/10", href: "/admin/dashboard/campaigns" },
    { name: "Total Users", value: "Active", icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/10", href: "#" },
    { name: "Total Campaigns", value: "All Time", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10", href: "/admin/dashboard/campaigns" },
    { name: "Platform Revenue", value: "Stats", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/10", href: "#" },
  ];

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Welcome back, {session.user.name}. Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => setIsManageProfileOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4 text-emerald-500 dark:text-[#004F3B]" /> Manage Profile
        </button>
      </div>

      <ManageProfileModal 
        isOpen={isManageProfileOpen} 
        onClose={() => setIsManageProfileOpen(false)} 
        user={session.user} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={stat.name} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.name}</p>
                  <p className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
