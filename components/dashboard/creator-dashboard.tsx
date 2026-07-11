"use client";

import Image from "next/image";
import Link from "next/link";
import { DollarSign, Users, Eye, PlusCircle, ArrowRight, Clock, Star, TrendingUp, Settings, EyeOff } from "lucide-react";

// Mock Data
const MOCK_METRICS = {
  totalRaised: 145000,
  totalBackers: 1240,
  activeCampaigns: 2,
  totalViews: 45800,
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
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pb-20">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-[spin_60s_linear_infinite]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/10 dark:bg-emerald-900/10 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-[spin_50s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                 <Star className="w-3.5 h-3.5" /> Creator
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Creator Studio, <span className="text-blue-600 dark:text-blue-400">{user.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
              Manage your campaigns, track funding progress, and engage with your community of backers.
            </p>
          </div>
          <Link href="/create" className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors shrink-0 shadow-sm">
             <PlusCircle className="w-5 h-5" /> New Campaign
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* Metric 1 */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Raised</p>
                <h3 className="text-2xl font-bold">${MOCK_METRICS.totalRaised.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Backers</p>
                <h3 className="text-2xl font-bold">{MOCK_METRICS.totalBackers.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Campaigns</p>
                <h3 className="text-2xl font-bold">{MOCK_METRICS.activeCampaigns}</h3>
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Campaign Views</p>
                <h3 className="text-2xl font-bold">{(MOCK_METRICS.totalViews / 1000).toFixed(1)}k</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: My Campaigns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-500" /> My Campaigns
              </h2>
            </div>

            <div className="space-y-4">
              {MY_CAMPAIGNS.map((campaign) => {
                const percentFunded = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
                const isActive = campaign.status === "Active";
                
                return (
                  <div key={campaign.id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row gap-5">
                    {/* Campaign Image */}
                    <div className="w-full md:w-48 h-32 md:h-full relative rounded-xl overflow-hidden shrink-0">
                      <img src={campaign.image} alt={campaign.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isActive && 'grayscale opacity-80'}`} />
                      <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold">
                        {campaign.category}
                      </div>
                      {!isActive && (
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Funded!</span>
                         </div>
                      )}
                    </div>

                    {/* Campaign Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {campaign.title}
                          </h3>
                        </div>
                        
                        {/* Quick Stats Row */}
                        <div className="flex gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                           <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {campaign.backers} backers</span>
                           <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5"/> {campaign.updates} updates</span>
                        </div>
                      </div>

                      <div>
                        {/* Progress Bar */}
                        <div className="flex justify-between text-sm font-medium mb-1.5">
                          <span className="text-neutral-900 dark:text-white font-bold">${campaign.raised.toLocaleString()} <span className="text-neutral-500 font-normal">raised of ${campaign.goal.toLocaleString()}</span></span>
                          <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"}>{percentFunded}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 mb-4 overflow-hidden">
                          <div className={`${isActive ? 'bg-blue-500' : 'bg-emerald-500'} h-2 rounded-full`} style={{ width: `${percentFunded}%` }}></div>
                        </div>

                        {/* Actions Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-white/5">
                           <div className="flex items-center gap-2">
                             <button className="text-xs font-medium px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1">
                                <Settings className="w-3.5 h-3.5"/> Manage
                             </button>
                             <button className="text-xs font-medium px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1">
                                Post Update
                             </button>
                           </div>
                           {isActive ? (
                             <span className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                               <Clock className="w-3.5 h-3.5" /> {campaign.daysLeft} days left
                             </span>
                           ) : (
                             <button className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition-colors">
                                Withdraw Funds
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Recent Backers & Promo */}
          <div className="space-y-8">
            {/* Recent Backers Section */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Recent Backers
              </h2>
              
              <div className="space-y-5">
                {RECENT_BACKERS.map((backer) => (
                  <div key={backer.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                       {backer.avatar ? (
                         <img src={backer.avatar} alt={backer.name} className="w-full h-full object-cover" />
                       ) : (
                         <EyeOff className="w-5 h-5 text-neutral-400" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-bold truncate">{backer.name}</p>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+${backer.amount}</span>
                       </div>
                       <p className="text-xs text-neutral-500 truncate mb-0.5">Backed: {backer.campaign}</p>
                       <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{backer.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline pt-4 border-t border-neutral-100 dark:border-white/5">
                 View All Backers
              </button>
            </div>
            
            {/* Creator Toolkit Promo */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
               <TrendingUp className="w-8 h-8 text-blue-200 mb-4" />
               <h3 className="text-xl font-bold mb-2">Boost Your Campaign</h3>
               <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                 Campaigns that post updates every 5 days raise 3x more funds on average. Check out our Creator Toolkit!
               </p>
               <button className="bg-white text-blue-800 text-sm font-bold py-2.5 px-5 rounded-xl hover:bg-blue-50 transition-colors w-full shadow-sm">
                 Read Best Practices
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
