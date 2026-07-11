"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  funding_goal: number;
  deadline: string;
  status: string;
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

  const handleUpdate = (id: string) => {
    console.log("Update functionality will be added here for:", id);
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

          <div className="p-0 overflow-x-auto">
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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Campaign Title</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Category</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Goal (Credits)</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Deadline</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {campaigns.map((campaign) => (
                    <tr key={campaign._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white max-w-xs truncate" title={campaign.campaign_title}>
                        {campaign.campaign_title}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
                        <span className="inline-block px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
                          {campaign.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-[#004F3B] font-bold">
                        {campaign.funding_goal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300 text-sm">
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                          campaign.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-[#004F3B]/30 dark:text-emerald-400' :
                          campaign.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(campaign._id)}
                            className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Update Campaign"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign._id)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
