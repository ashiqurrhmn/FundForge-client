"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Monitor, Palette, Gamepad2, HeartHandshake, Film, Music, Globe, Lightbulb, Layers } from "lucide-react";

const CATEGORIES = [
  { name: "Technology", icon: Monitor, count: 245, color: "from-blue-500/20 to-blue-500/5", textColor: "text-blue-500" },
  { name: "Creative Arts", icon: Palette, count: 182, color: "from-purple-500/20 to-purple-500/5", textColor: "text-purple-500" },
  { name: "Games", icon: Gamepad2, count: 156, color: "from-red-500/20 to-red-500/5", textColor: "text-red-500" },
  { name: "Community", icon: HeartHandshake, count: 312, color: "from-emerald-500/20 to-emerald-500/5", textColor: "text-emerald-500" },
  { name: "Film & Video", icon: Film, count: 124, color: "from-amber-500/20 to-amber-500/5", textColor: "text-amber-500" },
  { name: "Music", icon: Music, count: 98, color: "from-pink-500/20 to-pink-500/5", textColor: "text-pink-500" },
  { name: "Publishing", icon: Globe, count: 145, color: "from-cyan-500/20 to-cyan-500/5", textColor: "text-cyan-500" },
  { name: "Design", icon: Lightbulb, count: 210, color: "from-orange-500/20 to-orange-500/5", textColor: "text-orange-500" },
];

export function CategoriesSection({ campaigns = [] }: { campaigns?: any[] }) {
  // Dynamically compute campaign counts per category
  const categoryCounts = campaigns.reduce((acc, campaign) => {
    if (campaign.category) {
      acc[campaign.category] = (acc[campaign.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Identify any categories from the database that aren't in our static list
  const staticCategoryNames = new Set(CATEGORIES.map(c => c.name));
  const dynamicCategories = Object.keys(categoryCounts)
    .filter(name => !staticCategoryNames.has(name) && categoryCounts[name] > 0)
    .map(name => ({
      name,
      icon: Layers,
      count: 0,
      color: "from-indigo-500/20 to-indigo-500/5",
      textColor: "text-indigo-500"
    }));

  const allCategories = [...CATEGORIES, ...dynamicCategories];

  return (
    <section className="py-24 relative overflow-hidden bg-neutral-50 dark:bg-[#0a0a0a] border-t border-neutral-100 dark:border-neutral-900">
      <motion.div
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 px-4">
            <motion.p 
              initial={{ opacity: 0, y: 30, scale: 1.2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-emerald-500 font-bold uppercase tracking-[0.25em] text-xs mb-3"
            >
              Discover Categories
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30, scale: 1.3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4"
            >
              Explore Interests
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30, scale: 1.2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-sm"
            >
              Find projects that align with your passions. Browse by top categories.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {allCategories.map((category, index) => {
              const activeCount = categoryCounts[category.name] || 0;
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + (index * 0.1),
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    href={`/explore?category=${encodeURIComponent(category.name)}`}
                    className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900/50 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className={`w-8 h-8 ${category.textColor}`} />
                    </div>
                    <h3 className="font-bold text-neutral-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {activeCount} Campaigns
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
