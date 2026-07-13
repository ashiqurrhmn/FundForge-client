"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2, TrendingUp, TrendingDown, Plus, Heart, Star, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ManageProfileModal } from "./manage-profile-modal";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function SupporterDashboard({ user }: { user: any }) {
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/supporter/dashboard/${user.email}`);
        const json = await res.json();
        if (json.success) {
          setDashboardData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch supporter dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 w-full animate-pulse">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-8"></div>
        <div className="h-40 w-full bg-neutral-200 dark:bg-neutral-800 rounded-3xl mb-8"></div>
        <div className="flex flex-col xl:flex-row gap-8 mb-8">
          <div className="flex-1 h-96 bg-neutral-200 dark:bg-neutral-800 rounded-3xl"></div>
          <div className="w-full xl:w-80 h-96 bg-neutral-200 dark:bg-neutral-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || { totalImpact: 0, monthlyContributions: 0, availableCredit: 0 };
  const supportedCampaigns = dashboardData?.supportedCampaigns || [];
  const trendingCampaigns = dashboardData?.trendingCampaigns || [];
  const impactSummary = dashboardData?.impactSummary || [];
  const chartData = dashboardData?.chartData || [];

  const uniqueCategories = ["All", ...Array.from(new Set(supportedCampaigns.map((c: any) => c.category)))];
  const filteredCampaigns = selectedCategory === "All" ? supportedCampaigns : supportedCampaigns.filter((c: any) => c.category === selectedCategory);

  return (
    <div className="p-6 md:p-8 w-full">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
            Supporter Dashboard
          </h1>
          <p className="text-sm text-neutral-400 font-medium">Home / <span className="text-emerald-500">Dashboard</span></p>
        </div>
        <button 
          onClick={() => setIsManageProfileOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4 text-emerald-500" /> Manage profile
        </button>
      </div>

      <ManageProfileModal 
        isOpen={isManageProfileOpen} 
        onClose={() => setIsManageProfileOpen(false)} 
        user={user} 
      />

      {/* 2. Top Metrics Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] mb-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 w-full lg:w-auto">
          {/* Total Impact */}
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-2">Total Impact</p>
            <h2 className="text-4xl font-black text-emerald-500">{metrics.totalImpact.toLocaleString()} Cr</h2>
          </div>

          <div className="hidden md:block w-px h-16 bg-neutral-100 dark:bg-neutral-800"></div>

          {/* Monthly Contributions */}
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-2">Contributions (This Month)</p>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-3">
              {metrics.monthlyContributions.toLocaleString()} Cr
            </h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>

          {/* Available Credit */}
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-2">Available Credit</p>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-3">
              {metrics.availableCredit.toLocaleString()} Cr
            </h3>
            <span className="text-xs font-bold text-neutral-500 flex items-center gap-1 mt-1 bg-neutral-50 dark:bg-neutral-900/20 px-2 py-0.5 rounded-full w-fit">
              Ready to support
            </span>
          </div>
        </div>

        <Link href="/supporter/dashboard/credits" className="w-full lg:w-auto bg-emerald-500 dark:bg-[#004F3B] hover:bg-emerald-600 dark:hover:bg-[#008f5d] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 dark:shadow-[#004F3B]/30 transition-all flex items-center justify-center gap-2">
          Add Funds <Plus className="w-4 h-4" />
        </Link>

      </div>

      {/* 3. Middle Section: Two Columns */}
      <div className="flex flex-col xl:flex-row gap-8 mb-8">
        
        {/* Left Column: Favorite Campaigns */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Supported Campaigns</h3>
                <p className="text-xs text-neutral-400">Your most active and favorite projects</p>
              </div>
              <div className="flex gap-4 text-xs font-bold overflow-x-auto pb-2 sm:pb-0 max-w-full">
                {uniqueCategories.map((cat: any) => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`${selectedCategory === cat ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'} pb-1 whitespace-nowrap capitalize transition-colors`}
                  >
                    {cat === "All" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign: any, index: number) => {
                const isWide = index % 4 === 0 || index % 4 === 3;
                return (
                  <Link 
                    href={`/explore/${campaign._id}`} 
                    key={campaign._id} 
                    className={`group cursor-pointer relative overflow-hidden rounded-3xl h-56 md:h-64 ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}
                  >
                    <img 
                      src={campaign.campaign_image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"} 
                      alt={campaign.campaign_title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">
                      {campaign.category}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="font-bold text-lg md:text-xl text-white mb-2 line-clamp-2 leading-tight">{campaign.campaign_title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300 font-medium">
                         <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md"><Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> Supported</span>
                         <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">{campaign.raisedCredits?.toLocaleString() || 0} Cr raised</span>
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                <div className="col-span-1 md:col-span-3 text-center py-10">
                  <p className="text-neutral-500 text-sm">You haven't supported any campaigns yet.</p>
                  <Link href="/explore" className="text-emerald-500 font-bold text-sm hover:underline mt-2 inline-block">Explore Campaigns</Link>
                </div>
              )}
           </div>
           
           {supportedCampaigns.length > 0 && (
             <div className="text-center mt-8">
               <Link href="/explore" className="inline-flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                 Support more projects
               </Link>
             </div>
           )}
        </div>

        {/* Right Column: Sidebar inside content */}
        <div className="w-full xl:w-80 flex flex-col gap-8">
           
           {/* Most Selling / Trending */}
           <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] flex-1">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-base font-bold text-neutral-800 dark:text-white">Trending Now</h3>
                 <button className="text-xs font-bold text-emerald-500 border-b-2 border-emerald-500 pb-0.5">Monthly</button>
              </div>
              <div className="space-y-4">
                 {trendingCampaigns.length > 0 ? trendingCampaigns.map((item: any) => (
                   <Link href={`/explore/${item._id}`} key={item._id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                         <img src={item.campaign_image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"} alt={item.campaign_title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-sm text-neutral-800 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2">{item.campaign_title}</h4>
                   </Link>
                 )) : (
                   <p className="text-xs text-neutral-500">No trending campaigns right now.</p>
                 )}
                 
                 {/* Decorative image item like in the reference */}
                 <Link href="/explore" className="mt-6 w-full h-24 rounded-2xl overflow-hidden relative block group">
                    <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                       <span className="text-white font-bold text-sm">Discover More</span>
                    </div>
                 </Link>
              </div>
           </div>

           {/* Solid Colored Card (Order Details equivalent) */}
           <div className="bg-emerald-500 dark:bg-[#004F3B] rounded-3xl p-6 shadow-lg shadow-emerald-500/20 dark:shadow-[#004F3B]/20 text-white h-auto relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <h3 className="text-base font-bold mb-4 relative z-10">Impact Summary</h3>
             <ul className="space-y-3 text-sm font-medium relative z-10 text-emerald-50">
               {impactSummary.length > 0 ? impactSummary.map((item: any, i: number) => (
                 <li key={i} className="flex justify-between items-center">
                   <span className="capitalize">{item.category}</span> 
                   <span className="font-bold">{item.amount.toLocaleString()} Cr</span>
                 </li>
               )) : (
                 <li className="text-center py-4 text-emerald-200 text-xs">Support campaigns to see your impact</li>
               )}
             </ul>
             <Link href="/explore" className="mt-6 w-full py-2.5 bg-white text-emerald-600 dark:text-[#004F3B] rounded-xl font-bold text-sm hover:bg-emerald-50 dark:hover:bg-white/90 transition-colors relative z-10 flex items-center justify-center text-center">
               Explore more campaigns
             </Link>
           </div>
        </div>

      </div>

      {/* 4. Bottom Chart Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] relative overflow-hidden">
         <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Contribution History</h3>
              <p className="text-xs text-neutral-400">Track your impact over time</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold">
               Weekly
            </div>
         </div>

         <div className="flex gap-12 mb-8">
            <div>
              <p className="text-2xl font-black text-neutral-800 dark:text-white flex items-end gap-1">
                 <TrendingUp className="w-5 h-5 text-neutral-300 mb-1" /> {metrics.avgImpactPerMonth?.toLocaleString() || 0} Cr
              </p>
              <p className="text-xs text-neutral-400 font-medium">Avg. Impact per Month</p>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-800 dark:text-white flex items-end gap-1">
                 <TrendingUp className="w-5 h-5 text-neutral-300 mb-1" /> {metrics.avgImpactPerDay?.toLocaleString() || 0} Cr
              </p>
              <p className="text-xs text-neutral-400 font-medium">Avg. Impact per day</p>
            </div>
         </div>

         {/* Dynamic Recharts Area Chart */}
         <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                  formatter={(value: any) => [`${value} Cr`, 'Impact']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>

         {/* Footer Links */}
         <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400 font-medium">
            <div className="flex gap-6">
               <Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-emerald-500 transition-colors">Terms of Use</Link>
            </div>
            <p>© 2026 FundForge</p>
         </div>
      </div>

    </div>
  );
}

