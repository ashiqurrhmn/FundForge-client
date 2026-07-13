"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const STATS = [
  { label: "Total Raised", value: "$45M+", suffix: "USD" },
  { label: "Successful Campaigns", value: "12,500+", suffix: "Projects" },
  { label: "Global Backers", value: "2.4M+", suffix: "People" },
];

export function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-[#050505] border-t border-neutral-100 dark:border-neutral-900">
      <motion.div
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto bg-neutral-900 dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden relative">
            
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="relative p-12 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
              
              {STATS.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + (index * 0.15),
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0"
                >
                  <div className="flex items-start text-emerald-400 mb-2">
                    <span className="text-5xl lg:text-7xl font-black tracking-tighter">
                      {stat.value}
                    </span>
                    <ArrowUpRight className="w-8 h-8 ml-1 text-emerald-500" />
                  </div>
                  <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-1">
                    {stat.label}
                  </h4>
                  <p className="text-neutral-500 text-xs font-medium uppercase tracking-[0.2em]">
                    {stat.suffix}
                  </p>
                </motion.div>
              ))}
              
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
