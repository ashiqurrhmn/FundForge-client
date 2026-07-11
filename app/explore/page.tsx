"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`);
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

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const paginatedCampaigns = campaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-5 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
            Explore Campaigns
          </h1>
        </div>

        {/* Bento Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading amazing campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-32 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-200 dark:border-neutral-800">
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">No campaigns available right now.</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[220px]"
              >
                {paginatedCampaigns.map((campaign, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 50, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      mass: 1.2,
                      delay: index * 0.08 
                    }}
                    key={campaign._id}
                    className={`group relative rounded-3xl overflow-hidden flex flex-col justify-end p-6 md:p-8 bg-neutral-100 dark:bg-neutral-900 ${getGridClasses(index)} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                  >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={campaign.campaign_image_url || "/assets/hero-10.png"} 
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
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight group-hover:text-emerald-400 transition-colors duration-300 line-clamp-3">
                      {campaign.campaign_title}
                    </h3>
                    <Link 
                      href={`/explore/${campaign._id}`}
                      className="bg-white text-neutral-900 text-sm font-bold px-6 py-3 rounded-full inline-flex items-center hover:bg-emerald-400 hover:text-neutral-900 transition-colors duration-300 shadow-lg"
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
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-neutral-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
