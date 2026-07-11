"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Loader2, ArrowLeft, Settings, Clock, Users, Radio, Search, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { CampaignCardSkeleton } from "@/components/skeletons/campaign-card-skeleton";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  funding_goal: number;
  deadline: string;
  status: string;
  campaign_image_url: string;
}

export default function MyCampaignsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("nearest-deadline");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCampaigns();
    }
  }, [session]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/creator/${session!.user.id}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  const handleUpdate = (id: string) => {
    router.push(`/creator/dashboard/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setCampaignToDelete(id);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignToDelete}`, {
        method: "DELETE"
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Campaign deleted successfully");
        setCampaigns(campaigns.filter(c => c._id !== campaignToDelete));
        setCampaignToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedCampaigns = useMemo(() => {
    return campaigns
      .filter((campaign) => {
        const matchesSearch = campaign.campaign_title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "highest-goal":
            return b.funding_goal - a.funding_goal;
          case "lowest-goal":
            return a.funding_goal - b.funding_goal;
          case "furthest-deadline":
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          case "nearest-deadline":
          default:
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
      });
  }, [campaigns, searchQuery, statusFilter, sortBy]);

  if (isPending || !session) return <DashboardSkeleton />;

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="w-full">
        <Link href="/creator/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-500 dark:hover:text-[#004F3B] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
        >
          <div className="bg-emerald-500 dark:bg-[#004F3B] px-8 py-6 text-white border-b border-emerald-600 dark:border-[#00382A]">
            <h1 className="text-2xl font-black">My Campaigns</h1>
            <p className="text-emerald-100 text-sm mt-1">Manage and track your submitted campaigns.</p>
          </div>

          <div className="p-4 md:p-6 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="nearest-deadline">Nearest Deadline</option>
                  <option value="furthest-deadline">Furthest Deadline</option>
                  <option value="highest-goal">Highest Goal</option>
                  <option value="lowest-goal">Lowest Goal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-0">
            {isLoading ? (
              <div className="flex flex-col gap-6 p-6">
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No campaigns found matching your criteria.</p>
                {campaigns.length === 0 && (
                  <Link href="/creator/dashboard/create" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                    Create One Now
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6 p-6">
                {filteredAndSortedCampaigns.map((campaign) => {
                  const daysLeft = getDaysLeft(campaign.deadline);
                  const raised = 0; // Mock data
                  const progressPercentage = Math.min(Math.round((raised / campaign.funding_goal) * 100), 100);

                  return (
                    <div key={campaign._id} className="flex flex-col md:flex-row gap-6 p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm hover:shadow-md">
                      <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={campaign.campaign_image_url || "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"} 
                          alt={campaign.campaign_title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded">
                          {campaign.category}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white line-clamp-2 pr-4">{campaign.campaign_title}</h3>
                            <span className={`shrink-0 inline-block px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                              campaign.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-[#004F3B]/30 dark:text-emerald-400' :
                              campaign.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-emerald-600 dark:text-emerald-500 font-medium mb-4">
                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> 0 Backers</span>
                            <span className="flex items-center gap-1.5"><Radio className="w-4 h-4"/> 0 Updates</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-end justify-between mb-2">
                            <div className="text-sm">
                              <span className="font-bold text-neutral-900 dark:text-white">${raised.toLocaleString()}</span>
                              <span className="text-neutral-500"> of ${campaign.funding_goal.toLocaleString()}</span>
                            </div>
                            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                              {progressPercentage}%
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-5">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdate(campaign._id)} className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                <Settings className="w-4 h-4" /> Manage
                              </button>
                              <button onClick={() => handleDelete(campaign._id)} className="flex items-center justify-center w-9 h-9 bg-neutral-100 hover:bg-red-100 dark:bg-neutral-800 dark:hover:bg-red-900/30 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
                              <Clock className="w-4 h-4" />
                              <span>{daysLeft} days left</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {campaignToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setCampaignToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Delete Campaign</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Are you sure you want to delete this campaign? This action cannot be undone and all data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCampaignToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
