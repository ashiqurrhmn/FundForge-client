"use client";

import Image from "next/image";
import Link from "next/link";
import { DollarSign, Users, Eye, PlusCircle, ArrowRight, Clock, Star, TrendingUp, Settings, EyeOff, Target, Edit2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ManageProfileModal } from "./manage-profile-modal";

// Mock Data
const MOCK_METRICS = {
  totalRaised: "$145,000",
  totalBackers: "1,240",
  activeCampaigns: "2",
  totalViews: "45.8k",
  raisedTrend: "+12%",
  viewsTrend: "+24%",
};

const MY_CAMPAIGNS = [
  {
    id: 10,
    title: "Eco-Friendly Water Filtration for Rural Villages",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    raised: 12500,
    goal: 15000,
    daysLeft: 14,
    status: "Active",
    category: "Environment",
    backers: 142,
    updates: 3
  },
  {
    id: 11,
    title: "Solar-Powered Community Garden Hub",
    image: "https://images.unsplash.com/photo-1592424001807-6c2eeb2957b6?w=800&q=80",
    raised: 132500,
    goal: 100000,
    daysLeft: 0,
    status: "Completed",
    category: "Community",
    backers: 1098,
    updates: 12
  }
];

const RECENT_BACKERS = [
  { id: 101, name: "Sarah J.", amount: 50, campaign: "Eco-Friendly Water Filtration", time: "2 hours ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: 102, name: "Michael T.", amount: 120, campaign: "Eco-Friendly Water Filtration", time: "5 hours ago", avatar: "https://i.pravatar.cc/150?u=michael" },
  { id: 103, name: "Anonymous", amount: 25, campaign: "Eco-Friendly Water Filtration", time: "1 day ago", avatar: null },
  { id: 104, name: "Elena R.", amount: 500, campaign: "Solar-Powered Community Garden", time: "2 days ago", avatar: "https://i.pravatar.cc/150?u=elena" },
];

export function CreatorDashboard({ user }: { user: any }) {
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 w-full">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
            Creator Dashboard
          </h1>
          <p className="text-sm text-neutral-400 font-medium">Home / <span className="text-emerald-500 dark:text-[#009966]">Overview</span></p>
        </div>
        <button 
          onClick={() => setIsManageProfileOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4 text-emerald-500 dark:text-[#009966]" /> Manage Profile
        </button>
      </div>

      <ManageProfileModal 
        isOpen={isManageProfileOpen} 
        onClose={() => setIsManageProfileOpen(false)} 
        user={user} 
      />

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-[#009966]/20 text-emerald-500 dark:text-[#009966] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-500 dark:text-[#009966] flex items-center gap-1 bg-emerald-50 dark:bg-[#009966]/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> {MOCK_METRICS.raisedTrend}
            </span>
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Total Raised</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{MOCK_METRICS.totalRaised}</h3>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Total Backers</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{MOCK_METRICS.totalBackers}</h3>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Active Campaigns</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{MOCK_METRICS.activeCampaigns}</h3>
        </div>

        <div className="bg-emerald-500 dark:bg-[#009966] rounded-3xl p-6 shadow-lg shadow-emerald-500/20 dark:shadow-[#009966]/20 relative overflow-hidden flex flex-col justify-center text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <p className="text-sm text-emerald-50 font-medium mb-1 relative z-10">Total Views</p>
          <h3 className="text-2xl font-black mb-4 relative z-10">{MOCK_METRICS.totalViews}</h3>
          <Link href="/create" className="bg-white text-emerald-600 dark:text-[#009966] py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 dark:hover:bg-white/90 transition-colors flex items-center justify-center gap-2 relative z-10">
            Add New Campaign <PlusCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="flex flex-col xl:flex-row gap-8 mb-8">
        
        {/* Left Column: My Campaigns */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">My Campaigns</h3>
                <p className="text-xs text-neutral-400">Track and manage your active funding goals</p>
              </div>
              <button className="text-emerald-500 dark:text-[#009966] text-sm font-bold hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
           </div>

           <div className="space-y-6 mb-6">
              {MY_CAMPAIGNS.map(campaign => {
                const percentFunded = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
                const isActive = campaign.status === "Active";

                return (
                  <div key={campaign.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:shadow-md transition-shadow">
                    <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden shrink-0 relative">
                      <img src={campaign.image} alt={campaign.title} className={`w-full h-full object-cover transition-transform duration-500 ${!isActive && 'grayscale opacity-70'}`} />
                      <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {campaign.category}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-base text-neutral-800 dark:text-white mb-2 line-clamp-2">{campaign.title}</h4>
                        <div className="flex gap-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-4">
                           <span className="flex items-center gap-1 text-emerald-500 dark:text-[#009966]"><Users className="w-3.5 h-3.5"/> {campaign.backers} Backers</span>
                           <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5"/> {campaign.updates} Updates</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-neutral-800 dark:text-white">${campaign.raised.toLocaleString()} <span className="text-neutral-400 font-medium">of ${campaign.goal.toLocaleString()}</span></span>
                          <span className="text-emerald-500 dark:text-[#009966]">{percentFunded}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mb-4 overflow-hidden">
                          <div className={`${isActive ? 'bg-emerald-500 dark:bg-[#009966]' : 'bg-neutral-300 dark:bg-neutral-600'} h-1.5 rounded-full`} style={{ width: `${percentFunded}%` }}></div>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex gap-2">
                             <button className="text-xs font-bold px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5"/> Manage
                             </button>
                           </div>
                           {isActive ? (
                             <span className="text-xs font-bold text-neutral-500 flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800/50 px-3 py-1.5 rounded-lg">
                               <Clock className="w-3.5 h-3.5" /> {campaign.daysLeft} days left
                             </span>
                           ) : (
                             <span className="text-xs font-bold text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 px-3 py-1.5 rounded-lg">
                               Completed
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
           </div>
        </div>

        {/* Right Column: Recent Backers */}
        <div className="w-full xl:w-80 flex flex-col gap-8">
           <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)] flex-1">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-base font-bold text-neutral-800 dark:text-white">Recent Backers</h3>
              </div>
              <div className="space-y-4">
                 {RECENT_BACKERS.map(backer => (
                   <div key={backer.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                         {backer.avatar ? (
                           <img src={backer.avatar} alt={backer.name} className="w-full h-full object-cover" />
                         ) : (
                           <Users className="w-4 h-4 text-neutral-400" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-bold text-neutral-800 dark:text-white truncate">{backer.name}</p>
                            <span className="text-sm font-black text-emerald-500 dark:text-[#009966]">+${backer.amount}</span>
                         </div>
                         <p className="text-[10px] text-neutral-500 truncate mb-1">Backed: {backer.campaign}</p>
                         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{backer.time}</p>
                      </div>
                   </div>
                 ))}
                 
                 <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
                    <button className="text-xs font-bold text-emerald-500 dark:text-[#009966] hover:underline">View All Activity</button>
                 </div>
              </div>
           </div>

           {/* Call to action promo block */}
           <div className="bg-neutral-900 dark:bg-neutral-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
             <Star className="w-6 h-6 text-yellow-400 mb-3" />
             <h3 className="text-base font-bold mb-2">Creator Toolkit</h3>
             <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
               Campaigns that post updates every 5 days raise 3x more funds. Check out our tools to boost your campaign!
             </p>
             <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-colors backdrop-blur-sm">
               Explore Toolkit
             </button>
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 font-medium">
         <div className="flex gap-6">
            <Link href="#" className="hover:text-emerald-500 dark:hover:text-[#009966] transition-colors">Creator Guidelines</Link>
            <Link href="#" className="hover:text-emerald-500 dark:hover:text-[#009966] transition-colors">Help Center</Link>
         </div>
         <p>© 2026 FundForge</p>
      </div>

    </div>
  );
}
