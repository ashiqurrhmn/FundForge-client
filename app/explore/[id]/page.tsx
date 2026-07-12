"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Clock,
  Target,
  Calendar,
  User,
  Wallet,
  Share2,
  Heart,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { ContributeDialog } from "@/components/contribute-dialog";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  campaign_image_url: string;
  funding_goal: number;
  minimum_contribution?: number;
  raisedCredits?: number;
  backers?: number;
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
  const [liked, setLiked] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`);
      const json = await res.json();
      if (json.success) {
        setCampaign(json.data);
      } else {
        router.push("/explore");
      }
    } catch {
      router.push("/explore");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`);
        const json = await res.json();
        if (json.success) {
          setSuggestedCampaigns(json.data.filter((c: Campaign) => c._id !== id).slice(0, 3));
        }
      } catch {/* silent */}
    };

    if (id) {
      fetchCampaign();
      fetchSuggestions();
    }
  }, [id, fetchCampaign]);

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getFundedPercent = () => {
    if (!campaign) return 0;
    return Math.min(100, Math.round(((campaign.raisedCredits || 0) / campaign.funding_goal) * 100));
  };

  // ── Loading Skeleton ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 animate-pulse">
        <div className="relative w-full h-[55vh] bg-neutral-200 dark:bg-neutral-900" />
        <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
              <div className="h-4 w-4/6 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-sm space-y-4">
              <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-20 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
              <div className="h-14 w-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const daysLeft = getDaysLeft(campaign.deadline);
  const fundedPercent = getFundedPercent();
  const isExpired = daysLeft === 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Toaster position="top-center" />

      {/* Contribute Dialog */}
      <ContributeDialog
        campaign={campaign}
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSuccess={() => fetchCampaign()}
      />

      {/* ── HERO ── */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaign.campaign_image_url || "/assets/hero-10.png"}
          alt={campaign.campaign_title}
          className="w-full h-full object-cover"
        />
        {/* Layered gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-10 pt-6 md:pt-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Explore
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(v => !v)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                liked
                  ? "bg-red-500/80 border-red-400 text-white"
                  : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
            </button>
            <button
              onClick={() => navigator.share?.({ url: window.location.href, title: campaign.campaign_title }).catch(() => {})}
              className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero text at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-10 pb-8 md:pb-12 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 shadow-lg">
            {campaign.category}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl">
            {campaign.campaign_title}
          </h1>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Description + Creator ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 md:p-8">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                About this Campaign
              </h2>
              <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
                {campaign.description ? (
                  <p>{campaign.description}</p>
                ) : (
                  <p>
                    Welcome to the official campaign page for{" "}
                    <span className="font-bold text-neutral-900 dark:text-white">{campaign.campaign_title}</span>.
                    {" "}This project is looking for enthusiastic supporters to help bring this amazing vision to life.
                    Every contribution counts towards reaching our goal and making a real impact.
                  </p>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Backers", value: `${campaign.backers || 0}`, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                { icon: TrendingUp, label: "Funded", value: `${fundedPercent}%`, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                { icon: Clock, label: "Days Left", value: isExpired ? "Ended" : `${daysLeft}`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col items-center text-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-neutral-900 dark:text-white">{value}</p>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Creator card */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 md:p-8">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                About the Creator
              </h2>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-2xl overflow-hidden">
                  {campaign.creator_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.creator_image} alt={campaign.creator_name} className="w-full h-full object-cover" />
                  ) : campaign.creator_name ? (
                    campaign.creator_name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                    {campaign.creator_name || "Anonymous Creator"}
                  </h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {campaign.creator_email || "Contact unavailable"}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified Creator
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 md:p-8">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                Our Guarantee
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: "Secure Payments", desc: "All transactions are encrypted and protected." },
                  { icon: CheckCircle2, title: "Verified Campaign", desc: "This campaign has been reviewed by our team." },
                  { icon: TrendingUp, title: "Progress Tracked", desc: "Real-time updates on funding progress." },
                  { icon: Heart, title: "Community Backed", desc: "Supported by thousands of backers worldwide." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">{title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-5">

              {/* Main support card */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-xl shadow-neutral-200/50 dark:shadow-black/50">

                {/* Funding goal */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Funding Goal
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-neutral-900 dark:text-white tabular-nums">
                      {campaign.funding_goal.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-emerald-500">Cr</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(fundedPercent, 2)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-neutral-500 mb-6">
                  <span className="text-emerald-500">{fundedPercent}% funded</span>
                  <span>{(campaign.raisedCredits || 0).toLocaleString()} Cr raised</span>
                </div>

                {/* Info tiles */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                    <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">Time Left</p>
                      <p className={`text-sm font-black ${isExpired ? "text-red-500" : "text-neutral-900 dark:text-white"}`}>
                        {isExpired ? "Campaign Ended" : `${daysLeft} Days`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">Deadline</p>
                      <p className="text-sm font-black text-neutral-900 dark:text-white">
                        {new Date(campaign.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {campaign.minimum_contribution && (
                    <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                      <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">Min. Contribution</p>
                        <p className="text-sm font-black text-neutral-900 dark:text-white">
                          {campaign.minimum_contribution.toLocaleString()} Cr
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  disabled={isExpired}
                  onClick={() => setIsContributeOpen(true)}
                  className={`w-full py-4 font-black text-base rounded-2xl transition-all duration-300 shadow-lg ${
                    isExpired
                      ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  {isExpired ? "Campaign Ended" : "Support this Campaign"}
                </button>

                <p className="text-center text-[11px] text-neutral-400 font-medium mt-3 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" /> All pledges processed securely
                </p>
              </div>

              {/* Status badge */}
              <div className={`rounded-2xl px-5 py-4 flex items-center gap-3 border ${
                campaign.status === "running"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                  : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  campaign.status === "running" ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                }`} />
                <div>
                  <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Status</p>
                  <p className={`text-sm font-black capitalize ${
                    campaign.status === "running" ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-600 dark:text-neutral-300"
                  }`}>
                    {campaign.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUGGESTED CAMPAIGNS ── */}
      {suggestedCampaigns.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 border-t border-neutral-100 dark:border-neutral-800/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white">
              You May Also Like
            </h2>
            <Link
              href="/explore"
              className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {suggestedCampaigns.map((s) => (
              <Link
                key={s._id}
                href={`/explore/${s._id}`}
                className="group relative rounded-3xl overflow-hidden flex flex-col h-[240px] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.campaign_image_url || "/assets/hero-10.png"}
                    alt={s.campaign_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-5 h-full">
                  <span className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-1.5">
                    {s.category}
                  </span>
                  <h3 className="text-white text-base font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {s.campaign_title}
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
