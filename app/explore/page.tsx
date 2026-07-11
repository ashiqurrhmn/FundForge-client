"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Filter, ArrowDownUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  campaign_image_url: string;
  funding_goal: number;
  deadline: string;
  status: string;
}

const getGridClasses = (index: number) => {
  const pattern = index % 6;
  switch (pattern) {
    case 0:
      return "sm:col-span-2 sm:row-span-1"; // Wide
    case 1:
    case 2:
    case 3:
    case 4:
      return "col-span-1 row-span-1 sm:row-span-2"; // Tall
    case 5:
      return "sm:col-span-2 sm:row-span-1"; // Wide
    default:
      return "col-span-1 row-span-1";
  }
};

function ExploreContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`,
        );
        const json = await res.json();
        if (json.success) {
          setCampaigns(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    if (initialSearch) {
      setLocalSearch(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch, selectedCategory, sortOption]);

  const categories = ["All", ...Array.from(new Set(campaigns.map(c => c.category)))];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_title.toLowerCase().includes(localSearch.toLowerCase()) ||
      campaign.category.toLowerCase().includes(localSearch.toLowerCase()) ||
      (campaign.description && campaign.description.toLowerCase().includes(localSearch.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sortOption) {
      case "ending_soon":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "highest_goal":
        return b.funding_goal - a.funding_goal;
      case "lowest_goal":
        return a.funding_goal - b.funding_goal;
      case "newest":
      default:
        return b._id.localeCompare(a._id);
    }
  });

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-5 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
            {initialSearch && localSearch === initialSearch ? `Search Results for "${initialSearch}"` : "Explore Campaigns"}
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
               <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-shadow shadow-sm"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
             <div className="relative w-full md:w-auto flex-1">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                 <Filter className="w-4 h-4" />
               </div>
               <select 
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="w-full md:w-40 pl-11 pr-8 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white cursor-pointer shadow-sm"
               >
                 {categories.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
             </div>

             <div className="relative w-full md:w-auto flex-1">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                 <ArrowDownUp className="w-4 h-4" />
               </div>
               <select 
                 value={sortOption}
                 onChange={(e) => setSortOption(e.target.value)}
                 className="w-full md:w-44 pl-11 pr-8 py-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white cursor-pointer shadow-sm"
               >
                 <option value="newest">Newest First</option>
                 <option value="ending_soon">Ending Soon</option>
                 <option value="highest_goal">Highest Goal</option>
                 <option value="lowest_goal">Lowest Goal</option>
               </select>
             </div>
          </div>
        </div>

        {/* Bento Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading amazing campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-32 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200 dark:border-neutral-800">
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">
              No campaigns found matching your search.
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[220px]"
              >
                {paginatedCampaigns.map((campaign, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 60, rotateX: -12, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % 4) * 0.08,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    key={campaign._id}
                    className={`group relative rounded-3xl overflow-hidden flex flex-col justify-end p-6 md:p-8 bg-neutral-100 dark:bg-neutral-900 ${getGridClasses(index)} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          campaign.campaign_image_url || "/assets/hero-10.png"
                        }
                        alt={campaign.campaign_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:from-black/80 transition-colors duration-500" />

                    {/* Content */}
                    <div className="relative z-20 flex flex-col h-full justify-between">
                      <div className="text-white/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                        {campaign.category}
                      </div>

                      <div className="mt-auto">
                        <h3 className="text-white text-xl md:text-2xl font-bold mb-6 leading-tight group-hover:text-emerald-400 transition-colors duration-300 line-clamp-3">
                          {campaign.campaign_title}
                        </h3>
                        <Link
                          href={`/explore/${campaign._id}`}
                          className="bg-white text-neutral-900 text-sm font-bold px-6 py-3 rounded-full inline-flex items-center hover:bg-emerald-400 hover:text-neutral-900 transition-colors duration-300 shadow-lg w-fit"
                        >
                          View Campaign
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-neutral-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-5 pb-20 flex justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
