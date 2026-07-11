"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Clock, Target, Calendar, User, Wallet } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  campaign_image_url: string;
  funding_goal: number;
  minimum_contribution?: number;
  deadline: string;
  status: string;
  creator_name: string;
  creator_email: string;
  creator_image?: string;
  description?: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [suggestedCampaigns, setSuggestedCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`);
        const json = await res.json();
        if (json.success) {
          setCampaign(json.data);
        } else {
          router.push('/explore');
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
        router.push('/explore');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`);
        const json = await res.json();
        if (json.success) {
          setSuggestedCampaigns(json.data.filter((c: Campaign) => c._id !== id).slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to fetch suggestions:", e);
      }
    };

    if (id) {
      fetchCampaign();
      fetchSuggestions();
    }
  }, [id, router]);

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={campaign.campaign_image_url || "/assets/hero-10.png"} 
          alt={campaign.campaign_title} 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        
        <div className="absolute top-24 left-6 md:left-12 z-20">
          <Link href="/explore" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              {campaign.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-4">
              {campaign.campaign_title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column */}
        <div className="flex-1">
          <div className="prose prose-lg dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300">
            {campaign.description ? (
              <p>{campaign.description}</p>
            ) : (
              <p className="text-xl leading-relaxed">
                Welcome to the official campaign page for <strong>{campaign.campaign_title}</strong>. 
                This project is looking for enthusiastic supporters to help bring this amazing vision to life. 
                Every contribution counts towards reaching our goal!
              </p>
            )}
            
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-12 mb-6">About the Creator</h3>
            <div className="flex items-center gap-6 p-6 md:p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-20 h-20 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-3xl shadow-inner overflow-hidden">
                {campaign.creator_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={campaign.creator_image} alt={campaign.creator_name} className="w-full h-full object-cover" />
                ) : campaign.creator_name ? (
                  campaign.creator_name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{campaign.creator_name || "Anonymous Creator"}</h4>
                <p className="text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> {campaign.creator_email || "Contact information unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-28 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="text-sm text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Funding Goal
              </div>
              <div className="text-5xl font-black text-emerald-500 tracking-tight flex items-baseline gap-2">
                {campaign.funding_goal.toLocaleString()} <span className="text-2xl font-bold text-emerald-500/70">Cr</span>
              </div>
            </div>

            <div className="w-full bg-neutral-100 dark:bg-neutral-950 rounded-full h-4 mb-4 border border-neutral-200 dark:border-neutral-800 p-0.5">
               <div className="bg-emerald-500 h-full rounded-full w-[5%]" />
            </div>
            
            <div className="flex justify-between items-center mb-10 text-sm font-medium">
               <div className="text-neutral-500 dark:text-neutral-400"><strong className="text-neutral-900 dark:text-white">0%</strong> funded</div>
               <div className="text-neutral-500 dark:text-neutral-400"><strong className="text-neutral-900 dark:text-white">0 Cr</strong> raised</div>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">Time Remaining</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white">{getDaysLeft(campaign.deadline)} Days</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">Deadline</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-white">
                    {new Date(campaign.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {campaign.minimum_contribution && (
                <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">Min Contribution</div>
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">
                      {campaign.minimum_contribution.toLocaleString()} Cr
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black text-xl rounded-2xl hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-white/5">
              Support this Campaign
            </button>
            <p className="text-center text-xs text-neutral-400 mt-4 font-medium">All pledges are processed securely.</p>
          </div>
        </div>

      </div>

      {/* Suggested Campaigns */}
      {suggestedCampaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 pb-24 pt-16 border-t border-neutral-100 dark:border-neutral-800/50 mt-16">
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-10 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedCampaigns.map((suggestion) => (
              <Link 
                key={suggestion._id}
                href={`/explore/${suggestion._id}`}
                className="group relative rounded-3xl overflow-hidden flex flex-col h-[280px] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={suggestion.campaign_image_url || "/assets/hero-10.png"}
                    alt={suggestion.campaign_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/80 transition-colors duration-500" />
                
                {/* Content */}
                <div className="relative z-20 flex flex-col justify-end p-6 h-full">
                  <div className="text-white/80 text-xs font-bold tracking-widest uppercase mb-2">
                    {suggestion.category}
                  </div>
                  <h3 className="text-white text-xl font-bold leading-tight group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                    {suggestion.campaign_title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
