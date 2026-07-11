"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit2, TrendingUp, TrendingDown, Plus, Heart, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ManageProfileModal } from "./manage-profile-modal";

// Mock Data adapted for the new layout
const MOCK_METRICS = {
  totalImpact: "$34,000.00",
  monthlyContributions: "$1,000.00",
  contributionTrend: "+15%",
  availableCredit: "$246.00",
  creditTrend: "-10%"
};

const FAVORITE_CAMPAIGNS = [
  {
    id: 1,
    title: "Eco-Friendly Water Filtration",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    totalSales: "3,515 Total Contributions",
    rating: 5,
    reviews: 484
  },
  {
    id: 2,
    title: "Community Solar Power Hub",
    category: "Community",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    totalSales: "3,515 Total Contributions",
    rating: 5,
    reviews: 484
  },
  {
    id: 3,
    title: "Organic Urban Farming Kit",
    category: "Agriculture",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    totalSales: "3,515 Total Contributions",
    rating: 5,
    reviews: 484
  },
  {
    id: 4,
    title: "Accessible Smart Glasses",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1573511860302-28c5243198e6?w=800&q=80",
    totalSales: "3,515 Total Contributions",
    rating: 5,
    reviews: 484
  }
];

const MOST_SELLING = [
  { id: 10, title: "Ocean Cleanup", image: "https://images.unsplash.com/photo-1483864697786-43ef88d59fa4?w=800&q=80" },
  { id: 11, title: "EduTech Open", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" },
  { id: 12, title: "Reforestation", image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80" },
];

export function SupporterDashboard({ user }: { user: any }) {
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);

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
            <h2 className="text-4xl font-black text-emerald-500">{MOCK_METRICS.totalImpact}</h2>
          </div>

          <div className="hidden md:block w-px h-16 bg-neutral-100 dark:bg-neutral-800"></div>

          {/* Monthly Contributions */}
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-2">Contributions</p>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-3">
              {MOCK_METRICS.monthlyContributions} 
            </h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingUp className="w-3 h-3" /> {MOCK_METRICS.contributionTrend}
            </span>
          </div>

          {/* Available Credit */}
          <div>
            <p className="text-sm text-neutral-400 font-medium mb-2">Available Credit</p>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-3">
              {MOCK_METRICS.availableCredit}
            </h3>
            <span className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit">
              <TrendingDown className="w-3 h-3" /> {MOCK_METRICS.creditTrend}
            </span>
          </div>
        </div>

        <button className="w-full lg:w-auto bg-emerald-500 dark:bg-[#009966] hover:bg-emerald-600 dark:hover:bg-[#008f5d] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 dark:shadow-[#009966]/30 transition-all flex items-center justify-center gap-2">
          Add Funds <Plus className="w-4 h-4" />
        </button>

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
                <button className="text-emerald-500 border-b-2 border-emerald-500 pb-1 whitespace-nowrap">All Categories</button>
                <button className="text-neutral-400 hover:text-neutral-600 pb-1 whitespace-nowrap">Environment</button>
                <button className="text-neutral-400 hover:text-neutral-600 pb-1 whitespace-nowrap">Technology</button>
                <button className="text-neutral-400 hover:text-neutral-600 pb-1 whitespace-nowrap">Community</button>
                <button className="text-neutral-400 hover:text-neutral-600 pb-1 whitespace-nowrap">More</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {FAVORITE_CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-sm text-neutral-800 dark:text-white mb-1.5 line-clamp-1 group-hover:text-emerald-500 transition-colors">{campaign.title}</h4>
                    <p className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mb-2">
                       <TrendingUp className="w-3 h-3 text-emerald-500" /> {campaign.totalSales}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < campaign.rating ? 'fill-emerald-500 text-emerald-500' : 'fill-neutral-200 text-neutral-200'}`} />
                      ))}
                      <span className="text-[10px] text-neutral-400 ml-1">({campaign.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="text-center mt-8">
             <button className="text-emerald-500 text-sm font-bold hover:underline">View more</button>
           </div>
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
                 {MOST_SELLING.map(item => (
                   <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                         <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-sm text-neutral-800 dark:text-white group-hover:text-emerald-500 transition-colors">{item.title}</h4>
                   </div>
                 ))}
                 
                 {/* Decorative image item like in the reference */}
                 <div className="mt-6 w-full h-24 rounded-2xl overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80" alt="Promo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <span className="text-white font-bold text-sm">Discover More</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Solid Colored Card (Order Details equivalent) */}
           <div className="bg-emerald-500 dark:bg-[#009966] rounded-3xl p-6 shadow-lg shadow-emerald-500/20 dark:shadow-[#009966]/20 text-white h-auto relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <h3 className="text-base font-bold mb-4 relative z-10">Impact Summary</h3>
             <ul className="space-y-3 text-sm font-medium relative z-10 text-emerald-50">
               <li className="flex justify-between"><span>Environment</span> <span>$1,200</span></li>
               <li className="flex justify-between"><span>Technology</span> <span>$850</span></li>
               <li className="flex justify-between"><span>Education</span> <span>$420</span></li>
               <li className="flex justify-between"><span>Community</span> <span>$310</span></li>
             </ul>
             <button className="mt-6 w-full py-2.5 bg-white text-emerald-600 dark:text-[#009966] rounded-xl font-bold text-sm hover:bg-emerald-50 dark:hover:bg-white/90 transition-colors relative z-10">
               View Full Report
             </button>
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
                 <TrendingUp className="w-5 h-5 text-neutral-300 mb-1" /> 123k
              </p>
              <p className="text-xs text-neutral-400 font-medium">Avg. Impact per Month</p>
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-800 dark:text-white flex items-end gap-1">
                 <TrendingUp className="w-5 h-5 text-neutral-300 mb-1" /> 598
              </p>
              <p className="text-xs text-neutral-400 font-medium">Avg. Impact per day</p>
            </div>
         </div>

         {/* Mock SVG Chart */}
         <div className="w-full h-40 relative">
            <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M0,150 C100,150 150,180 250,180 C350,180 400,100 500,120 C600,140 650,160 750,140 C850,120 900,50 1000,50 L1000,200 L0,200 Z" 
                fill="url(#chartGradient)"
              />
              <path 
                d="M0,150 C100,150 150,180 250,180 C350,180 400,100 500,120 C600,140 650,160 750,140 C850,120 900,50 1000,50" 
                fill="none" 
                stroke="rgb(16 185 129)" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
