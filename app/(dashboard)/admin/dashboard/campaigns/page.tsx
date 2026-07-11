"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  creator_email: string;
  category: string;
  funding_goal: number;
  deadline: string;
  status: string;
  createdAt: string;
}

export default function AdminCampaignsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if ((session.user as any).role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user && (session.user as any).role === "admin") {
      fetchCampaigns();
    }
  }, [session]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/campaigns/admin`);
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/campaigns/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Campaign ${newStatus} successfully!`);
        // Update local state to reflect the change
        setCampaigns(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating campaign status:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending || !session) return null;

  return (
    <div className="p-6 md:p-8 w-full">
      <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-500 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Overview
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
      >
        <div className="bg-emerald-500 dark:bg-[#004F3B] px-8 py-6 text-white">
          <h1 className="text-2xl font-black">Manage Campaigns</h1>
          <p className="text-emerald-100 text-sm mt-1">Review and approve user-submitted campaigns.</p>
        </div>

        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
              <p>Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <p>No campaigns found in the system.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Campaign</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Creator</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Goal</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white max-w-[200px] truncate" title={campaign.campaign_title}>
                      {campaign.campaign_title}
                      <div className="text-xs text-neutral-500 font-normal mt-1">{new Date(campaign.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium dark:text-neutral-200">{campaign.creator_name}</div>
                      <div className="text-xs text-neutral-500">{campaign.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
                      <span className="inline-block px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-medium">
                        {campaign.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-[#004F3B] font-bold">
                      {campaign.funding_goal.toLocaleString()}
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
                      {campaign.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(campaign._id, "approved")}
                            disabled={processingId === campaign._id}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            title="Approve Campaign"
                          >
                            {processingId === campaign._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(campaign._id, "rejected")}
                            disabled={processingId === campaign._id}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                            title="Reject Campaign"
                          >
                            {processingId === campaign._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
