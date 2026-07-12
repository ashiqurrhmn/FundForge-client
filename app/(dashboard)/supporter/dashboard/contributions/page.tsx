"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HandCoins, Search, Heart, Clock, CheckCircle2, XCircle, ChevronRight, LayoutList, Grip } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url: string;
  category: string;
}

interface Contribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  supporterEmail: string;
  supporterName: string;
  creatorEmail: string;
  amount: number;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  campaign?: Campaign;
}

export default function MyContributionsPage() {
  const { data: session } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/supporter/${session?.user?.email}`);
        const json = await res.json();
        
        if (json.success) {
          setContributions(json.data);
        } else {
          toast.error("Failed to load contributions");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while loading contributions.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchContributions();
    }
  }, [session]);

  const filteredContributions = contributions.filter(c => {
    const matchesSearch = c.campaignTitle?.toLowerCase().includes(search.toLowerCase()) || 
                          c.campaign?.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalImpact = contributions.filter(c => c.status === "Approved").reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingImpact = contributions.filter(c => c.status === "Pending").reduce((sum, c) => sum + (c.amount || 0), 0);

  const StatusIcon = {
    Pending: Clock,
    Approved: CheckCircle2,
    Rejected: XCircle
  };

  const StatusColor = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-[#004F3B]/30 dark:text-emerald-400 dark:border-[#004F3B]/50",
    Rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
            My Contributions
          </h1>
          <p className="text-sm text-neutral-400 font-medium">Home / Supporter / <span className="text-emerald-500">Contributions</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total Impact
            </p>
            <h3 className="text-3xl font-black text-neutral-900 dark:text-white">
              {totalImpact.toLocaleString()} <span className="text-emerald-500 text-lg">Cr</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-2">From approved contributions</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-emerald-100 dark:text-emerald-900/30" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> Pending Impact
          </p>
          <h3 className="text-3xl font-black text-neutral-900 dark:text-white">
            {pendingImpact.toLocaleString()} <span className="text-emerald-500 text-lg">Cr</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-2">Awaiting creator approval</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-bold mb-2 flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-blue-500" /> Total Projects Backed
          </p>
          <h3 className="text-3xl font-black text-neutral-900 dark:text-white">
            {contributions.length}
          </h3>
          <p className="text-xs text-neutral-400 mt-2">Including all statuses</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {(["All", "Pending", "Approved", "Rejected"] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {status}
              <span className="ml-2 px-2 py-0.5 rounded-md bg-white/20 text-xs">
                {status === "All" ? contributions.length : contributions.filter(c => c.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-shadow"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl border border-neutral-200 dark:border-neutral-800"></div>
          ))}
        </div>
      ) : filteredContributions.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">No contributions found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm">
            {search || statusFilter !== "All" 
              ? "We couldn't find any contributions matching your current filters." 
              : "You haven't backed any campaigns yet. Discover amazing projects and make an impact today!"}
          </p>
          <Link href="/explore" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">
            Explore Campaigns
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredContributions.map(contribution => {
              const Icon = StatusIcon[contribution.status];
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={contribution._id} 
                  className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center group"
                >
                  <div className="relative w-full md:w-32 h-32 md:h-24 rounded-xl overflow-hidden shrink-0">
                    {contribution.campaign?.campaign_image_url ? (
                      <img 
                        src={contribution.campaign.campaign_image_url} 
                        alt={contribution.campaignTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-neutral-300" />
                      </div>
                    )}
                    {contribution.campaign?.category && (
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2 py-1 rounded-md">
                        {contribution.campaign.category}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${StatusColor[contribution.status]}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {contribution.status}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {new Date(contribution.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <Link href={`/explore/${contribution.campaignId}`} className="block group/link w-fit mt-2">
                      <h3 className="text-lg font-bold text-neutral-800 dark:text-white line-clamp-1 group-hover/link:text-emerald-500 transition-colors">
                        {contribution.campaignTitle}
                      </h3>
                    </Link>
                    
                    {contribution.message && (
                      <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-950/50 rounded-xl border border-neutral-100 dark:border-neutral-800 text-sm text-neutral-600 dark:text-neutral-400 italic flex gap-3 items-start">
                         <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                         "{contribution.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                    <div className="text-right">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Contribution</p>
                      <p className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
                        {contribution.amount.toLocaleString()} <span className="text-emerald-500 text-base">Cr</span>
                      </p>
                    </div>
                    
                    <Link 
                      href={`/explore/${contribution.campaignId}`}
                      className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-emerald-500 hover:text-white transition-colors group/btn"
                    >
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
