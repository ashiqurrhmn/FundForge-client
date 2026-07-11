"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Loader2, ArrowLeft, Settings, Clock, Users, Radio } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      const res = await fetch(`http://localhost:5000/api/campaigns/creator/${session!.user.id}`);
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
    console.log("Delete functionality will be added here for:", id);
  };

  if (isPending || !session) return null;

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
          <div className="bg-emerald-500 dark:bg-[#004F3B] px-8 py-6 text-white">
            <h1 className="text-2xl font-black">My Campaigns</h1>
            <p className="text-emerald-100 text-sm mt-1">Manage and track your submitted campaigns.</p>
          </div>

          <div className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                <p>Loading campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">You haven't created any campaigns yet.</p>
                <Link href="/creator/dashboard/create" className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                  Create One Now
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6 p-6">
                {campaigns.map((campaign) => {
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
    </div>
  );
}
