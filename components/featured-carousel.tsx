"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Campaign {
  _id: string;
  campaign_title: string;
  category: string;
  campaign_image_url: string;
  funding_goal: number;
  deadline: string;
  status: string;
  description?: string;
}

interface FeaturedCarouselProps {
  campaigns: Campaign[];
}

const AUTOPLAY_DURATION = 5000;

export function FeaturedCarousel({
  campaigns: allCampaigns,
}: FeaturedCarouselProps) {
  const campaigns = allCampaigns.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(2);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % campaigns.length);
  }, [campaigns.length]);

  useEffect(() => {
    const timer = setInterval(goNext, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [goNext, activeIndex]);

  if (campaigns.length === 0) return null;

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Calculate card positions for the 3D fan layout
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    if (absDiff > 2) {
      return {
        opacity: 0,
        scale: 0.5,
        x: diff > 0 ? 700 : -700,
        rotateY: 0,
        rotateZ: 0,
        y: 60,
        zIndex: 0,
        filter: "blur(12px)",
      };
    }

    return {
      x: diff * 220,
      y: absDiff === 0 ? 0 : absDiff === 1 ? 15 : 35,
      rotateY: diff * -10,
      rotateZ: diff * 1.5,
      scale: absDiff === 0 ? 1 : absDiff === 1 ? 0.85 : 0.72,
      opacity: absDiff === 0 ? 1 : absDiff === 1 ? 0.55 : 0.25,
      zIndex: 10 - absDiff,
      filter:
        absDiff === 0
          ? "blur(0px) brightness(1)"
          : absDiff === 1
            ? "blur(2px) brightness(0.8)"
            : "blur(5px) brightness(0.6)",
    };
  };

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white via-neutral-50 to-white dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Section Header */}
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
            Trending Now
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
            Featured Campaigns
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
            Discover the most inspiring projects making waves right now.
          </motion.p>
        </div>

        {/* 3D Fan Cards */}
        <div
          className="relative flex items-center justify-center h-[520px] md:h-[560px]"
          style={{ perspective: "1200px" }}
        >
          {campaigns.map((campaign, index) => {
            const style = getCardStyle(index);
            return (
              <motion.div
                key={campaign._id}
                animate={{
                  x: style.x,
                  y: style.y,
                  rotateY: style.rotateY,
                  rotateZ: style.rotateZ,
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  filter: style.filter,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={
                  index === activeIndex
                    ? { scale: 1.04, y: -10, transition: { duration: 0.3 } }
                    : {}
                }
                onClick={() => goTo(index)}
                className="absolute w-[260px] md:w-[300px] cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card */}
                <div className="relative bg-white dark:bg-[#1a1a1a] rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                  {/* Image Section */}
                  <div className="relative h-[260px] md:h-[280px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={campaign.campaign_image_url || "/assets/hero-10.png"}
                      alt={campaign.campaign_title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                        {campaign.category}
                      </span>
                    </div>

                    {/* Location pin on image */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-white/80 text-xs font-medium">
                        {campaign.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 pb-6 bg-white dark:bg-[#1a1a1a]">
                    {/* Title */}
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 truncate leading-tight">
                      {campaign.campaign_title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-5">
                      {campaign.description ||
                        `Support this incredible campaign and help bring "${campaign.campaign_title}" to life.`}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Target className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold">
                          {(campaign.funding_goal / 1000).toFixed(0)}k Cr
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold">
                          {getDaysLeft(campaign.deadline)} days
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/explore/${campaign._id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    >
                      Discover
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 h-2.5 bg-emerald-500"
                  : "w-2.5 h-2.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
